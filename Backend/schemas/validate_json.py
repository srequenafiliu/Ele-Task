from functools import wraps
from flask import jsonify, request
from marshmallow import ValidationError

def validate_json(schema):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(*args, **kwargs):
            try:
                data = request.json
                schema_instance = schema()
                validated_data = schema_instance.load(data)
                request.validated_data = validated_data  # type: ignore # Almacena los datos validados
                return view_func(*args, **kwargs)
            except ValidationError as error:
                return (
                    jsonify(
                        {
                            "error": "Datos de entrada no válidos",
                            "messages": error.messages,
                        }
                    ),
                    400,
                )
        return wrapper
    return decorator