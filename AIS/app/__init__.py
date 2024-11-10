from flask import Flask
from app.routes import api_blueprint

def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    # Register Blueprints
    app.register_blueprint(api_blueprint, url_prefix="/api")

    return app
