import os
import math
import pandas as pd
from typing import Tuple, List, Optional

from flask import Flask, request, jsonify

try:
    import joblib  # type: ignore
except Exception:
    joblib = None

app = Flask(__name__)

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


MODEL = None

def load_model():
    global MODEL, MODEL_META
    model_dir = os.getenv("CHURN_MODEL_DIR", "/models")
    pipeline_path = os.path.join(model_dir, "churn_model_v1.joblib")

    try:
        obj = joblib.load(pipeline_path)

        if isinstance(obj, dict):
            MODEL = obj["model"]              # 👈 PIPELINE REAL
            MODEL_META = {
                "threshold": obj.get("threshold"),
                "features": obj.get("features"),
                "model_version": obj.get("model_version")
            }
        else:
            MODEL = obj
            MODEL_META = {}

    except Exception as e:
        MODEL = None
        MODEL_META = {}

load_model()


def predict_with_model(features: dict) -> Optional[Tuple[str, float, List[str]]]:
    if MODEL is None:
        return None
    try:
        df = pd.DataFrame([features])
        p1 = float(MODEL.predict_proba(df)[0][1])
        label = "Va a cancelar" if p1 >= 0.5 else "Va a continuar"
        top = []
        return label, p1, top

    except Exception as e:
        return None


@app.route("/predict", methods=["POST"])
def predict():
    payload = request.get_json(silent=True) or {}
    feats = payload.get("features") or payload

    if "TotalCharges" in feats and (feats["TotalCharges"] is None or feats["TotalCharges"] == ""):
        feats["TotalCharges"] = 0.0

    # Try model first, fallback to heuristic
    out = predict_with_model(feats)
    source = "model"
    if out is None:
        out = heuristic_score(feats)
        source = "heuristic"

    label, prob, top = out

     # Enriched response
    risk = ("Alto Riesgo" if prob >= 0.66 else "Riesgo Medio" if prob >= 0.33 else "Bajo Riesgo")
    will = 1 if prob >= 0.5 else 0
    conf = max(0.5, abs(prob - 0.5) * 2)
    action = (
        "Retención Prioritaria / Oferta de Lealtad"
        if will == 1
        else "Upsell / Programa de Fidelización"
    )

    return jsonify({
        "metadata": {
            "model_version": "v1.1",
            "source": source
        },
        "prediction": {
            "churn_probability": prob,
            "will_churn": will,
            "risk_level": risk,
            "confidence_score": conf
        },
        "business_logic": {
            "suggested_action": action
        },
        # legacy keys
        "prevision": label,
        "probabilidad": prob,
        "top_features": top
    })


@app.route("/")
def home():
    status = {
        "service": "ds",
        "modelLoaded": MODEL is not None
    }
    return jsonify(status)


@app.route("/health")
def health():
    return jsonify({"status": "UP"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)