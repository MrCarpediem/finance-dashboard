from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    from app.config import Config
    app.config.from_object(Config)

    db.init_app(app)

    from app.routes import register_routes
    register_routes(app)

    @app.route("/health")
    def health():
        return {"success": True, "service": "analytics-service", "status": "running"}

    @app.errorhandler(404)
    def not_found(e):
        return {"success": False, "message": "Route not found"}, 404

    return app