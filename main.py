import logging
import random
import sys
import time
import io

from PIL import Image
from flask import Flask
from flask import render_template
from flask import jsonify
from flask import request

app = Flask(__name__)
app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.INFO)
app.config.from_object('config')


@app.route('/')
def homepage():
  return render_template('index.html')


@app.route('/rate-photo', methods=["PUT"])
def rate_photo():
  logger = logging.getLogger(__name__)
  logger.info('Received image: {} bytes, {}.'.format(request.content_length, request.content_type))
  logger.info('Reading data...')
  stream = io.BytesIO(request.data)
  img = Image.open(stream)
  logger.info('Done. Image size is {}x{} pixels.'.format(img.size[0], img.size[1]))
  # TODO send the photo to caffe deploy and retrieve the score
  time.sleep(2)
  score = random.randint(1, 100)
  return jsonify(score=score)

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)
