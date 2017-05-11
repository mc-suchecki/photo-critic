import logging
import random
import sys
from flask import Flask
from flask import render_template
from flask import jsonify

app = Flask(__name__)
app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.ERROR)
app.config.from_object('config')


@app.route('/')
def homepage():
  return render_template('index.html')


@app.route('/rate-photo', methods=["PUT"])
def rate_photo():
  # print(request.json)
  # TODO so far the score is hardcoded in the backend
  score = random.randint(1, 100)
  print("works")
  return jsonify(score=score)

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)
