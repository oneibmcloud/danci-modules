#!/bin/sh
echo "$ cd $FILE_PATH"
cd $FILE_PATH
echo "$ license-checker --json"
license-checker --json
