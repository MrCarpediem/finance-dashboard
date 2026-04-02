from datetime import datetime, timezone
from app.models import db
from app.models.transaction import Transaction

def create_transaction(data, user_id):
    txn = Transaction(
        amount     = data["amount"],
        type       = data["type"],
        category   = data["category"],
        date       = data["date"],
        notes      = data.get("notes"),
        created_by = user_id,
    )
    db.session.add(txn)
    db.session.commit()
    return txn

def get_all_transactions(filters):
    query = Transaction.query.filter(Transaction.deleted_at == None)

    if filters.get("type"):
        query = query.filter(Transaction.type == filters["type"])

    if filters.get("category"):
        query = query.filter(Transaction.category.ilike(f"%{filters['category']}%"))

    if filters.get("date_from"):
        query = query.filter(Transaction.date >= filters["date_from"])

    if filters.get("date_to"):
        query = query.filter(Transaction.date <= filters["date_to"])

    # Pagination
    page  = int(filters.get("page", 1))
    limit = int(filters.get("limit", 10))
    total = query.count()

    transactions = (
        query.order_by(Transaction.date.desc())
             .offset((page - 1) * limit)
             .limit(limit)
             .all()
    )

    return {
        "data": [t.to_dict() for t in transactions],
        "meta": {
            "page":        page,
            "limit":       limit,
            "total":       total,
            "total_pages": -(-total // limit),  # ceiling division
        },
    }

def get_transaction_by_id(txn_id):
    txn = Transaction.query.filter_by(id=txn_id, deleted_at=None).first()
    if not txn:
        raise ValueError("Transaction not found")
    return txn

def update_transaction(txn_id, data):
    txn = get_transaction_by_id(txn_id)
    for key, value in data.items():
        setattr(txn, key, value)
    txn.updated_at = datetime.now(timezone.utc)
    db.session.commit()
    return txn

def delete_transaction(txn_id):
    txn = get_transaction_by_id(txn_id)
    txn.deleted_at = datetime.now(timezone.utc)
    db.session.commit()
    return txn