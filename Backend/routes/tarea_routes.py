from flask import Blueprint, jsonify, request
from db import db
from models import Tarea
from schemas import validate_json, TareaSchema, TareaConUsuarioSchema
from flask_jwt_extended import jwt_required, get_jwt_identity

tareas = Blueprint('tareas', __name__)

@tareas.get('') # type: ignore
def get_tareas():
    select = db.select(Tarea)
    tareas = db.session().execute(select).scalars().all()
    schema = TareaSchema(many=True)
    return jsonify(schema.dump(tareas))

@tareas.get('/<int:id>')
def get_tarea(id: int):
    tarea = db.get_or_404(Tarea, id)
    schema = TareaConUsuarioSchema()
    return jsonify(schema.dump(tarea))

@tareas.get('/usuario') # type: ignore
@jwt_required()
def get_tareas_usuario():
    id_usuario=get_jwt_identity()
    select = db.select(Tarea).where(Tarea.id_usuario == id_usuario)
    tareas = db.session().execute(select).scalars().all()
    schema = TareaSchema(many=True)
    return jsonify(schema.dump(tareas))

@tareas.post('') # type: ignore
@jwt_required()
@validate_json(TareaSchema)
def add_tareas():
    json = request.json
    if (json):
        tarea = Tarea(descripcion=json["descripcion"], realizada=json["realizada"], id_usuario=get_jwt_identity())
        db.session().add(tarea)
        db.session().commit()
        schema = TareaSchema()
        return jsonify(schema.dump(tarea)), 201

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
        db.session().commit()
        schema = TareaSchema()
        return jsonify(schema.dump(tarea))
    
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