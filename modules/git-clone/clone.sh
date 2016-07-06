#!/bin/bash
echo "$ git clone --branch=$BRANCH $GIT_URL $FILE_PATH"
echo -e "$GITHUB_SSH_KEY" > /id_rsa
chmod 600 /id_rsa
export GIT_SSH_COMMAND="ssh -i /id_rsa -o StrictHostKeyChecking=no"
git clone --branch=$BRANCH $GIT_URL $FILE_PATH
rm -rf /id_rsa
if [ $? -eq 0 ]
then
    echo "git clone exited with 0"
else
    echo "GC_ERROR: running git clone" >&2
    exit
fi
