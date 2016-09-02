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

if [ -z ${DEPLOY_PATH+x} ];
then
    echo "cf push $APP_NAME-new -p $FILE_PATH --no-route"
    /script/cf push $APP_NAME-new -p $FILE_PATH --no-route

    if [ $? -eq 0 ]
    then
        echo "cf push $APP_NAME-new -p $FILE_PATH --no-route exited with 0"
    else
        echo "DANCI_ERROR_Error running cf push $APP_NAME-new -p $FILE_PATH --no-route" >&2
        echo "DANCI_STEP_SUMMARY_Error running cf push $APP_NAME-new -p $FILE_PATH --no-route"
        echo "DANCI_STEP_STATUS_FAILURE"
        exit
    fi

else
    echo "cd $DEPLOY_PATH"
    cd $DEPLOY_PATH

    if [ $? -eq 0 ]
    then
        echo "cd $DEPLOY_PATH exited with 0"
    else
        echo "DANCI_ERROR_Error running cd $DEPLOY_PATH" >&2
        echo "DANCI_STEP_SUMMARY_Error running cd $DEPLOY_PATH"
        echo "DANCI_STEP_STATUS_FAILURE"
        exit
    fi

    echo "cf push $APP_NAME-new --no-route"
    /script/cf push $APP_NAME-new --no-route

    if [ $? -eq 0 ]
    then
        echo "cf push $APP_NAME-new --no-route exited with 0"
    else
        echo "DANCI_ERROR_Error running cf push $APP_NAME-new --no-route" >&2
        echo "DANCI_STEP_SUMMARY_Error running cf push $APP_NAME-new --no-route"
        echo "DANCI_STEP_STATUS_FAILURE"
        exit
    fi
fi

echo "cf active-deploy-create $APP_NAME $APP_NAME-new --label NEW_$APP_NAME"
/script/cf active-deploy-create $APP_NAME $APP_NAME-new --label NEW_$APP_NAME

if [ $? -eq 0 ]
then
    echo "cf active-deploy-create $APP_NAME $APP_NAME-new --label NEW_$APP_NAME exited with 0"
else
    echo "DANCI_ERROR_Error running cf active-deploy-create $APP_NAME $APP_NAME-new --label NEW_$APP_NAME" >&2
    echo "DANCI_STEP_SUMMARY_Error running cf active-deploy-create $APP_NAME $APP_NAME-new --label NEW_$APP_NAME"
    echo "DANCI_STEP_STATUS_FAILURE"
    exit
fi

echo "cf active-deploy-advance NEW_$APP_NAME --force"
/script/cf active-deploy-advance NEW_$APP_NAME --force

if [ $? -eq 0 ]
then
    echo "cf active-deploy-advance NEW_$APP_NAME --force exited with 0"
else
    echo "DANCI_ERROR_Error running cf active-deploy-advance NEW_$APP_NAME --force" >&2
    echo "DANCI_STEP_SUMMARY_Error running cf active-deploy advance NEW_$APP_NAME --force"
    echo "DANCI_STEP_STATUS_FAILURE"
    exit
fi

echo "cf delete $APP_NAME"
/script/cf delete $APP_NAME

if [ $? -eq 0 ]
then
    echo "cf delete $APP_NAME exited with 0"
else
    echo "DANCI_ERROR_Error running cf delete $APP_NAME" >&2
    echo "DANCI_STEP_SUMMARY_Error running cf delete $APP_NAME"
    echo "DANCI_STEP_STATUS_FAILURE"
    exit
fi

echo "cf rename $APP_NAME-new $APP_NAME"
/script/cf rename $APP_NAME-new $APP_NAME

if [ $? -eq 0 ]
then
    echo "cf rename $APP_NAME-new $APP_NAME exited with 0"
else
    echo "DANCI_ERROR_Error running cf rename $APP_NAME-new $APP_NAME" >&2
    echo "DANCI_STEP_SUMMARY_Error running cf rename $APP_NAME-new $APP_NAME"
    echo "DANCI_STEP_STATUS_FAILURE"
    exit
fi
