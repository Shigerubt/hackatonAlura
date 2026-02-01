package com.alura.hackatonAlura.churn;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ChurnService {

    private final RestTemplate restTemplate;
    private final String dsUrl;
    private final PredictionRepository predictionRepository;

    private final AtomicInteger totalEvaluados = new AtomicInteger(0);
    private final AtomicInteger churnCount = new AtomicInteger(0);
    private static final Logger log = LoggerFactory.getLogger(ChurnService.class);

    public ChurnService(RestTemplate restTemplate,
                        @Value("${churn.ds.url:}") String dsUrl,
                        PredictionRepository predictionRepository) {
        this.restTemplate = restTemplate;
        this.dsUrl = dsUrl == null ? "" : dsUrl.trim();
        this.predictionRepository = predictionRepository;
    }

    public ChurnPredictionResponse predict(ChurnRequest req) {
        ChurnPredictionResponse res = null;
        if (!dsUrl.isEmpty()) {
            try {
                res = callDsService(req);
            } catch (RestClientException | IllegalArgumentException ex) {
                log.warn("Fallo al invocar DS: {}. Usando heurístico.", ex.getMessage());
                res = heuristicFallback(req);
            }
        } else {
            res = heuristicFallback(req);
        }
        totalEvaluados.incrementAndGet();
        if ("Va a cancelar".equalsIgnoreCase(res.getPrevision())) {
            churnCount.incrementAndGet();
        }

        //Calcular riskLevel
        String riskLevel = getRiskLevel(res.getPrediction());
        double prob = res.getPrediction() != null ? res.getPrediction().churn_probability : 0.0;

        // Persist
        Prediction p = new Prediction();
        p.setCreatedAt(Instant.now());
        p.setPrevision(res.getPrevision());
        p.setProbabilidad(res.getProbabilidad());
        // Persist minimal subset mapped to legacy columns for compatibility
        p.setTiempoContratoMeses(req.getTenure());
        p.setRetrasosPago(0); // campo legado sin equivalente directo
        p.setUsoMensual(req.getMonthlyCharges());
        // Persist motive-related fields for stats
        p.setContract(req.getContract());
        p.setInternetService(req.getInternetService());
        p.setOnlineSecurity(req.getOnlineSecurity());
        p.setSource(res.getTopFeatures() != null ? (dsUrl.isEmpty() ? "heuristic" : "DS") : (dsUrl.isEmpty() ? "heuristic" : "DS"));
        p.setRiskLevel(riskLevel);
        predictionRepository.save(p);
        log.info("Predicción: label={}, prob={}, source={}", res.getPrevision(), String.format("%.3f", res.getProbabilidad()), p.getSource());
        return res;
    }

    private String getRiskLevel(ChurnPredictionResponse.PredictionInfo prediction) {
        double prob = prediction != null ? prediction.churn_probability : 0.0;
        if (prob >= 0.70) {
            return "alto";
        } else if (prob >= 0.50) {
            return "medio";
        } else {
            return "bajo";
        }
    }


    public Map<String, Object> stats() {
        long total = predictionRepository.count();
        // Contar coincidencias con etiquetas comunes de churn ("Va a cancelar", "Yes", "True", "1")
        long churn = predictionRepository.findAll().stream()
                .filter(p -> p.getPrevision() != null && 
                       (p.getPrevision().equalsIgnoreCase("Va a cancelar") || 
                        p.getPrevision().equalsIgnoreCase("Yes") || 
                        p.getPrevision().equalsIgnoreCase("True")))
                .count();
        
        double tasa = total == 0 ? 0.0 : (double) churn / total;

        Map<String, Long> porRiesgo = new HashMap<>();
        porRiesgo.put("bajo", 0L);
        porRiesgo.put("medio", 0L);
        porRiesgo.put("alto", 0L);

        for (Object[] row : predictionRepository.countByRisk()) {
            if (row[0] == null) continue;
            String r = ((String) row[0]).toLowerCase();
            Long c = ((Number) row[1]).longValue();

            if (r.contains("alto")) porRiesgo.put("alto", c);
            else if (r.contains("medio")) porRiesgo.put("medio", c);
            else porRiesgo.put("bajo", c);
        }

        // Obtener última predicción para el dashboard
        Instant ultima = Instant.now();
        List<Prediction> tops = predictionRepository.findTop20ByOrderByProbabilidadDesc();
        if (!tops.isEmpty()) {
            ultima = tops.get(0).getCreatedAt();
        }

        // Motivos: derivados de campos persistidos
        long contratoMes = predictionRepository.findAll().stream()
            .filter(p -> {
                String c = p.getContract();
                return c != null && c.equals("Month-to-month");
            }).count();
        long fibraOptica = predictionRepository.findAll().stream()
            .filter(p -> {
                String i = p.getInternetService();
                return i != null && i.equals("Fiber optic");
            }).count();
        long sinSeguridad = predictionRepository.findAll().stream()
            .filter(p -> {
                String s = p.getOnlineSecurity();
                return s != null && s.equals("No");
            }).count();
        long cargosAltos = predictionRepository.findAll().stream()
            .filter(p -> p.getUsoMensual() != null && p.getUsoMensual() >= 90.0)
            .count();
        long otrosMotivos = Math.max(total - (contratoMes + fibraOptica + sinSeguridad + cargosAltos), 0);

        Map<String, Object> result = new HashMap<>();
        result.put("total_predicciones", total);
        result.put("total_evaluados", total);
        result.put("cancelaciones", churn);
        result.put("tasa_churn", tasa);
        result.put("por_riesgo", porRiesgo);
        result.put("motivos", Map.of(
            "contrato_mes_a_mes", contratoMes,
            "sin_seguridad_online", sinSeguridad,
            "fibra_optica", fibraOptica,
            "cargos_mensuales_altos", cargosAltos,
            "otros", otrosMotivos,
            "total", total
        ));
        result.put("ultima_prediccion", ultima);
        result.put("geografias", Map.of("Global", total));

        return result;
    }


    private ChurnPredictionResponse callDsService(ChurnRequest req) {
        // Contract: send nested features with canonical 20 variables
        java.util.Map<String, Object> features = new java.util.HashMap<>();
        features.put("gender", req.getGender());
        features.put("SeniorCitizen", req.getSeniorCitizen());
        features.put("Partner", req.getPartner());
        features.put("Dependents", req.getDependents());
        features.put("tenure", req.getTenure());
        features.put("PhoneService", req.getPhoneService());
        features.put("MultipleLines", req.getMultipleLines());
        features.put("InternetService", req.getInternetService());
        features.put("OnlineSecurity", req.getOnlineSecurity());
        features.put("OnlineBackup", req.getOnlineBackup());
        features.put("DeviceProtection", req.getDeviceProtection());
        features.put("TechSupport", req.getTechSupport());
        features.put("StreamingTV", req.getStreamingTV());
        features.put("StreamingMovies", req.getStreamingMovies());
        features.put("Contract", req.getContract());
        features.put("PaperlessBilling", req.getPaperlessBilling());
        features.put("PaymentMethod", req.getPaymentMethod());
        features.put("MonthlyCharges", req.getMonthlyCharges());
        features.put("TotalCharges", req.getTotalCharges() == null ? 0.0 : req.getTotalCharges());
        Map<String, Object> payload = Map.of("features", features);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        Map<?,?> response = restTemplate.postForObject(dsUrl, entity, Map.class);
        if (response == null) throw new IllegalArgumentException("Respuesta vacía del servicio DS");

        ChurnPredictionResponse out = new ChurnPredictionResponse();
        // Legacy fields
        Object prev = response.get("prevision");
        Object prob = response.get("probabilidad");
        Object tf = response.get("top_features");
        if (prev instanceof String) out.setPrevision((String) prev);
        if (prob instanceof Number) out.setProbabilidad(((Number) prob).doubleValue());
        if (tf instanceof List<?>) {
            List<String> top = ((List<?>) tf).stream().filter(x -> x instanceof String).map(x -> (String) x).limit(3).toList();
            out.setTopFeatures(top);
        }
        if (out.getTopFeatures() == null || out.getTopFeatures().isEmpty()) {
            out.setTopFeatures(List.of("tenure","Contract","PaymentMethod"));
        }

        // Enriched structure
        Map<?,?> meta = (Map<?,?>) response.get("metadata");
        Map<?,?> pred = (Map<?,?>) response.get("prediction");
        Map<?,?> biz = (Map<?,?>) response.get("business_logic");
        ChurnPredictionResponse.Metadata m = new ChurnPredictionResponse.Metadata();
        m.model_version = meta != null && meta.get("model_version") instanceof String ? (String) meta.get("model_version") : "v1.0";
        m.timestamp = Instant.now();
        out.setMetadata(m);
        ChurnPredictionResponse.PredictionInfo pi = new ChurnPredictionResponse.PredictionInfo();
        if (pred != null) {
            Object cp = pred.get("churn_probability");
            Object wc = pred.get("will_churn");
            Object rl = pred.get("risk_level");
            Object cs = pred.get("confidence_score");
            if (cp instanceof Number) pi.churn_probability = ((Number) cp).doubleValue();
            if (wc instanceof Number) pi.will_churn = ((Number) wc).intValue();
            if (rl instanceof String) pi.risk_level = (String) rl;
            if (cs instanceof Number) pi.confidence_score = ((Number) cs).doubleValue();
        } else {
            pi.churn_probability = out.getProbabilidad();
            pi.will_churn = pi.churn_probability >= 0.5 ? 1 : 0;
            pi.risk_level = pi.churn_probability >= 0.66 ? "Alto" : (pi.churn_probability >= 0.33 ? "Medio" : "Bajo");
            pi.confidence_score = Math.max(0.5, Math.abs(pi.churn_probability - 0.5) * 2);
        }
        out.setPrediction(pi);
        ChurnPredictionResponse.BusinessLogic bl = new ChurnPredictionResponse.BusinessLogic();
        if (biz != null && biz.get("suggested_action") instanceof String) {
            bl.suggested_action = (String) biz.get("suggested_action");
        } else {
            bl.suggested_action = pi.will_churn == 1 ? "Retención Prioritaria / Oferta de Lealtad" : "Upsell / Programa de Fidelización";
        }
        out.setBusiness_logic(bl);
        out.setTimestamp(Instant.now());
        return out;
    }

    private ChurnPredictionResponse heuristicFallback(ChurnRequest req) {
        // Minimal heuristic based on canonical fields
        double cTenure = -0.03 * (req.getTenure() != null ? req.getTenure() : 0);
        double cMonthly = -0.01 * (req.getMonthlyCharges() != null ? req.getMonthlyCharges() : 0.0);
        double cTotal = -0.005 * (req.getTotalCharges() != null ? req.getTotalCharges() : 0.0);
        double cSenior = (req.getSeniorCitizen() != null && req.getSeniorCitizen() == 1) ? 0.1 : 0.0;
        double cContract = "Month-to-month".equals(req.getContract()) ? 0.15 : ("Two year".equals(req.getContract()) ? -0.05 : 0.0);
        double cSecurity = "No".equals(req.getOnlineSecurity()) ? 0.08 : 0.0;
        double z = -1.0 + cTenure + cMonthly + cTotal + cSenior + cContract + cSecurity;
        double p = 1.0 / (1.0 + Math.exp(-z));
        String label = p >= 0.5 ? "Va a cancelar" : "Va a continuar";
        // Top features (approx)
        java.util.Map<String, Double> contrib = new java.util.HashMap<>();
        contrib.put("tenure", Math.abs(cTenure));
        contrib.put("Contract", Math.abs(cContract));
        contrib.put("OnlineSecurity", Math.abs(cSecurity));
        List<String> top = contrib.entrySet().stream()
                .sorted((a,b) -> Double.compare(b.getValue(), a.getValue()))
                .map(Map.Entry::getKey)
                .limit(3).toList();
        ChurnPredictionResponse out = new ChurnPredictionResponse(label, p, top, Instant.now());
        // Fill enriched fields
        ChurnPredictionResponse.Metadata m = new ChurnPredictionResponse.Metadata();
        m.model_version = "v1.0";
        m.timestamp = Instant.now();
        out.setMetadata(m);
        ChurnPredictionResponse.PredictionInfo pi = new ChurnPredictionResponse.PredictionInfo();
        pi.churn_probability = p;
        pi.will_churn = p >= 0.5 ? 1 : 0;
        pi.risk_level = p >= 0.66 ? "Alto Riesgo" : (p >= 0.33 ? "Riesgo Medio" : "Bajo Riesgo");
        pi.confidence_score = Math.max(0.5, Math.abs(p - 0.5) * 2);
        out.setPrediction(pi);
        ChurnPredictionResponse.BusinessLogic bl = new ChurnPredictionResponse.BusinessLogic();
        bl.suggested_action = pi.will_churn == 1 ? "Retención Prioritaria / Oferta de Lealtad" : "Upsell / Programa de Fidelización";
        out.setBusiness_logic(bl);
        return out;
    }

    public List<Prediction> topRiskPredictions() {
        return predictionRepository.findTop20ByOrderByProbabilidadDesc();
    }

    @Transactional
    public void clearPredictions() {
        predictionRepository.deleteAllPredictions();
    }
}
