#!/bin/bash

echo "$ git grep "style=" **/*.html"
COUNT="$(git grep -c 'style=' '**/*.html' | wc -l)"
COUNT="$((COUNT + 0))"

if [ $COUNT -eq 0 ]
then
    echo "git grep 'style=' **/*.html found nothing"
    echo "DANCI_STEP_SUMMARY_Congratulations, no style tags found"
    echo "DANCI_STEP_STATUS_SUCCESS"
else
    git grep -c 'style=' '**/*.html' | cat
    echo "DANCI_STEP_SUMMARY_Style tags found in $COUNT file(s)"
    echo "DANCI_STEP_STATUS_FAILURE"
fi
