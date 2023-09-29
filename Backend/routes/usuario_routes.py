from flask import Blueprint, jsonify, request
from db import db
from models import Usuario
from schemas import validate_json, UsuarioSchema, UsuarioLoggedSchema, UsuarioConTareasSchema
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from urllib.parse import urlencode
import cloudinary
import cloudinary.uploader

usuarios = Blueprint('usuarios', __name__)

cloudinary.config(
  cloud_name = "dnysaui3k",
  api_key = "239394556466436",
  api_secret = "_xiv9APrG6uu7yMqAR48kWYXJ3o"
)

def guarda_imagen(json):
    response = cloudinary.uploader.upload(json["imagen"], folder='Ele-Task/images')
    return response["secure_url"]

@usuarios.get('') # type: ignore
def get_usuarios():
    select = db.select(Usuario)
    usuarios = db.session().execute(select).scalars().all()
    # Paginación de la API
    pag = request.args.get('pag', default=1, type=int)
    size = request.args.get('size', default=6, type=int)
    schema = UsuarioSchema(many=True)
    url = f'{request.host_url}usuarios'
    params = {}
    if size != 6:
        params['size'] = size
    params_next = params.copy()
    params_prev = params.copy()
    params_next['pag'] = pag+1
    if pag != 2:
        params_prev['pag'] = pag-1
    response = {
        'count': len(usuarios),
        'next': f'{url}?{urlencode(params_next)}' if len(usuarios) > pag*size else None,
        'previous': f'{url}?{urlencode(params_prev)}' if pag == 2 | ('pag' in params_prev and params_prev['pag'] != 0) else None,
        'result': schema.dump(usuarios[(pag-1)*size:pag*size])}
    return jsonify(response)

@usuarios.get('/logged')
@jwt_required()
def get_usuario_logueado():
    id_usuario=get_jwt_identity()
    usuario = db.get_or_404(Usuario, id_usuario)
    schema = UsuarioConTareasSchema()
    return jsonify(schema.dump(usuario))

@usuarios.put('/logged') # type: ignore
@jwt_required()
@validate_json(UsuarioLoggedSchema)
def update_usuario():
    id_usuario = get_jwt_identity()
    usuario = db.get_or_404(Usuario, id_usuario)
    json = request.json
    if (json):
        if usuario.password != json["password"]:
            return jsonify({"error": "Datos de entrada no válidos", "messages": {"password": ["Contraseña incorrecta"]}}), 403
        usuario.nombre = json["nombre"]
        usuario.email = json["email"]
        usuario.usuario = json["usuario"]
        if "imagen" in json and json["imagen"]==None:
            if usuario.imagen != None:
              cloudinary.uploader.destroy(usuario.imagen[usuario.imagen.index('Ele-Task'): -4])
            usuario.imagen = None
        elif not json["imagen"].startswith("http"): # base64
            ruta = guarda_imagen(json)
            if usuario.imagen != None:
              cloudinary.uploader.destroy(usuario.imagen[usuario.imagen.index('Ele-Task'): -4])
            usuario.imagen = ruta
        try:
            db.session().commit()
            schema = UsuarioConTareasSchema()
            return jsonify({"usuario": schema.dump(usuario)})
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
    
@usuarios.delete('/logged')
@jwt_required()
def delete_usuario():
    id_usuario=get_jwt_identity()
    usuario = db.get_or_404(Usuario, id_usuario)
    db.session().delete(usuario)
    db.session().commit()
    return "", 204