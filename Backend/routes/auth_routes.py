from flask import Blueprint, jsonify, request
from db import db
from models import Usuario
from schemas import validate_json, UsuarioSchema
from flask_jwt_extended import create_access_token
from PIL import Image
import io, base64, os

auth = Blueprint('auth', __name__)

def guarda_imagen(json):
    imagen_str = json["imagen"].split(",")[1] if json["imagen"].startswith("data") else json["imagen"]
    img = Image.open(io.BytesIO(base64.decodebytes(bytes(imagen_str, "utf-8"))))
    ruta = f"images/{json['usuario']}.jpg"
    img.convert('RGB').save(f"{os.path.dirname(__file__)}/../{ruta}")
    return ruta

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
@validate_json(UsuarioSchema)
def register():
    json = request.json
    if (json):
        ruta = guarda_imagen(json) if json["imagen"] else None
        usuario = Usuario(nombre= json["nombre"], email = json["email"], usuario = json["usuario"], password = json["password"],
                          imagen=request.host_url+ruta if json["imagen"] else None)
        db.session().add(usuario)
        db.session().commit()
        return jsonify(usuario), 201
