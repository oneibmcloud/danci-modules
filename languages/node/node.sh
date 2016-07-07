#!/bin/bash
#Stage: GC Setup
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

echo "$ node -v"
node -v

echo "$ npm -v"
npm -v

#Stage: Install
if [ -z ${GC_INSTALL+x} ];
then
    echo "GC_NEXT_STAGE_$ npm install"
    echo "$ npm install"
    npm install
    if [ $? -eq 0 ]
    then
        echo "npm install exited with 0"
    else
        echo "GC_ERROR: running npm install" >&2
        exit
    fi
else
    IFS=',' read -ra install_arr <<< "$GC_INSTALL"
    for cmd in "${install_arr[@]}";
    do
        echo "GC_NEXT_STAGE_$ $cmd"
        echo "$ $cmd"
        $cmd
        if [ $? -eq 0 ]
        then
            echo "$cmd exited with 0"
        else
            echo "GC_ERROR: running $cmd" >&2
            exit
        fi
    done
fi

#Stage: Test
if [ -z ${GC_TEST+x} ];
then
    echo "GC_NEXT_STAGE_$ npm test"
    echo "$ npm test"
    npm test
    if [ $? -eq 0 ]
    then
        echo "npm test exited with 0"
    else
        echo "GC_ERROR: running npm test" >&2
        exit
    fi
else
    IFS=',' read -ra test_arr <<< "$GC_TEST"
    for cmd in "${test_arr[@]}";
    do
        echo "GC_NEXT_STAGE_$ $cmd"
        echo "$ $cmd"
        $cmd
        if [ $? -eq 0 ]
        then
            echo "$cmd exited with 0"
        else
            echo "GC_ERROR: running $cmd" >&2
            exit
        fi
    done
fi
