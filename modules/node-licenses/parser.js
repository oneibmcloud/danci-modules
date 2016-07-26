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
            return b[1] - a[1];
        }
    );

    //initialize data for chart
    chart_array = [];
    var licenses = ['License'];
    var count = ['License Info'];


    //build string for summary and fill data for chart
    var datastring = "DANCI_STEP_SUMMARY_";
    for (var m = 0; m < array.length - 1; m++) {
        datastring += array[m][0] + " (" + array[m][1] + "), ";
        licenses.push(array[m][0]);
        licenses.push({
            role: 'annotation'
        });
        count.push(array[m][1]);
        count.push(array[m][1].toString());

    }

    //final addition to datastring
    datastring += array[array.length - 1][0] + " (" + array[array.length - 1][1] + ")";

    //push licenses and count to final data array
    chart_array.push(licenses);
    chart_array.push(count);


    var data = {
        'type': "BarChart",
        'latest': true,
        'data': chart_array,
        'options': {
            isStacked: true,
            hAxis: {
                baselineColor: 'transparent',
                textPosition: 'none',
                gridlines: {
                    color: 'transparent'
                }
            },
            vAxis: {
                baselineColor: 'transparent',
                textPosition: 'none'
            },
            backgroundColor: {
                fill: 'transparent'
            },
            legend: {
                position: 'none'
            }
        }
    };

    //print all results

    //print to show ouput to console
     console.log(array);
    //
    // //print to store in module database
     console.log("DANCI_MODULE_DATA_" + JSON.stringify(data));
    //
    // //print summary string
     console.log(datastring);
     console.log('DANCI_STEP_STATUS_SUCCESS');

    if (error !== null) {
        console.log('exec error: ' + error);
    }
});
