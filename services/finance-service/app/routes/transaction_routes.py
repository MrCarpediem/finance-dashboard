from flask import Blueprint
from app.controllers.transaction_controller import create, get_all, get_one, update, delete
from app.middleware.role_guard import require_auth, require_roles

bp = Blueprint("transactions", __name__)

bp.add_url_rule("/",         view_func=require_auth(get_all),                methods=["GET"])
bp.add_url_rule("/<txn_id>", view_func=require_auth(get_one),                methods=["GET"],    endpoint="get_one")
bp.add_url_rule("/",         view_func=require_roles("ADMIN")(create),       methods=["POST"])
bp.add_url_rule("/<txn_id>", view_func=require_roles("ADMIN")(update),       methods=["PUT"],    endpoint="update_put")
bp.add_url_rule("/<txn_id>", view_func=require_roles("ADMIN")(update),       methods=["PATCH"],  endpoint="update_patch")
bp.add_url_rule("/<txn_id>", view_func=require_roles("ADMIN")(delete),       methods=["DELETE"], endpoint="delete")
