from sqlalchemy import text
from app import db

def get_monthly_trends():
    rows = db.session.execute(text("""
        SELECT
            TO_CHAR(date, 'YYYY-MM') AS month,
            COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 0) AS income,
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense,
            COALESCE(SUM(CASE WHEN type = 'income'  THEN amount
                              WHEN type = 'expense' THEN -amount END), 0) AS net
        FROM transactions
        WHERE deleted_at IS NULL
        GROUP BY TO_CHAR(date, 'YYYY-MM')
        ORDER BY month DESC
        LIMIT 12
    """)).fetchall()

    return [
        {
            "month":   r.month,
            "income":  float(r.income),
            "expense": float(r.expense),
            "net":     float(r.net),
        }
        for r in rows
    ]

def get_weekly_trends():
    rows = db.session.execute(text("""
        SELECT
            TO_CHAR(DATE_TRUNC('week', date), 'YYYY-MM-DD') AS week_start,
            COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 0) AS income,
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense
        FROM transactions
        WHERE deleted_at IS NULL
        GROUP BY DATE_TRUNC('week', date)
        ORDER BY week_start DESC
        LIMIT 8
    """)).fetchall()

    return [
        {
            "week_start": r.week_start,
            "income":     float(r.income),
            "expense":    float(r.expense),
        }
        for r in rows
    ]