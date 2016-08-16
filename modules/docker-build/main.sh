#!/bin/bash
echo "docker build -t $IMAGE_NAME $FILE_PATH"
docker build -t $IMAGE_NAME $FILE_PATH

if [ $? -eq 0 ]
then
    echo "docker build -t $IMAGE_NAME $FILE_PATH exited with 0"
else
    echo "DANCI_STEP_SUMMARY_Error running docker build -t $IMAGE_NAME $FILE_PATH"
    echo "DANCI_STEP_STATUS_FAILURE"
    echo "DANCI_ERROR_Error running docker build -t $IMAGE_NAME $FILE_PATH" >&2
    exit
fi

echo "docker push $IMAGE_NAME (not actually run)"
#docker push $IMAGE_NAME

if [ $? -eq 0 ]
then
    echo "docker push $IMAGE_NAME exited with 0"
    echo "DANCI_STEP_SUMMARY_Pushed image $IMAGE_NAME"
    echo "DANCI_STEP_STATUS_SUCCESS"
else
    echo "DANCI_ERROR_Error running docker push $IMAGE_NAME" >&2
    echo "DANCI_STEP_SUMMARY_Error running docker push $IMAGE_NAME"
    echo "DANCI_STEP_STATUS_FAILURE"
    exit
fi
