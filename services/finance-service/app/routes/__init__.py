from flask import Blueprint
from app.routes.transaction_routes import bp as transaction_bp

def register_routes(app):
    app.register_blueprint(transaction_bp, url_prefix="/api/transactions")