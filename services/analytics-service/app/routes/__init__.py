from app.routes.analytics_routes import bp as analytics_bp

def register_routes(app):
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")