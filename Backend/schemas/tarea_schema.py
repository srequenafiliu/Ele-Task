from marshmallow import Schema, fields, validate, ValidationError
from datetime import datetime
import pytz

def validate_datetime(value:datetime):
    value = datetime.fromisoformat(str(value))
    value = value.replace(tzinfo=pytz.UTC)
    if value < datetime.now(pytz.UTC):
        raise ValidationError("La fecha no puede ser menor que la fecha actual")

class TareaSchema(Schema):
    id = fields.Integer() # id es opcional
    descripcion = fields.Str(
        required=True,
        error_messages={
            "required": "La descripción es obligatoria",
            "invalid": "El campo no tiene un formato de string"
        },
        validate=validate.Length(min=8, error="La descripción debe tener al menos 8 caracteres"),
    )
    realizada = fields.Bool(
        required=True,
        error_messages={
            "required": "Debe indicar si la tarea ha sido realizada o no",
            "invalid": "El campo no tiene un formato booleano"
        }
    )
    id_usuario = fields.Integer()
    fecha = fields.DateTime(
        required=False,
        validate=validate_datetime
    )

class TareaConUsuarioSchema(TareaSchema):
    usuario = fields.Nested("UsuarioSchema")