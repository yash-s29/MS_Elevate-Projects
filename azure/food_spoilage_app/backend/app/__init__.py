from flask import Flask
from flask_cors import CORS
from models import db
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    CORS(app)

    # Register routes
    from .routes.prediction import prediction_bp
    from .routes.feedback import feedback_bp

    app.register_blueprint(prediction_bp, url_prefix="/api")
    app.register_blueprint(feedback_bp, url_prefix="/api")

    return app