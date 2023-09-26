from marshmallow import Schema, fields, validate

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

class TareaConUsuarioSchema(TareaSchema):
    usuario = fields.Nested("UsuarioSchema")