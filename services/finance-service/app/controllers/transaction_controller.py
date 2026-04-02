from flask import request, jsonify
from app.services.transaction_service import (
    create_transaction, get_all_transactions,
    get_transaction_by_id, update_transaction, delete_transaction
)
from app.schemas.transaction_schema import TransactionCreateSchema, TransactionUpdateSchema
from app.middleware.role_guard import get_current_user
from marshmallow import ValidationError

create_schema = TransactionCreateSchema()
update_schema = TransactionUpdateSchema()

def create():
    try:
        data = create_schema.load(request.get_json())
        user = get_current_user()
        txn  = create_transaction(data, user["id"])
        return jsonify({"success": True, "message": "Transaction created", "data": txn.to_dict()}), 201
    except ValidationError as e:
        return jsonify({"success": False, "message": "Validation failed", "errors": e.messages}), 400
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

def get_all():
    try:
        filters = {
            "type":      request.args.get("type"),
            "category":  request.args.get("category"),
            "date_from": request.args.get("date_from"),
            "date_to":   request.args.get("date_to"),
            "page":      request.args.get("page", 1),
            "limit":     request.args.get("limit", 10),
        }
        result = get_all_transactions(filters)
        return jsonify({"success": True, **result}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

def get_one(txn_id):
    try:
        txn = get_transaction_by_id(txn_id)
        return jsonify({"success": True, "data": txn.to_dict()}), 200
    except ValueError as e:
        return jsonify({"success": False, "message": str(e)}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

def update(txn_id):
    try:
        data = update_schema.load(request.get_json(), partial=True)
        txn  = update_transaction(txn_id, data)
        return jsonify({"success": True, "message": "Transaction updated", "data": txn.to_dict()}), 200
    except ValidationError as e:
        return jsonify({"success": False, "message": "Validation failed", "errors": e.messages}), 400
    except ValueError as e:
        return jsonify({"success": False, "message": str(e)}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

def delete(txn_id):
    try:
        txn = delete_transaction(txn_id)
        return jsonify({
            "success": True,
            "message": "Transaction deleted",
            "data":    {"id": txn.id, "deleted_at": txn.deleted_at.isoformat()}
        }), 200
    except ValueError as e:
        return jsonify({"success": False, "message": str(e)}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500