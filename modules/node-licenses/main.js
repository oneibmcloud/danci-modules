var randomColor = require('randomcolor');
var checker = require('license-checker');

var aContainsB = function(a, b) {
    return a.indexOf(b) >= 0;
};

checker.init({
    start: process.env.FILE_PATH
}, function(json, err) {
    if (err) {
        console.log('DANCI_ERROR: running git clone');
        console.log('DANCI_STEP_SUMMARY_Error running git clone');
        return console.log('DANCI_STEP_STATUS_FAILURE');
    }
    var array = [];

    for (var module in json) {
        var tempKey = json[module];
        tempKey = tempKey.licenses;
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

    //sort in ascending order
    array.sort(function(a, b) {
        return b[1] - a[1];
    });

    //initialize data for chart
    var licenses = [];
    var licenses_counts = [];

    //build string for summary and fill data for chart
    var datastring = '';
    for (var m = 0; m < array.length - 1; m++) {
        datastring += array[m][0] + ' (' + array[m][1] + '), ';
        licenses.push(array[m][0]);
        licenses_counts.push(array[m][1]);
    }

    //final addition to datastring
    datastring += array[array.length - 1][0] + ' (' + array[array.length - 1][1] + ')';
    licenses.push(array[array.length - 1][0]);
    licenses_counts.push(array[array.length - 1][1]);

    var colors = randomColor({count: licenses_counts.length, hue: 'blue'});

    var chart_data = {
        labels: licenses,
        datasets: [
            {
                data: licenses_counts,
                backgroundColor: colors,
                hoverBackgroundColor: colors
            }
        ]
    };

    var data = {
        'title': 'Node.js License Info',
        'latest': true,
        'type': 'doughnut',
        'data': chart_data
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
