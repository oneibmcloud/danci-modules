#!/bin/bash
set -x
echo ${CERT_PASSWORD} > /certs/password.file
openssl aes-256-cbc -d -in /certs/certs.tar.gz.enc < /certs/password.file | tar xz -C /
export DOCKER_CERT_PATH=/certs
export DOCKER_TLS_VERIFY=true
cat /certs/ca.pem

echo "cf api $DEPLOY_API"
/script/cf api $DEPLOY_API
if [ $? -eq 0 ]
then
    echo "cf api $DEPLOY_API exited with 0"
else
    echo "DANCI_ERROR_Error running cf api $DEPLOY_API" >&2
    echo "DANCI_STEP_SUMMARY_Error running cf api $DEPLOY_API"
    echo "DANCI_STEP_STATUS_FAILURE"
    exit
fi

echo "cf login -u $DEPLOY_USERNAME -p [PRIVATE] -o $DEPLOY_ORGANIZATION -s $DEPLOY_SPACE"
/script/cf login -u $DEPLOY_USERNAME -p $DEPLOY_PASSWORD -o $DEPLOY_ORGANIZATION -s $DEPLOY_SPACE
if [ $? -eq 0 ]
then
    echo "cf login -u $DEPLOY_USERNAME -p [PRIVATE] -o $DEPLOY_ORGANIZATION -s $DEPLOY_SPACE exited with 0"
else
    echo "DANCI_ERROR_Error running cf login -u $DEPLOY_USERNAME -p [PRIVATE] -o $DEPLOY_ORGANIZATION -s $DEPLOY_SPACE" >&2
    echo "DANCI_STEP_SUMMARY_Error running cf login -u $DEPLOY_USERNAME -p [PRIVATE] -o $DEPLOY_ORGANIZATION -s $DEPLOY_SPACE"
    echo "DANCI_STEP_STATUS_FAILURE"
    exit
fi

echo "cf ic login"
/script/cf ic login
if [ $? -eq 0 ]
then
    echo "cf ic login exited with 0"
else
    echo "DANCI_ERROR_Error running cf ic login" >&2
    echo "DANCI_STEP_SUMMARY_Error running cf ic login"
    echo "DANCI_STEP_STATUS_FAILURE"
    exit
fi

cd examples/apps/bookinfo
./build-services.sh todkap
