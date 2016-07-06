#!/bin/bash
echo -e "$GITHUB_SSH_KEY" > /id_rsa
chmod 600 /id_rsa
export GIT_SSH_COMMAND="ssh -i /id_rsa -o StrictHostKeyChecking=no"
# git revert...
rm -rf /id_rsa
