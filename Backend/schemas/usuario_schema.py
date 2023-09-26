from marshmallow import Schema, fields, validate

class UsuarioSchema(Schema):
    id = fields.Integer() # id es opcional
    nombre = fields.Str(
        required=True,
        error_messages={
            "required": "El nombre es obligatorio",
            "invalid": "El campo no tiene un formato de string"
        },
        validate=validate.Length(min=4, error="El nombre debe tener al menos 4 caracteres"),
    )
    email = fields.Str(
        required=True,
        error_messages={
            "required": "El correo electrónico es obligatorio",
            "invalid": "El campo no tiene un formato de string"
        },
        validate=validate.Email(error="El correo electrónico no tiene un formato válido"),
    )
    usuario = fields.Str(
        required=True,
        error_messages={
            "required": "El usuario es obligatorio",
            "invalid": "El campo no tiene un formato de string"
        },
        validate=validate.Length(min=4, error="El usuario debe tener al menos 4 caracteres"),
    )
    password = fields.Str(
        required=True,
        error_messages={
            "required": "La contraseña es obligatoria",
            "invalid": "El campo no tiene un formato de string"
        },
        validate=validate.Length(min=4, error="La contraseña debe tener al menos 4 caracteres"),
    )
    imagen = fields.Str(
        required=False,
        allow_none=True
    )

class UsuarioConTareasSchema(UsuarioSchema):
    tareas = fields.Nested("TareasSchema", many=True)