#!/bin/bash
/script/cf api $DEPLOY_API
/script/cf login -u $DEPLOY_USERNAME -p $DEPLOY_PASSWORD -o $DEPLOY_ORGANIZATION -s $DEPLOY_SPACE
/script/cf push $APP_NAME -p $FILE_PATH
