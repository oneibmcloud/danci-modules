#!/bin/bash

$HOME/.meteor/meteor npm install
$HOME/.meteor/meteor build --server-only --directory output
cp /script/package.json output
chmod -R u+w output
