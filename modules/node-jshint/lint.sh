if [ -z ${DANCI_INSTALL+x} ];
then
jshint $JSHINT_PATH
else
echo "Please set JS_HINT in the config path"
fi
