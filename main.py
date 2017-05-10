from flask import Flask, redirect
from flask import render_template

app = Flask(__name__)
app.config.from_object('config')


@app.route('/', methods=['GET'])
def main():
  return render_template('index.html')
