## Docker Images

[DanCI Image Repository](https://hub.docker.com/r/danci/)

#### Languages
- [x] [Node.js](languages/node)
- [ ] Java
- [ ] PHP
- [ ] Ruby

#### Modules
- [x] [Git Clone](modules/git-clone) (For Internal Use)
- [ ] [Git Revert](modules/git-revert)  (For Internal Use)
- [x] [Deploy: Cloud Foundry](modules/deploy-cf)
- [x] [Node License Scanner](modules/node-licenses)
- [x] [Jenkins Integration](modules/jenkins)
- [x] [Meteor build](modules/meteor-build)
- [ ] [JSHint](modules/node-jshint)
- [ ] [Notify: Slack](modules/slack-bot)
- [ ] [Notify: Email](modules/sendgrid)

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

More information on how to format `data` and `options` can be found at [chartjs.org](http://chartjs.org/docs)

Example:
```
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

console.log("DANCI_MODULE_DATA_" + JSON.stringify(data));
```
