from flask import Blueprint, jsonify, request
from db import db
from models import Usuario
from schemas import validate_json, UsuarioSchema, UsuarioConTareasSchema
from flask_jwt_extended import jwt_required, get_jwt_identity
import io, base64, os
from urllib.parse import urlencode

usuarios = Blueprint('usuarios', __name__)

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

# @usuarios.post('') # type: ignore
# @jwt_required()
# @validate_json(TareaSchema)
# def add_tareas():
#     json = request.json
#     if (json):
#         tarea = Tarea(descripcion=json["descripcion"], realizada=json["realizada"], id_usuario=get_jwt_identity())
#         db.session().add(tarea)
#         db.session().commit()
#         schema = TareaSchema()
#         return jsonify(schema.dump(tarea)), 201

# @usuarios.put('/<int:id>') # type: ignore
# @jwt_required()
# @validate_json(TareaSchema)
# def update_tareas(id: int):
#     tarea = db.get_or_404(Tarea, id)
#     id_usuario=get_jwt_identity()
#     if tarea.usuario.id != id_usuario:
#         return jsonify({"error": "La tarea no es tuya"}), 403
#     json = request.json
#     if (json):
#         tarea.descripcion = json["descripcion"]
#         tarea.realizada = json["realizada"]
#         db.session().commit()
#         schema = TareaSchema()
#         return jsonify(schema.dump(tarea))
    
# @usuarios.delete('/<int:id>')
# @jwt_required()
# def delete_tarea(id: int):
#     tarea = db.get_or_404(Tarea, id)
#     id_usuario=get_jwt_identity()
#     if tarea.usuario.id != id_usuario:
#         return jsonify({"error": "La tarea no es tuya"}), 403
#     db.session().delete(tarea)
#     db.session().commit()
#     return "", 204