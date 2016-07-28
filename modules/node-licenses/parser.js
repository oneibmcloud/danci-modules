var exec = require('child_process').exec;
var child;
var array = [];
var command = 'license-checker';
var util = require('util');

var aContainsB = function(a, b) {
    return a.indexOf(b) >= 0;
};

//reading input of license-scanner
child = exec(command, function(error, stdout, stderr) {
    if (error) {
        console.log('exec error: ' + error);
    }

    var lines = stdout.split('\n');

    //iterate through each line of output
    for (var i = 0; i < lines.length; i++) {

        //check if the current line is lists the license
        if (aContainsB(lines[i], 'licenses: ')) {
            var tempKey = lines[i].split('licenses: ')[1];
            //make a new object that contains the license object

            var check = true;

            //iterate through the array with license objects
            for (var j = 0; j < array.length; j++) {
                //console.log('Object.keys(array[j]): '+Object.keys(array[j]));
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
    array.sort(function(a, b) {
        return b[1] - a[1];
    });

    //initialize data for chart
    var licenses = [];
    var count = [];

    //build string for summary and fill data for chart
    var datastring;
    for (var m = 0; m < array.length - 1; m++) {
        datastring += array[m][0] + ' (' + array[m][1] + '), ';
        licenses.push(array[m][0] + ' (' + array[m][1] + ')');
        count.push(array[m][1]);
    }

    //final addition to datastring
    datastring += array[array.length - 1][0] + ' (' + array[array.length - 1][1] + ')';
    licenses.push(array[array.length - 1][0] + ' (' + array[array.length - 1][1] + ')');
    count.push(array[array.length - 1][1]);

    var chart_data = {
        labels: licenses,
        datasets: [
            {
                data: count
            }
        ]
    };

    var data = {
        'type': 'doughnut',
        'latest': true,
        'data': chart_data,
        'title': 'Node.js License Info',
        'animation': {
            animateScale: true
        }
    };

    //print all results

    //print to show ouput to console
    console.log(array);

    // //print to store in module database
    console.log('DANCI_MODULE_DATA_' + JSON.stringify(data));

    // //print summary string
    console.log('DANCI_STEP_SUMMARY_' + datastring);
    console.log('DANCI_STEP_STATUS_SUCCESS');
});
