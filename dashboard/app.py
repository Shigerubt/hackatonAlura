import os
import io
import json
import requests
import pandas as pd
import streamlit as st


st.set_page_config(page_title="Churn Alert Dashboard", page_icon="📊", layout="wide")
st.title("Churn Alert Dashboard")
st.caption("Interactúa con la API para predecir churn, procesar CSV por lotes y ver estadísticas.")


def get_api_base_url():
    default_url = os.getenv("CHURN_API_URL", "http://localhost:8080")
    return st.sidebar.text_input("API base URL", value=default_url, help="Ej: http://localhost:8080")


def get_auth_token():
    return st.sidebar.text_input(
        "Bearer token (opcional)",
        type="password",
        help="Pega solo el valor del token o con el prefijo 'Bearer '. Ambos funcionan.",
    )


def _normalize_token(token: str | None) -> str | None:
    if not token:
        return None
    t = token.strip()
    if t.lower().startswith("bearer "):
        t = t.split(" ", 1)[1].strip()
    return t


def build_headers(token: str | None):
    headers = {"Content-Type": "application/json"}
    norm = _normalize_token(token)
    if norm:
        headers["Authorization"] = f"Bearer {norm}"
    return headers


def call_predict(api_url: str, payload: dict, token: str | None):
    try:
        resp = requests.post(f"{api_url}/api/churn/predict", headers=build_headers(token), data=json.dumps(payload), timeout=15)
        return resp
    except requests.RequestException as e:
        st.error(f"Error de red al llamar predict: {e}")
        return None


def call_stats(api_url: str, token: str | None):
    try:
        resp = requests.get(f"{api_url}/api/churn/stats", headers=build_headers(token), timeout=10)
        return resp
    except requests.RequestException as e:
        st.error(f"Error de red al llamar stats: {e}")
        return None


def call_batch_csv(api_url: str, csv_bytes: bytes, filename: str, token: str | None):
    try:
        headers = {}
        norm = _normalize_token(token)
        if norm:
            headers["Authorization"] = f"Bearer {norm}"
        files = {"file": (filename, io.BytesIO(csv_bytes), "text/csv")}
        resp = requests.post(f"{api_url}/api/churn/predict/batch/csv", headers=headers, files=files, timeout=30)
        return resp
    except requests.RequestException as e:
        st.error(f"Error de red al llamar batch CSV: {e}")
        return None


api_url = get_api_base_url()
token = get_auth_token()

tab_individual, tab_batch, tab_stats = st.tabs(["Predicción individual", "Batch CSV", "Estadísticas"])

with tab_individual:
    st.subheader("Predicción individual")
    st.caption("Esquema Telco (19 campos). Valores son sensibles a mayúsculas/minúsculas.")
    with st.form("form_individual"):
        col1, col2, col3 = st.columns(3)
        with col1:
            gender = st.selectbox("gender", options=["Male", "Female"], index=1)
            seniorCitizen = st.selectbox("SeniorCitizen", options=[0, 1], index=0)
            partner = st.selectbox("Partner", options=["Yes", "No"], index=0)
            dependents = st.selectbox("Dependents", options=["Yes", "No"], index=1)
            tenure = st.number_input("tenure (meses)", min_value=0, step=1, value=24)
            phoneService = st.selectbox("PhoneService", options=["Yes", "No"], index=0)
            multipleLines = st.selectbox("MultipleLines", options=["No", "Yes", "No phone service"], index=0)
        with col2:
            internetService = st.selectbox("InternetService", options=["DSL", "Fiber optic", "No"], index=0)
            onlineSecurity = st.selectbox("OnlineSecurity", options=["Yes", "No", "No internet service"], index=0)
            onlineBackup = st.selectbox("OnlineBackup", options=["Yes", "No", "No internet service"], index=1)
            deviceProtection = st.selectbox("DeviceProtection", options=["Yes", "No", "No internet service"], index=1)
            techSupport = st.selectbox("TechSupport", options=["Yes", "No", "No internet service"], index=1)
            streamingTV = st.selectbox("StreamingTV", options=["Yes", "No", "No internet service"], index=1)
            streamingMovies = st.selectbox("StreamingMovies", options=["Yes", "No", "No internet service"], index=1)
        with col3:
            contract = st.selectbox("Contract", options=["Month-to-month", "One year", "Two year"], index=1)
            paperlessBilling = st.selectbox("PaperlessBilling", options=["Yes", "No"], index=0)
            paymentMethod = st.selectbox("PaymentMethod", options=[
                "Electronic check", "Mailed check", "Bank transfer (automatic)", "Credit card (automatic)"
            ], index=0)
            monthlyCharges = st.number_input("MonthlyCharges", min_value=0.0, step=0.1, value=29.85)
            totalCharges_opt = st.text_input("TotalCharges (opcional)", value="1889.50")

        submitted = st.form_submit_button("Predecir")

    if submitted:
        payload = {
            "gender": gender,
            "SeniorCitizen": int(seniorCitizen),
            "Partner": partner,
            "Dependents": dependents,
            "tenure": int(tenure),
            "PhoneService": phoneService,
            "MultipleLines": multipleLines,
            "InternetService": internetService,
            "OnlineSecurity": onlineSecurity,
            "OnlineBackup": onlineBackup,
            "DeviceProtection": deviceProtection,
            "TechSupport": techSupport,
            "StreamingTV": streamingTV,
            "StreamingMovies": streamingMovies,
            "Contract": contract,
            "PaperlessBilling": paperlessBilling,
            "PaymentMethod": paymentMethod,
            "MonthlyCharges": float(monthlyCharges),
        }
        # TotalCharges opcional: vacío/null -> omitido para que backend normalice a 0.0
        tc = (totalCharges_opt or "").strip()
        if tc != "":
            try:
                payload["TotalCharges"] = float(tc)
            except ValueError:
                st.warning("TotalCharges inválido; se omitirá y el backend normalizará a 0.0.")

        resp = call_predict(api_url, payload, token)
        if resp is None:
            st.stop()

        if resp.status_code == 200:
            data = resp.json()
            # Campos legacy
            prevision = data.get("prevision")
            prob = data.get("probabilidad")
            top_feats = data.get("topFeatures") or data.get("top_features")
            # Campos enriquecidos
            metadata = data.get("metadata", {})
            prediction = data.get("prediction", {})
            business = data.get("business_logic", {})

            st.success("Predicción recibida")
            colA, colB, colC = st.columns(3)
            with colA:
                if prevision:
                    st.metric("Previsión", prevision)
                if isinstance(prob, (int, float)):
                    st.progress(min(max(prob, 0), 1))
                    st.caption(f"Probabilidad (legacy): {prob:.2f}")
            with colB:
                if prediction:
                    st.metric("Riesgo", prediction.get("risk_level", "-"))
                    cp = prediction.get("churn_probability")
                    if isinstance(cp, (int, float)):
                        st.progress(min(max(cp, 0), 1))
                        st.caption(f"Probabilidad (modelo): {cp:.2f}")
            with colC:
                if business and business.get("suggested_action"):
                    st.write("Acción sugerida:")
                    st.success(business.get("suggested_action"))
                if top_feats:
                    st.write("Top features:")
                    st.write(top_feats)
            if metadata:
                st.caption(f"Modelo: {metadata.get('model_version', 'N/A')} | TS: {metadata.get('timestamp', '')}")
            st.code(json.dumps(data, ensure_ascii=False, indent=2), language="json")
        elif resp.status_code == 400:
            try:
                err = resp.json()
                st.error("Error de validación")
                st.code(json.dumps(err, ensure_ascii=False, indent=2), language="json")
            except Exception:
                st.error(f"Solicitud inválida: {resp.text}")
        else:
            st.error(f"Error {resp.status_code}: {resp.text}")


with tab_batch:
    st.subheader("Predicción por lotes (CSV)")
    st.caption(
        "Encabezados requeridos: gender,SeniorCitizen,Partner,Dependents,tenure,PhoneService,MultipleLines,InternetService,OnlineSecurity,OnlineBackup,DeviceProtection,TechSupport,StreamingTV,StreamingMovies,Contract,PaperlessBilling,PaymentMethod,MonthlyCharges,TotalCharges"
    )
    uploaded = st.file_uploader("Subir CSV", type=["csv"])

    if uploaded is not None:
        # Vista previa local
        try:
            df_preview = pd.read_csv(uploaded)
            st.dataframe(df_preview.head(20), use_container_width=True)
        except Exception as e:
            st.warning(f"No se pudo leer el CSV para vista previa: {e}")

        # Enviar al backend
        resp = call_batch_csv(api_url, uploaded.getvalue(), uploaded.name, token)
        if resp is None:
            st.stop()

        if resp.status_code == 200:
            data = resp.json()
            items = data.get("items", [])
            total = data.get("total")
            cancelaciones = data.get("cancelaciones")
            st.success("Resultados del lote")
            st.write(f"Total: {total} | Cancelaciones: {cancelaciones}")
            try:
                st.dataframe(pd.DataFrame(items), use_container_width=True)
            except Exception:
                st.write(items)
            st.code(json.dumps(data, ensure_ascii=False, indent=2), language="json")
        elif resp.status_code == 400:
            try:
                err = resp.json()
                st.error("Error al procesar CSV")
                st.code(json.dumps(err, ensure_ascii=False, indent=2), language="json")
            except Exception:
                st.error(f"Solicitud inválida: {resp.text}")
        else:
            st.error(f"Error {resp.status_code}: {resp.text}")


with tab_stats:
    st.subheader("Estadísticas")
    resp = call_stats(api_url, token)
    if resp:
        if resp.status_code == 200:
            stats = resp.json()
            st.json(stats)
        else:
            st.warning(f"No disponible ({resp.status_code})")
