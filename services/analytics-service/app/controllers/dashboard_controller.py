from flask import request, jsonify
from app.services.summary_service import get_summary, get_category_totals, get_recent_activity
from app.services.trend_service import get_monthly_trends, get_weekly_trends

def summary():
    try:
        data = get_summary()
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

def category_totals():
    try:
        data = get_category_totals()
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

def recent_activity():
    try:
        limit = int(request.args.get("limit", 10))
        data  = get_recent_activity(limit)
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

def monthly_trends():
    try:
        data = get_monthly_trends()
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

def weekly_trends():
    try:
        data = get_weekly_trends()
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500