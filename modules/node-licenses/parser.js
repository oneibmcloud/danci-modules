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
                if (aContainsB(array[j][0], tempKey)) {
                    array[j][1]++;
                    check = false;
                    break;
                }
            }
            if (check) {
                var tempObject = [];
                tempObject.push(tempKey);
                tempObject.push(1);
                array.push(tempObject);

            }
        }
    }

    //sort in ascending order
        array.sort(
            function(a, b) {
                return a[1] - b[1];
            }
        );

    var data = {
        'latest': true,
        'type': 'segmented-bar',
        'data': array
    };

    console.log(array);
    console.log("DANCI_MODULE_DATA_" + JSON.stringify(data));

    //build string for summary
        var datastring = "DANCI_STEP_SUMMARY_";
        for (var m = 0; m < array.length - 1; m++) {
            datastring += array[m][0] + "(" + array[m][1] + "),";

        }


        //add last result
        datastring += array[array.length - 1][0] + "(" + array[array.length - 1][1] + ")";

        //print summary string
        console.log(datastring);
        console.log(DANCI_STEP_STATUS_SUCCESS);

    if (error !== null) {
        console.log('exec error: ' + error);
    }
});
