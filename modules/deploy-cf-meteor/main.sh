#!/bin/bash
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

echo "cf push $APP_NAME -p $FILE_PATH -b https://github.com/cloudfoundry-community/cf-meteor-buildpack.git"
/script/cf push $APP_NAME -p $FILE_PATH -b https://github.com/cloudfoundry-community/cf-meteor-buildpack.git

if [ $? -eq 0 ]
then
    echo "cf push $APP_NAME -p $FILE_PATH -b https://github.com/cloudfoundry-community/cf-meteor-buildpack.git exited with 0"
    echo "DANCI_STEP_SUMMARY_Deployed $APP_NAME in org $DEPLOY_ORGANIZATION, space $DEPLOY_SPACE"
    echo "DANCI_STEP_STATUS_SUCCESS"
else
    echo "DANCI_ERROR_Error running cf push $APP_NAME -p $FILE_PATH -b https://github.com/cloudfoundry-community/cf-meteor-buildpack.git" >&2
    echo "DANCI_STEP_SUMMARY_Error running cf push $APP_NAME -p $FILE_PATH -b https://github.com/cloudfoundry-community/cf-meteor-buildpack.git"
    echo "DANCI_STEP_STATUS_FAILURE"
    exit
fi
