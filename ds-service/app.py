import os
import math
from typing import Tuple, List, Optional

from flask import Flask, request, jsonify
from flasgger import Swagger

try:
    import joblib  # type: ignore
except Exception:
    joblib = None

app = Flask(__name__)
swagger = Swagger(app)


# Heuristic fallback model (canonical fields)
def heuristic_score(features: dict) -> Tuple[str, float, List[str]]:
    tenure = float(features.get("tenure", 0) or 0)
    monthly = float(features.get("MonthlyCharges", 0.0) or 0.0)
    total = float(features.get("TotalCharges", 0.0) or 0.0)
    senior = int(features.get("SeniorCitizen", 0) or 0)
    contract = str(features.get("Contract", "") or "")
    online_security = str(features.get("OnlineSecurity", "") or "")

    c_tenure = -0.03 * tenure
    c_monthly = -0.01 * monthly
    c_total = -0.005 * total
    c_senior = 0.1 if senior == 1 else 0.0
    c_contract = 0.15 if contract == "Month-to-month" else (-0.05 if contract == "Two year" else 0.0)
    c_security = 0.08 if online_security == "No" else 0.0

    z = -1.0 + c_tenure + c_monthly + c_total + c_senior + c_contract + c_security
    p = 1.0 / (1.0 + math.exp(-z))
    label = "Va a cancelar" if p >= 0.5 else "Va a continuar"

    contrib = {
        "tenure": abs(c_tenure),
        "Contract": abs(c_contract),
        "OnlineSecurity": abs(c_security),
    }
    top = sorted(contrib, key=lambda k: contrib[k], reverse=True)[:3]
    return label, p, top


# Optional trained model loading
MODEL = None
FEATURE_NAMES: Optional[List[str]] = None
MODEL_VERSION: str = "v1.0"


# plan no longer used


def _to_vector(features: dict, names: List[str]) -> List[float]:
    # Map incoming canonical JSON features to vector if pipeline expects numeric order
    vec = []
    for n in names:
        v = features.get(n)
        try:
            vec.append(float(v if v is not None and v != "" else 0))
        except Exception:
            vec.append(0.0)
    return vec


def load_model():
    global MODEL, FEATURE_NAMES, MODEL_VERSION
    model_dir = os.getenv("CHURN_MODEL_DIR", "/models")
    v2_path = os.path.join(model_dir, "pipeline_churn_v2.joblib")
    pipeline_path = os.path.join(model_dir, "churn_pipeline.pkl")
    features_path = os.path.join(model_dir, "feature_names.pkl")
    if not joblib:
        return
    try:
        # Prefer v2 pipeline if available
        if os.path.exists(v2_path):
            print(f"Loading V2 model from {v2_path}...")
            MODEL = joblib.load(v2_path)
            FEATURE_NAMES = None  # DataFrame-based pipeline doesn’t require explicit feature names
            MODEL_VERSION = "v2.0"
            print("V2 model loaded successfully.")
            return
        # Fallback to legacy artifacts
        if os.path.exists(pipeline_path):
            print(f"Loading V1 model from {pipeline_path}...")
            MODEL = joblib.load(pipeline_path)
        if os.path.exists(features_path):
            print(f"Loading feature names from {features_path}...")
            FEATURE_NAMES = joblib.load(features_path)
        MODEL_VERSION = "v1.0"
    except Exception as e:
        # Keep fallback if loading fails
        print(f"Error loading model: {e}")
        MODEL = None
        FEATURE_NAMES = None
        MODEL_VERSION = "v1.0-fallback"


load_model()


def predict_with_model(features: dict) -> Optional[Tuple[str, float, List[str]]]:
    if MODEL is None:
        return None
    try:
        # If legacy feature names exist, use numeric vector path
        if FEATURE_NAMES is not None:
            vec = _to_vector(features, FEATURE_NAMES)
            import numpy as np  # local import to avoid hard dependency on startup
            X = np.array(vec, dtype=float).reshape(1, -1)
            if hasattr(MODEL, "predict_proba"):
                proba = MODEL.predict_proba(X)[0]
                p1 = float(proba[1]) if len(proba) > 1 else float(proba[0])
            else:
                if hasattr(MODEL, "decision_function"):
                    z = float(MODEL.decision_function(X)[0])
                    p1 = 1.0 / (1.0 + math.exp(-z))
                else:
                    pred = MODEL.predict(X)[0]
                    p1 = 0.8 if int(pred) == 1 else 0.2
            label = "Va a cancelar" if p1 >= 0.5 else "Va a continuar"
            top = FEATURE_NAMES[:3]
            return label, p1, top

        # v2: build DataFrame with encoded columns expected by the pipeline
        import pandas as pd
        
        # The model expects these exact 32 features based on its feature_names_in_
        expected_cols = [
            'tenure', 'MonthlyCharges', 'TotalCharges', 'gender_Male', 'SeniorCitizen_1',
            'SeniorCitizen_No', 'SeniorCitizen_Yes', 'Partner_Yes', 'Dependents_Yes',
            'PhoneService_Yes', 'MultipleLines_No phone service', 'MultipleLines_Yes',
            'InternetService_Fiber optic', 'InternetService_No',
            'OnlineSecurity_No internet service', 'OnlineSecurity_Yes',
            'OnlineBackup_No internet service', 'OnlineBackup_Yes',
            'DeviceProtection_No internet service', 'DeviceProtection_Yes',
            'TechSupport_No internet service', 'TechSupport_Yes',
            'StreamingTV_No internet service', 'StreamingTV_Yes',
            'StreamingMovies_No internet service', 'StreamingMovies_Yes',
            'Contract_One year', 'Contract_Two year', 'PaperlessBilling_Yes',
            'PaymentMethod_Credit card (automatic)', 'PaymentMethod_Electronic check',
            'PaymentMethod_Mailed check'
        ]

        # Helper to get raw value with defaults
        def get_raw(key, default=""):
            val = features.get(key)
            return val if val is not None else default

        # Map raw fields to expanded binary features
        row = {}
        # Numeric
        row['tenure'] = float(get_raw('tenure', 0))
        row['MonthlyCharges'] = float(get_raw('MonthlyCharges', 0.0))
        row['TotalCharges'] = float(get_raw('TotalCharges', 0.0))
        
        # Categorical mapping
        gender = str(get_raw('gender'))
        row['gender_Male'] = 1 if gender == "Male" else 0
        
        sc = str(get_raw('SeniorCitizen'))
        row['SeniorCitizen_1'] = 1 if sc in ("1", "1.0", 1) else 0
        row['SeniorCitizen_No'] = 1 if sc.lower() in ("0", "no", "0.0") else 0
        row['SeniorCitizen_Yes'] = 1 if sc.lower() in ("1", "yes", "1.0") else 0
        
        row['Partner_Yes'] = 1 if str(get_raw('Partner')) == "Yes" else 0
        row['Dependents_Yes'] = 1 if str(get_raw('Dependents')) == "Yes" else 0
        row['PhoneService_Yes'] = 1 if str(get_raw('PhoneService')) == "Yes" else 0
        
        ml = str(get_raw('MultipleLines'))
        row['MultipleLines_No phone service'] = 1 if ml == "No phone service" else 0
        row['MultipleLines_Yes'] = 1 if ml == "Yes" else 0
        
        isrv = str(get_raw('InternetService'))
        row['InternetService_Fiber optic'] = 1 if isrv == "Fiber optic" else 0
        row['InternetService_No'] = 1 if isrv == "No" else 0
        
        # Patterns for service-related dummies
        for feat, key, target in [
            ('OnlineSecurity_No internet service', 'OnlineSecurity', 'No internet service'),
            ('OnlineSecurity_Yes', 'OnlineSecurity', 'Yes'),
            ('OnlineBackup_No internet service', 'OnlineBackup', 'No internet service'),
            ('OnlineBackup_Yes', 'OnlineBackup', 'Yes'),
            ('DeviceProtection_No internet service', 'DeviceProtection', 'No internet service'),
            ('DeviceProtection_Yes', 'DeviceProtection', 'Yes'),
            ('TechSupport_No internet service', 'TechSupport', 'No internet service'),
            ('TechSupport_Yes', 'TechSupport', 'Yes'),
            ('StreamingTV_No internet service', 'StreamingTV', 'No internet service'),
            ('StreamingTV_Yes', 'StreamingTV', 'Yes'),
            ('StreamingMovies_No internet service', 'StreamingMovies', 'No internet service'),
            ('StreamingMovies_Yes', 'StreamingMovies', 'Yes')
        ]:
            row[feat] = 1 if str(get_raw(key)) == target else 0
            
        cntr = str(get_raw('Contract'))
        row['Contract_One year'] = 1 if cntr == "One year" else 0
        row['Contract_Two year'] = 1 if cntr == "Two year" else 0
        
        row['PaperlessBilling_Yes'] = 1 if str(get_raw('PaperlessBilling')) == "Yes" else 0
        
        pm = str(get_raw('PaymentMethod'))
        row['PaymentMethod_Credit card (automatic)'] = 1 if pm == "Credit card (automatic)" else 0
        row['PaymentMethod_Electronic check'] = 1 if pm == "Electronic check" else 0
        row['PaymentMethod_Mailed check'] = 1 if pm == "Mailed check" else 0

        X_df = pd.DataFrame([row], columns=expected_cols)

        # Probability
        if hasattr(MODEL, "predict_proba"):
            proba = MODEL.predict_proba(X_df)[0]
            p1 = float(proba[1]) if len(proba) > 1 else float(proba[0])
        elif hasattr(MODEL, "decision_function"):
            z = float(MODEL.decision_function(X_df)[0])
            p1 = 1.0 / (1.0 + math.exp(-z))
        else:
            pred = MODEL.predict(X_df)[0]
            p1 = 0.8 if int(pred) == 1 else 0.2

        label = "Va a cancelar" if p1 >= 0.5 else "Va a continuar"

        # Top features via transformed contributions (if available)
        top: List[str] = ["tenure", "Contract", "OnlineSecurity"]
        try:
            pipe = MODEL
            named = getattr(pipe, "named_steps", {})
            preproc = named.get("preprocessor") or named.get("columntransformer")
            clf = named.get("logisticregression") or named.get("classifier") or named.get("model") or pipe
            if preproc is not None and hasattr(preproc, "get_feature_names_out"):
                import numpy as np
                fnames = list(preproc.get_feature_names_out())
                X_tr = preproc.transform(X_df)
                
                # Try to get weights/importances
                weights = None
                if hasattr(clf, "coef_"):
                    weights = clf.coef_[0]
                elif hasattr(clf, "feature_importances_"):
                    weights = clf.feature_importances_
                
                if weights is not None:
                    xvec = X_tr[0].toarray()[0] if hasattr(X_tr, "toarray") else np.array(X_tr[0]).ravel()

                    def base_col(name: str) -> str:
                        # Improved mapping for OneHotEncoder (cat__col_val) or others
                        tail = name.split("__", 1)[1] if "__" in name else name
                        return tail.split("_", 1)[0]

                    grouped: dict[str, float] = {}
                    for i in range(min(len(fnames), len(weights), len(xvec))):
                        b = base_col(fnames[i])
                        # use weight * value for contribution
                        grouped[b] = grouped.get(b, 0.0) + float(abs(weights[i] * xvec[i]))
                    top = [k for k, _ in sorted(grouped.items(), key=lambda t: t[1], reverse=True)[:3]]
                else:
                    print(f"Classifier {type(clf)} has no coef_ or feature_importances_")
        except Exception as e:
            print(f"Error calculating top features: {e}")
            pass

        return label, p1, top
    except Exception:
        return None


@app.route("/predict", methods=["POST"])
def predict():
        """
        Predicción de churn (servicio DS)
        ---
        tags:
            - DS
        consumes:
            - application/json
        parameters:
            - in: body
                name: payload
                required: true
                schema:
                    type: object
                    properties:
                        features:
                            type: object
                            description: 20 variables canónicas según el esquema Telco
        responses:
            200:
                description: Respuesta enriquecida con compatibilidad histórica
                schema:
                    type: object
                    properties:
                        metadata:
                            type: object
                        prediction:
                            type: object
                        business_logic:
                            type: object
                        prevision:
                            type: string
                        probabilidad:
                            type: number
                        top_features:
                            type: array
                            items:
                                type: string
        """
        payload = request.get_json(silent=True) or {}
    feats = payload.get("features") or payload
    # Enforce input rules: case-sensitive strings, TotalCharges null->0.0
    if "TotalCharges" in feats and (feats["TotalCharges"] is None or feats["TotalCharges"] == ""):
        feats["TotalCharges"] = 0.0

    # Try model first, fallback to heuristic
    out = predict_with_model(feats)
    if out is None:
        out = heuristic_score(feats)
    label, prob, top = out

    # Enriched response
    risk = "Alto Riesgo" if prob >= 0.66 else ("Riesgo Medio" if prob >= 0.33 else "Bajo Riesgo")
    will = 1 if prob >= 0.5 else 0
    conf = max(0.5, abs(prob - 0.5) * 2)
    action = "Retención Prioritaria / Oferta de Lealtad" if will == 1 else "Upsell / Programa de Fidelización"

    return jsonify({
        "metadata": {"model_version": MODEL_VERSION, "timestamp": os.getenv("MODEL_TIMESTAMP", "")},
        "prediction": {
            "churn_probability": prob,
            "will_churn": will,
            "risk_level": risk,
            "confidence_score": conf
        },
        "business_logic": {"suggested_action": action},
        # Legacy keys for backward compatibility
        "prevision": label,
        "probabilidad": prob,
        "top_features": top
    })


@app.route("/")
def home():
    status = {
        "service": "ds",
        "modelLoaded": MODEL is not None and FEATURE_NAMES is not None
    }
    return jsonify(status)


@app.route("/health")
def health():
    return jsonify({"status": "UP"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
