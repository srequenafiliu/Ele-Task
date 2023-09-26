from flask import Flask
from db import db
from routes import rutas_tareas, rutas_auth
from flask_cors import CORS
from flask_jwt_extended import JWTManager

app = Flask(__name__)
CORS(app)

app.register_blueprint(rutas_tareas, url_prefix="/tareas")
app.register_blueprint(rutas_auth, url_prefix="/auth")

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///tareas_usuario.db"
app.config["JWT_SECRET_KEY"] = "clave_token"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 36000 # 10 horas

JWTManager(app)

db.init_app(app)

with app.app_context():
    db.create_all()

app.run()