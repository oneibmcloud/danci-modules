#!/bin/bash
echo -e "$GITHUB_SSH_KEY" > /id_rsa
chmod 600 /id_rsa
export GIT_SSH_COMMAND="ssh -i /id_rsa -o StrictHostKeyChecking=no"

echo "$ git clone --branch=$BRANCH --depth=50 $GIT_URL $FILE_PATH"
git clone --branch=$BRANCH --depth=50 $GIT_URL $FILE_PATH

if [ -z ${PULL_ID+x} ];
then
    cd $FILE_PATH
    echo "$ git checkout $COMMIT_ID"
    git checkout $COMMIT_ID
else
    echo "$ cd $FILE_PATH"
    cd $FILE_PATH
    echo "$ git fetch origin pull/$PULL_ID/head:$PULL_ID"
    git fetch origin pull/$PULL_ID/head:$PULL_ID
    echo "$ git checkout $PULL_ID"
    git checkout $PULL_ID
fi

if [ $? -eq 0 ]
then
    echo "git clone exited with 0"
    echo "DANCI_STEP_SUMMARY_git clone $GIT_URL exited with 0"
    echo "DANCI_STEP_STATUS_SUCCESS"
    rm -rf /id_rsa
else
    echo "DANCI_ERROR_Error running git clone" >&2
    echo "DANCI_STEP_SUMMARY_Error running git clone"
    echo "DANCI_STEP_STATUS_FAILURE"
    rm -rf /id_rsa
    exit
fi
