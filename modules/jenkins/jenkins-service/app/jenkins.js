module.exports = function(jenkins_info) {
    var jenkins = require('jenkins')(jenkins_info.jenkins_url);

    //Trigger new build
    function triggerBuild() {
        jenkins.job.build({
            'name': jenkins_info.job_name,
            'token': jenkins_info.job_token
        }, function(err) {
            if (err) {
                return err;
            }
            console.log('build started');
            //buildStatus();
        });
    }

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
};
