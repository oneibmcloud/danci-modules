## Docker Images

[DanCI Image Repository](https://hub.docker.com/r/danci/)

#### Languages
- [x] [Node.js](languages/node)
- [ ] Java
- [ ] PHP
- [ ] Ruby

#### Modules
- [x] Git Clone (For Internal Use)
- [ ] Git Revert (For Internal Use)
- [x] [Deploy: Cloud Foundry](modules/deploy-cf)
- [x] [Node Licenses](modules/node-licenses)

Docker modules communicate with through certain keywords and environment variables. The following environment variables are passed from DanCI to modules:

- `FILE_PATH`: The location that files will be downloaded to from GitHub.
- `DANCI_BUILD_FAILED`: A boolean that is true if the build failed, or false if there were no errors so far.
- `LANGUAGE_VERSION`: This will only be set if a language image is used and the version is defined in the .danci.json config file.
- `DANCI_INSTALL` & `DANCI_TEST`: These will be set if an install and/or test array of commands is set to override the default image install/test commands.

These environment variables can be used by your module if needed, such as 'DANCI_BUILD_FAILED' to determine what message to send in a notify module. Additional environment variables can be set per module under `env` in your .danci.json file.

<b>Please note, the default working directory for every container will be where your files were downloaded to, so please set file paths accordingly.</b>

The following keywords can be used by your module to pass information back to DanCI:

- `DANCI_ERROR`: Use this keyword when an exit code is not 0. This will set the build failed flag to true.
- `DANCI_NEXT_STEP`: By default, each container will be shown as one step in the dashboard. Use this keyword to split a container into multiple steps.
- `DANCI_MODULE_DATA`: Use this flag to pass data to be graphed by DanCI. Detailed instructions below.
- `DANCI_STEP_SUMMARY`: Pass in a quick summary of a step to be displayed without having to expand a log in the dashboard.
- `DANCI_STEP_STATUS`: Set the status of the step. The value should be either be `DANCI_STEP_STATUS_SUCCESS` or `DANCI_STEP_STATUS_FAILURE` Use this in conjunction with DANCI_STEP_SUMMARY

To use these keywords, simply output the keyword, followed by an underscore, and then your additional information. Example:

```
echo "DANCI_STEP_SUMMARY_Installed Node $node_version, NPM v$npm_version"
echo "DANCI_STEP_STATUS_SUCCESS"
```

Module Data:
Module data is currently visualized through the use of Google Charts. To properly use module data with DanCI, pass in the following fields as a JSON object, following `DANCI_MODULE_DATA_`
- `type`: The type of chart
- `latest`: Set `true` if only the data from the latest build should be shown on repository module data page, `false` if the data should be charted over time.
- `data`: Properly formatted data for your chart
- `options`: Specific UI options for your chart

More information on how to format `data` and `options` can be found here - [developers.google.com/chart](https://developers.google.com/chart/interactive/docs/)

Example:
```
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
console.log("DANCI_MODULE_DATA_" + JSON.stringify(data));
```
