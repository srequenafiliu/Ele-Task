from flask import Blueprint, jsonify, request
from db import db
from models import Usuario
from schemas import validate_json, UsuarioLoggedSchema, UsuarioPasswordSchema
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
import cloudinary
import cloudinary.uploader

auth = Blueprint('auth', __name__)

cloudinary.config(
  cloud_name = "dnysaui3k",
  api_key = "239394556466436",
  api_secret = "_xiv9APrG6uu7yMqAR48kWYXJ3o"
)

def guarda_imagen(json):
    response = cloudinary.uploader.upload(json["imagen"], folder='Ele-Task/images')
    return response["secure_url"]

@auth.post('/login') # type: ignore
def login():
    json = request.json
    if (json):
        select = db.select(Usuario).where(Usuario.email == json["email"]).where(Usuario.password == json["password"])
        usuario = db.session().execute(select).scalars().one_or_none()
        if not usuario:
            return {"error": "Usuario y/o contraseña no válidos"}, 401
        token = create_access_token(identity=usuario.id)
        return jsonify({"accessToken": token})

@auth.post('/registro') # type: ignore
@validate_json(UsuarioLoggedSchema)
def register():
    json = request.json
    if (json):
        ruta = guarda_imagen(json) if "imagen" in json and json["imagen"]!=None else None
        usuario = Usuario(nombre= json["nombre"], email = json["email"], usuario = json["usuario"], password = json["password"], imagen=ruta)
        try:
            schema = UsuarioLoggedSchema()
            db.session().add(usuario)
            db.session().commit()
            return jsonify({"usuario": schema.dump(usuario)}), 201
        except IntegrityError as e:
            mensaje_error = {
                "error": "Datos de entrada no válidos",
                "messages": {}
            }
            if 'usuario.email' in str(e):
                mensaje_error['messages']['email'] = ['Este correo ya está registrado']
            elif 'usuario.usuario' in str(e):
                mensaje_error['messages']['usuario'] = ['Este usuario ya existe']
            return jsonify(mensaje_error), 500

@auth.put('/change_password') # type: ignore
@jwt_required()
@validate_json(UsuarioPasswordSchema)
def change_password_usuario():
    id_usuario = get_jwt_identity()
    usuario = db.get_or_404(Usuario, id_usuario)
    json = request.json
    if (json):
        if usuario.password != json["password"]:
            return jsonify({"error": "Datos de entrada no válidos", "messages": {"password": ["Contraseña incorrecta"]}}), 403
        usuario.password = json["new_password"]
        db.session().commit()
        return jsonify({"mensaje": "La contraseña se ha modificado correctamente"})