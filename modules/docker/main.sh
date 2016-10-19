#!/bin/bash

echo ${CERT_PASSWORD} > /certs/password.file
openssl aes-256-cbc -d -in /certs/certs.tar.gz.enc < /certs/password.file | tar xz -C /
export DOCKER_CERT_PATH=/certs
export DOCKER_TLS_VERIFY=true

cat /certs/ca.pem

cd examples/apps/bookinfo
./build-services.sh
