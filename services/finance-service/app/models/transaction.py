import uuid
from datetime import datetime, timezone
from app.models import db

class Transaction(db.Model):
    __tablename__ = "transactions"

    id          = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    amount      = db.Column(db.Numeric(12, 2), nullable=False)
    type        = db.Column(db.Enum("income", "expense", name="txn_type"), nullable=False)
    category    = db.Column(db.String(100), nullable=False)
    date        = db.Column(db.Date, nullable=False)
    notes       = db.Column(db.Text, nullable=True)
    created_by  = db.Column(db.String(36), nullable=False)  # user id from JWT
    deleted_at  = db.Column(db.DateTime, nullable=True)     # soft delete
    created_at  = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at  = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                            onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id":         self.id,
            "amount":     float(self.amount),
            "type":       self.type,
            "category":   self.category,
            "date":       self.date.isoformat(),
            "notes":      self.notes,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }