from flask import Flask
from flask import request
import json
import requests
import random
      
app = Flask(__name__)


@app.route('/')
def main():
    return '<h1>Hello, World!</h1>'

@app.route('/hello')
def hello():
    return  json.dumps({"message": "Success"})