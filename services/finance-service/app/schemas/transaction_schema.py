from marshmallow import Schema, fields, validate, validates, ValidationError
from datetime import date

class TransactionCreateSchema(Schema):
    amount   = fields.Decimal(required=True, places=2)
    type     = fields.Str(required=True, validate=validate.OneOf(["income", "expense"]))
    category = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    date     = fields.Date(required=True)
    notes    = fields.Str(load_default=None)

    @validates("amount")
    def validate_amount(self, value):
        if value <= 0:
            raise ValidationError("Amount must be greater than 0")

class TransactionUpdateSchema(Schema):
    amount   = fields.Decimal(places=2)
    type     = fields.Str(validate=validate.OneOf(["income", "expense"]))
    category = fields.Str(validate=validate.Length(min=1, max=100))
    date     = fields.Date()
    notes    = fields.Str()

    @validates("amount")
    def validate_amount(self, value):
        if value <= 0:
            raise ValidationError("Amount must be greater than 0")