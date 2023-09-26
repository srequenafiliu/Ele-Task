from flask import Flask, send_file
from db import db
from routes import rutas_tareas, rutas_auth, rutas_usuarios
from flask_cors import CORS
from flask_jwt_extended import JWTManager

app = Flask(__name__)
CORS(app)

@app.get('/images/<filename>')
def serve_image(filename):
    print(filename)
    image_path = 'images/' + filename
    return send_file(image_path, mimetype='image/jpeg') 

app.register_blueprint(rutas_tareas, url_prefix="/tareas")
app.register_blueprint(rutas_auth, url_prefix="/auth")
app.register_blueprint(rutas_usuarios, url_prefix="/usuarios")

app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+mysqlconnector://root:@localhost:3306/eletask"
app.config["JWT_SECRET_KEY"] = "clave_token"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 36000 # 10 horas

JWTManager(app)

db.init_app(app)

with app.app_context():
    db.create_all()

app.run()