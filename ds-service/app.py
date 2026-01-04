import os
import math
from typing import Tuple, List, Optional

from flask import Flask, request, jsonify

try:
    import joblib  # type: ignore
except Exception:
    joblib = None

app = Flask(__name__)


# Heuristic fallback model (mirrors Java fallback)
def heuristic_score(features: dict) -> Tuple[str, float, List[str]]:
    retrasos = float(features.get("retrasos_pago", 0))
    tiempo = float(features.get("tiempo_contrato_meses", 0))
    uso = float(features.get("uso_mensual", 0))

    c_retrasos = 0.08 * retrasos
    c_tiempo = -0.03 * tiempo
    c_uso = -0.02 * uso

    z = -1.0 + c_retrasos + c_tiempo + c_uso
    p = 1.0 / (1.0 + math.exp(-z))
    label = "Va a cancelar" if p >= 0.5 else "Va a continuar"

    contrib = {
        "retrasos_pago": abs(c_retrasos),
        "tiempo_contrato_meses": abs(c_tiempo),
        "uso_mensual": abs(c_uso),
    }
    top = sorted(contrib, key=lambda k: contrib[k], reverse=True)[:3]
    return label, p, top


# Optional trained model loading
MODEL = None
FEATURE_NAMES: Optional[List[str]] = None


# plan no longer used


def _to_vector(features: dict, names: List[str]) -> List[float]:
    # Map incoming JSON features to vector using provided feature names
    mapping = {
        "tiempo_contrato_meses": lambda v: float(v or 0),
        "retrasos_pago": lambda v: float(v or 0),
        "uso_mensual": lambda v: float(v or 0.0),
    }
    vec = []
    for n in names:
        fn = mapping.get(n)
        if fn:
            vec.append(fn(features.get(n)))
        elif n == "plan":
            # if an older model still expects 'plan', feed neutral 0.0
            vec.append(0.0)
        else:
            try:
                vec.append(float(features.get(n, 0)))
            except Exception:
                vec.append(0.0)
    return vec


def load_model():
    global MODEL, FEATURE_NAMES
    model_dir = os.getenv("CHURN_MODEL_DIR", "/models")
    pipeline_path = os.path.join(model_dir, "churn_pipeline.pkl")
    features_path = os.path.join(model_dir, "feature_names.pkl")
    if not joblib:
        return
    try:
        if os.path.exists(pipeline_path):
            MODEL = joblib.load(pipeline_path)
        if os.path.exists(features_path):
            FEATURE_NAMES = joblib.load(features_path)
    except Exception as e:
        # Keep fallback if loading fails
        MODEL = None
        FEATURE_NAMES = None


load_model()


def predict_with_model(features: dict) -> Optional[Tuple[str, float, List[str]]]:
    if MODEL is None or FEATURE_NAMES is None:
        return None
    try:
        vec = _to_vector(features, FEATURE_NAMES)
        import numpy as np  # local import to avoid hard dependency on startup
        X = np.array(vec, dtype=float).reshape(1, -1)
        if hasattr(MODEL, "predict_proba"):
            proba = MODEL.predict_proba(X)[0]
            p1 = float(proba[1]) if len(proba) > 1 else float(proba[0])
        else:
            # Fallback to decision_function or predict as probability proxy
            if hasattr(MODEL, "decision_function"):
                z = float(MODEL.decision_function(X)[0])
                p1 = 1.0 / (1.0 + math.exp(-z))
            else:
                pred = MODEL.predict(X)[0]
                p1 = 0.8 if int(pred) == 1 else 0.2
        label = "Va a cancelar" if p1 >= 0.5 else "Va a continuar"

        # Approximate feature contributions if coef_ exists
        top = FEATURE_NAMES[:]
        try:
            lr = getattr(MODEL, "named_steps", {}).get("logisticregression") or MODEL
            coef = getattr(lr, "coef_", None)
            if coef is not None:
                w = coef[0]
                contrib = {FEATURE_NAMES[i]: abs(w[i] * vec[i]) for i in range(len(FEATURE_NAMES))}
                top = sorted(contrib, key=lambda k: contrib[k], reverse=True)[:3]
        except Exception:
            top = FEATURE_NAMES[:3]

        return label, p1, top
    except Exception:
        return None


@app.route("/predict", methods=["POST"])
def predict():
    payload = request.get_json(silent=True) or {}
    feats = payload.get("features") or payload
    # Try model first, fallback to heuristic
    out = predict_with_model(feats)
    if out is None:
        out = heuristic_score(feats)
    label, prob, top = out
    return jsonify({
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
