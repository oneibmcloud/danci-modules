#!/bin/sh
echo "$ node -v"
node -v
echo "$ cd $FILE_PATH"
cd $FILE_PATH
echo "$FILE_PATH"
echo "$ license-checker --json"
license-checker --json
