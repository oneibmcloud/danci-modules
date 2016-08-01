echo "node /script/sendemail.js"
node /script/sendemail.js

if [ $? -eq 0 ]
then
    echo "send email exited with 0"
else
    echo "DANCI_ERROR: running send email" >&2
    echo "DANCI_STEP_SUMMARY_Error running send email"
    echo "DANCI_STEP_STATUS_FAILURE"
    exit
fi
