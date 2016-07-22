#!/bin/bash
#Step: DANCI Setup
echo "$ nvm -v"
. /script/nvm/nvm.sh && nvm --version

# add if statement to use common languages
#if [ $LANGUAGE_VERSION -eq 4 ] || [ $LANGUAGE_VERSION -eq 5 ] || [ $LANGUAGE_VERSION -eq 6 ];
#then
#    echo "$ nvm use $LANGUAGE_VERSION"
#    . /script/nvm/nvm.sh && nvm use $LANGUAGE_VERSION
#else
#    echo "$ nvm install $LANGUAGE_VERSION"
#    . /script/nvm/nvm.sh && nvm install $LANGUAGE_VERSION
#fi

echo "$ nvm install $LANGUAGE_VERSION"
. /script/nvm/nvm.sh && nvm install $LANGUAGE_VERSION

if [ $? -eq 0 ]
then
    echo "nvm install $LANGUAGE_VERSION exited with 0"
    echo "DANCI_STEP_SUMMARY_nvm install $LANGUAGE_VERSION exited with 0"
    echo "DANCI_STEP_STATUS_SUCCESS"
else
    echo "DANCI_ERROR: running nvm install $LANGUAGE_VERSION" >&2
    echo "DANCI_STEP_SUMMARY_Error running nvm install $LANGUAGE_VERSION"
    echo "DANCI_STEP_STATUS_FAILURE"
    exit
fi

echo "$ node -v"
node -v

echo "$ npm -v"
npm -v

#Step: Install
if [ -z ${DANCI_INSTALL+x} ];
then
    echo "DANCI_NEXT_STEP_$ npm install"
    echo "$ npm install"
    npm install
    if [ $? -eq 0 ]
    then
        echo "npm install exited with 0"
        echo "DANCI_STEP_SUMMARY_npm install exited with 0"
        echo "DANCI_STEP_STATUS_SUCCESS"
    else
        echo "DANCI_ERROR: running npm install" >&2
        echo "DANCI_STEP_SUMMARY_Error running npm install"
        echo "DANCI_STEP_STATUS_FAILURE"
        exit
    fi
else
    IFS=',' read -ra install_arr <<< "$DANCI_INSTALL"
    for cmd in "${install_arr[@]}";
    do
        echo "DANCI_NEXT_STEP_$ $cmd"
        echo "$ $cmd"
        $cmd
        if [ $? -eq 0 ]
        then
            echo "$cmd exited with 0"
            echo "DANCI_STEP_SUMMARY_$cmd exited with 0"
            echo "DANCI_STEP_STATUS_SUCCESS"
        else
            echo "DANCI_ERROR: running $cmd" >&2
            echo "DANCI_STEP_SUMMARY_Error running $cmd"
            echo "DANCI_STEP_STATUS_FAILURE"
            exit
        fi
    done
fi

#Step: Test
if [ -z ${DANCI_TEST+x} ];
then
    echo "DANCI_NEXT_STEP_$ npm test"
    echo "$ npm test"
    npm test
    if [ $? -eq 0 ]
    then
        echo "npm test exited with 0"
        echo "DANCI_STEP_SUMMARY_npm test exited with 0"
        echo "DANCI_STEP_STATUS_SUCCESS"
    else
        echo "DANCI_ERROR: running npm test" >&2
        echo "DANCI_STEP_SUMMARY_Error running npm test"
        echo "DANCI_STEP_STATUS_FAILURE"
        exit
    fi
else
    IFS=',' read -ra test_arr <<< "$DANCI_TEST"
    for cmd in "${test_arr[@]}";
    do
        echo "DANCI_NEXT_STEP_$ $cmd"
        echo "$ $cmd"
        $cmd
        if [ $? -eq 0 ]
        then
            echo "$cmd exited with 0"
            echo "DANCI_STEP_SUMMARY_$cmd exited with 0"
            echo "DANCI_STEP_STATUS_SUCCESS"
        else
            echo "DANCI_ERROR: running $cmd" >&2
            echo "DANCI_STEP_SUMMARY_Error running $cmd"
            echo "DANCI_STEP_STATUS_FAILURE"
            exit
        fi
    done
fi
