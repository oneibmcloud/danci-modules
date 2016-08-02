var jenkins = require('jenkins')(process.env.JENKINS_URL);

//Trigger new build
jenkins.job.build('example', function(err) {
    if (err)
        return err;
    }
);

//Get build status
function buildStatus(buildName, buildId) {
    jenkins.build.get(buildName, buildId, function(err, data) {
        if (err)
            return err;
        if (data.inQueue === false) {
            buildLog(buildName, buildId);
        } else {
            buildStatus(buildName, buildId);
        }
    });
}

//Get build log
function buildLog(buildName, buildId) {
    jenkins.build.get(buildName, buildId, function(err, data) {
        if (err)
            return err;
        console.log(data);
    });
}
