from flask import Blueprint
from app.controllers.dashboard_controller import (
    summary, category_totals, recent_activity,
    monthly_trends, weekly_trends
)
from app.middleware.role_guard import require_roles

bp = Blueprint("analytics", __name__)

# ANALYST + ADMIN only
bp.add_url_rule("/summary",          view_func=require_roles("ADMIN","ANALYST")(summary),          methods=["GET"])
bp.add_url_rule("/categories",       view_func=require_roles("ADMIN","ANALYST")(category_totals),  methods=["GET"])
bp.add_url_rule("/recent",           view_func=require_roles("ADMIN","ANALYST")(recent_activity),  methods=["GET"])
bp.add_url_rule("/trends/monthly",   view_func=require_roles("ADMIN","ANALYST")(monthly_trends),   methods=["GET"])
bp.add_url_rule("/trends/weekly",    view_func=require_roles("ADMIN","ANALYST")(weekly_trends),    methods=["GET"])