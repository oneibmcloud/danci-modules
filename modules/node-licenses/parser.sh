#!/bin/bash
echo "node /script/parser.js"
node /script/parser.js
if [ $? -eq 0 ]
then
    echo "node licenses exited with 0"
    echo "DANCI_STEP_SUMMARY_LICENSE INFO HERE"
    echo "DANCI_STEP_STATUS_SUCCESS"
else
    echo "GC_ERROR: running node licenses" >&2
    echo "DANCI_STEP_SUMMARY_Error running node licenses"
    echo "DANCI_STEP_STATUS_FAILURE"
    exit
fi
