from sqlalchemy import text
from app import db

def get_summary():
    result = db.session.execute(text("""
        SELECT
            COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 0) AS total_income,
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense,
            COALESCE(SUM(CASE WHEN type = 'income'  THEN amount
                              WHEN type = 'expense' THEN -amount ELSE 0 END), 0) AS net_balance,
            COUNT(*) AS total_transactions
        FROM transactions
        WHERE deleted_at IS NULL
    """)).fetchone()

    return {
        "total_income":       float(result.total_income),
        "total_expense":      float(result.total_expense),
        "net_balance":        float(result.net_balance),
        "total_transactions": int(result.total_transactions),
    }

def get_category_totals():
    rows = db.session.execute(text("""
        SELECT
            category,
            type,
            COALESCE(SUM(amount), 0) AS total,
            COUNT(*) AS count
        FROM transactions
        WHERE deleted_at IS NULL
        GROUP BY category, type
        ORDER BY total DESC
    """)).fetchall()

    return [
        {
            "category": r.category,
            "type":     r.type,
            "total":    float(r.total),
            "count":    int(r.count),
        }
        for r in rows
    ]

def get_recent_activity(limit=10):
    rows = db.session.execute(text("""
        SELECT id, amount, type, category, date, notes, created_at
        FROM transactions
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC
        LIMIT :limit
    """), {"limit": limit}).fetchall()

    return [
        {
            "id":         r.id,
            "amount":     float(r.amount),
            "type":       r.type,
            "category":   r.category,
            "date":       r.date.isoformat(),
            "notes":      r.notes,
            "created_at": r.created_at.isoformat(),
        }
        for r in rows
    ]