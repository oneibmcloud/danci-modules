#!/bin/bash

echo "$ git grep -c 'console.' **/*.js"
COUNT="$(git grep -c 'console.' '**/*.js' | wc -l)"
COUNT="$((COUNT + 0))"

if [ $COUNT -eq 0 ]
then
    echo "git grep 'console.' **/*.js found nothing"
    echo "DANCI_STEP_SUMMARY_Congratulations, no console usage found"
    echo "DANCI_STEP_STATUS_SUCCESS"
else
    git grep -c 'console.' '**/*.js' | cat
    echo "DANCI_STEP_SUMMARY_console found in $COUNT file(s)"
    echo "DANCI_STEP_STATUS_FAILURE"
fi
