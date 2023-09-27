from marshmallow import Schema, fields, validate

class UsuarioSchema(Schema):
    id = fields.Integer() # id es opcional
    usuario = fields.Str(
        required=True,
        error_messages={
            "required": "El usuario es obligatorio",
            "invalid": "El campo no tiene un formato de string"
        },
        validate=validate.Length(min=4, error="El usuario debe tener al menos 4 caracteres"),
    )
    imagen = fields.Str()

class UsuarioLoggedSchema(UsuarioSchema):
    nombre = fields.Str(
        required=True,
        error_messages={
            "required": "El nombre es obligatorio",
            "invalid": "El campo no tiene un formato de string"
        },
        validate={
            validate.Length(min=4, error="El nombre debe tener al menos 4 caracteres"),
            validate.Regexp(regex="\D", error="El nombre no puede contener números"),
        }
    )
    email = fields.Str(
        required=True,
        error_messages={
            "required": "El correo electrónico es obligatorio",
            "invalid": "El campo no tiene un formato de string"
        },
        validate=validate.Email(error="El correo electrónico no tiene un formato válido"),
    )
    password = fields.Str(
        required=True,
        error_messages={
            "required": "La contraseña es obligatoria",
            "invalid": "El campo no tiene un formato de string"
        },
        validate=validate.Regexp(regex="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$",
                                 error="La contraseña no tiene un formato válido"),
    )

class UsuarioConTareasSchema(UsuarioLoggedSchema):
    tareas = fields.Nested("TareaSchema", many=True)