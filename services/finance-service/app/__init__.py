from flask import Flask
from app.models import db
from app.config import Config
from app.routes import register_routes

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)

    with app.app_context():
        db.create_all()

    register_routes(app)

    @app.route("/health")
    def health():
        return {
            "success":   True,
            "service":   "finance-service",
            "status":    "running",
        }

    @app.errorhandler(404)
    def not_found(e):
        return {"success": False, "message": "Route not found"}, 404

    @app.errorhandler(500)
    def server_error(e):
        return {"success": False, "message": "Internal server error"}, 500

    return app