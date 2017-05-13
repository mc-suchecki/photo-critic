#!/bin/bash
echo $0: creating public and private key files

# Create the .ssh directory
mkdir -p ${HOME}/.ssh
chmod 700 ${HOME}/.ssh

# Create the public and private key files from the environment variables.
echo "${HEROKU_PUBLIC_KEY}" > ${HOME}/.ssh/heroku_id_rsa.pub
chmod 644 ${HOME}/.ssh/heroku_id_rsa.pub

# Note use of double quotes, required to preserve newlines
echo "${HEROKU_PRIVATE_KEY}" > ${HOME}/.ssh/heroku_id_rsa
chmod 600 ${HOME}/.ssh/heroku_id_rsa

# Preload the known_hosts file  (see "version 2" below)
echo 'mion.elka.pw.edu.pl,194.29.160.35 ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAvxNx6lUVVGL8K7xSY/lZG1ze8FMJC1HXBPVufH4IMT9YJ2mnReCGLqjmrBQdEHfA4Avv4XjCmUkA/k7XE7Mm0TfMaISgqmkI3YMBMWUtHnNquiRlNRsuYy+IzSgOQ2JnVyqygI10LVY01469CW/3yrq8ULq05Cn02PUkYzrxTwdkXsTz60YFDxH6wq2DzXimbUlCHqKNk2Pzmbx3gufUzKGbozJKEGkOJ8ESfB1o2fuezxhobwW18s8lybz9FeT2mFbbFo31Yu5ZzRymspe4OKB1c6p/tSSquRTx3mrPNkhVs0PY7t1L4KXlAa8aVGWqrI/dZRrolpZCeCv34dsNeQ==
' > ${HOME}/.ssh/known_hosts

# Start the SSH tunnel if not already running
SSH_CMD="ssh -f -i ${HOME}/.ssh/heroku_id_rsa -N -L 6666:localhost:3306 msucheck@mion.elka.pw.edu.pl"

PID=`pgrep -f "${SSH_CMD}"`
if [ $PID ] ; then
    echo $0: tunnel already running on ${PID}
else
    echo $0 launching tunnel
    $SSH_CMD
fi