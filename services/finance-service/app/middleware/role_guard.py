import jwt
import os
from functools import wraps
from flask import request, jsonify

def get_current_user():
    """Extract user info injected by API Gateway headers."""
    return {
        "id":    request.headers.get("X-User-Id"),
        "role":  request.headers.get("X-User-Role"),
        "email": request.headers.get("X-User-Email"),
        "name":  request.headers.get("X-User-Name"),
    }

def require_roles(*roles):
    """Decorator — allows only specified roles."""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            user = get_current_user()
            if not user["role"]:
                return jsonify({"success": False, "message": "Not authenticated"}), 401
            if user["role"] not in roles:
                return jsonify({
                    "success": False,
                    "message": f"Access denied. Required: {' or '.join(roles)}"
                }), 403
            return f(*args, **kwargs)
        return wrapper
    return decorator

def require_auth(f):
    """Decorator — just checks user is authenticated (any role)."""
    @wraps(f)
    def wrapper(*args, **kwargs):
        user = get_current_user()
        if not user["id"] or not user["role"]:
            return jsonify({"success": False, "message": "Not authenticated"}), 401
        return f(*args, **kwargs)
    return wrapper