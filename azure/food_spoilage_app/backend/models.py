from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# -------------------- Prediction Table --------------------
class Prediction(db.Model):
    __tablename__ = "predictions"

    id          = db.Column(db.Integer, primary_key=True)
    food_item   = db.Column(db.String(100), nullable=False)
    temperature = db.Column(db.Float, nullable=False)
    humidity    = db.Column(db.Float, nullable=False)
    light       = db.Column(db.Float, nullable=False)
    co2         = db.Column(db.Float, nullable=False)
    prediction  = db.Column(db.String(20), nullable=False)
    confidence  = db.Column(db.Float, nullable=False)
    created_at  = db.Column(db.DateTime, default=db.func.current_timestamp())


# -------------------- Feedback Table --------------------
class Feedback(db.Model):
    __tablename__ = "feedback"

    id         = db.Column(db.Integer, primary_key=True)
    name       = db.Column(db.String(100), nullable=False)
    email      = db.Column(db.String(120), nullable=False)
    rating     = db.Column(db.Integer, nullable=False)
    message    = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())