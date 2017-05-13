import logging
import sys
import io
import zmq
import pexpect

from PIL import Image
from flask import Flask
from flask import render_template
from flask import jsonify
from flask import request
from os import environ
from zmq import ssh

# initialize Flask web server
app = Flask(__name__)
app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.INFO)
app.config.from_object('config')

# initialize zmq message queue
context = zmq.Context()
port = "6666"
ssh_password = environ.get("SSH_PASSWORD")
app.logger.info("Connecting to titan.elka.pw.edu.pl...")
socket = context.socket(zmq.REQ)
ssh.tunnel_connection(socket, "tcp://localhost:6666", "msucheck@mion.elka.pw.edu.pl", password=ssh_password)
app.logger.info("Connected!")


@app.route('/')
def homepage():
  return render_template('index.html')


@app.route('/rate-photo', methods=["PUT"])
def rate_photo():
  app.logger.info('Received image: {} bytes, {}.'.format(request.content_length, request.content_type))
  app.logger.info('Reading data...')
  stream = io.BytesIO(request.data)
  image = Image.open(stream)
  app.logger.info('Done. Size of the image is {}x{} pixels.'.format(image.size[0], image.size[1]))
  app.logger.info('Sending the image to titan.elka.pw.edu.pl...')
  socket.send(request.data)
  response = socket.recv_json()
  app.logger.info('Done. Photo got score of {}%.'.format(response['score']))
  return jsonify(response)


if __name__ == '__main__':
  app.run(debug=True, use_reloader=True)
