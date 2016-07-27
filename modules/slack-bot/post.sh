#!/bin/bash
# if[[0 -eq 0]]
# then
# fi
DANCI_BUILD_FAILURE=false
zero=0
if [[ $zero -eq $DANCI_BUILD_FAILURE ]]
  then
      curl -X POST -H 'Content-type: application/json' --data @message.json https://hooks.slack.com/services/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
  else
    echo "Build Failed";
fi
