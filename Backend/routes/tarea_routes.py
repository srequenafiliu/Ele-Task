from flask import Blueprint, jsonify, request
from sqlalchemy import asc, desc
from db import db
from models import Tarea
from schemas import validate_json, TareaSchema, TareaConUsuarioSchema
from flask_jwt_extended import jwt_required, get_jwt_identity
from urllib.parse import urlencode
from datetime import datetime

tareas = Blueprint('tareas', __name__)

@tareas.get('') # type: ignore
def get_tareas():
    select = db.select(Tarea)
    tareas = db.session().execute(select).scalars().all()
    schema = TareaSchema(many=True)
    return jsonify(schema.dump(tareas))

@tareas.get('/<int:id>')
@jwt_required()
def get_tarea(id: int):
    tarea = db.get_or_404(Tarea, id)
    schema = TareaConUsuarioSchema()
    return jsonify(schema.dump(tarea))

@tareas.get('/usuario') # type: ignore
@jwt_required()
def get_tareas_usuario():
    id_usuario=get_jwt_identity()
    select = db.select(Tarea).where(Tarea.id_usuario == id_usuario)
    realizada = request.args.get('realizada', type=int)
    # Paginación de la API
    pag = request.args.get('pag', default=1, type=int)
    size = request.args.get('size', default=3, type=int)
    schema = TareaSchema(many=True)
    url = f'{request.host_url}tareas/usuario'
    params = {}
    if size != 3:
        params['size'] = size
    if realizada != None:
        select = select.where(Tarea.realizada == realizada).order_by(asc(Tarea.fecha) if realizada == 0 else desc(Tarea.id))
        params['realizada'] = realizada
    params_next = params.copy()
    params_prev = params.copy()
    params_next['pag'] = pag+1
    if pag != 2:
        params_prev['pag'] = pag-1
    tareas = db.session().execute(select).scalars().all()
    if realizada is False: # Se reordena la lista de tareas para mover las tareas sin fechas a los últimos lugares
        tareas = sorted(tareas, key=lambda tarea: (0, tarea.fecha) if tarea.fecha is not None else (1,))
    response = {
        'count': len(tareas),
        'next': f'{url}?{urlencode(params_next)}' if len(tareas) > pag*size else None,
        'previous': f'{url}?{urlencode(params_prev)}' if pag == 2 | ('pag' in params_prev and params_prev['pag'] != 0) else None,
        'result': schema.dump(tareas[(pag-1)*size:pag*size])}
    return jsonify(response)

@tareas.post('') # type: ignore
@jwt_required()
@validate_json(TareaSchema)
def add_tarea():
    json = request.json
    if (json):
        fecha = None
        if "fecha" in json:
            fecha = datetime.fromisoformat(str(json["fecha"]))
        tarea = Tarea(descripcion=json["descripcion"], realizada=json["realizada"], id_usuario=get_jwt_identity(), fecha=fecha)
        db.session().add(tarea)
        db.session().commit()
        schema = TareaSchema()
        return jsonify({'tarea': schema.dump(tarea)}), 201

@tareas.put('/<int:id>') # type: ignore
@jwt_required()
@validate_json(TareaSchema)
def update_tareas(id: int):
    tarea = db.get_or_404(Tarea, id)
    id_usuario=get_jwt_identity()
    if tarea.usuario.id != id_usuario:
        return jsonify({"error": "La tarea no es tuya"}), 403
    json = request.json
    if (json):
        tarea.descripcion = json["descripcion"]
        tarea.realizada = json["realizada"]
        if not "fecha" in json:
            tarea.fecha = None
        else:
            tarea.fecha = datetime.fromisoformat(str(json["fecha"]))
        db.session().commit()
        schema = TareaSchema()
        return jsonify({'tarea': schema.dump(tarea)})
    
@tareas.delete('/<int:id>')
@jwt_required()
def delete_tarea(id: int):
    tarea = db.get_or_404(Tarea, id)
    id_usuario=get_jwt_identity()
    if tarea.usuario.id != id_usuario:
        return jsonify({"error": "La tarea no es tuya"}), 403
    db.session().delete(tarea)
    db.session().commit()
    return "", 204