import os

class Config:
    # Change these credentials to match your MySQL setup
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "mysql+pymysql://root:Yss2005@localhost:3307/spoilage_ai"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get("SECRET_KEY", "spoilageai-secret-key-2025")