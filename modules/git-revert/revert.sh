#!/bin/bash
echo -e "$GITHUB_SSH_KEY" > /id_rsa
chmod 600 /id_rsa
export GIT_SSH_COMMAND="ssh -i /id_rsa -o StrictHostKeyChecking=no"

echo "$ git clone --branch=$BRANCH --depth=50 $GIT_URL $FILE_PATH"
git clone --branch=$BRANCH $GIT_URL $FILE_PATH
git revert $SHA
