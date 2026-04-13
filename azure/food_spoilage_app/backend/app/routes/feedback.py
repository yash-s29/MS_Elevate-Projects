from flask import Blueprint, request, jsonify
from models import db, Feedback

feedback_bp = Blueprint("feedback_bp", __name__)


# ───────────── POST /feedback ─────────────
@feedback_bp.route("/feedback", methods=["POST"])
def save_feedback():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input provided"}), 400

    name    = data.get("name", "").strip()
    email   = data.get("email", "").strip()
    rating  = data.get("rating")
    message = data.get("message", "").strip()

    # Required field validation
    if not name or not email or not message or rating is None:
        return jsonify({"error": "All fields are required"}), 400

    # Rating type + range
    try:
        rating = int(rating)
    except (ValueError, TypeError):
        return jsonify({"error": "Rating must be a number"}), 400

    if rating < 1 or rating > 5:
        return jsonify({"error": "Rating must be between 1 and 5"}), 400

    try:
        fb = Feedback(name=name, email=email, rating=rating, message=message)
        db.session.add(fb)
        db.session.commit()
        print(f"✅ Feedback saved — id: {fb.id}")
    except Exception as e:
        db.session.rollback()
        print("❌ DB error saving feedback:", str(e))
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "Feedback saved successfully", "id": fb.id}), 200


# ───────────── GET /feedback (list all) ─────────────
@feedback_bp.route("/feedback", methods=["GET"])
def list_feedback():
    records = Feedback.query.order_by(Feedback.id.desc()).all()
    return jsonify([
        {
            "id":         r.id,
            "name":       r.name,
            "email":      r.email,
            "rating":     r.rating,
            "message":    r.message,
            "created_at": str(r.created_at) if r.created_at else ""
        }
        for r in records
    ]), 200 