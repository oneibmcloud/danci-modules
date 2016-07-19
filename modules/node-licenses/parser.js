var exec = require('child_process').exec;
var child;
var array = [];
var command = "license-checker";
var util = require('util');

var aContainsB = function(a, b) {
    return a.indexOf(b) >= 0;
};

//reading input of license-scanner
child = exec(command, function(error, stdout, stderr) {
    var lines = stdout.split('\n');

    //iterate through each line of output
    for (var i = 0; i < lines.length; i++) {

        //check if the current line is lists the license
        if (aContainsB(lines[i], "licenses: ")) {
            var tempKey = lines[i].split("licenses: ")[1];
            //make a new object that contains the license object

            var check = true;

            //iterate through the array with license objects
            for (var j = 0; j < array.length; j++) {
                //console.log("Object.keys(array[j]): "+Object.keys(array[j]));
                //if it already has this object, update count
                if (aContainsB(array[j].license, tempKey)) {
                    array[j].count++;
                    check = false;
                    break;
                }
            }
            if (check) {
                var tempObject = {};
                tempObject.license = tempKey;
                tempObject.count = 1;
                array.push(tempObject);

            }

        }
    }

    var data = {
        'module_name': 'node-licenses',
        'latest': true,
        'type': 'segmented-bar',
        'data': array
    };

    console.log(JSON.stringify(data));
    console.log("DANCI_MODULE_DATA_" + JSON.stringify(data));

    if (error !== null) {
        console.log('exec error: ' + error);
    }
});
