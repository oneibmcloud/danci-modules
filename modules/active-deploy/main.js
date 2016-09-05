//var async = require('async');
var exec = require('child_process').exec;
var fs = require('fs');
var YAML = require('yamljs');

var manifest,
    deploy_config;

if (process.env.MANIFEST_PATH) {
    manifest = process.env.MANIFEST_PATH;
} else {
    manifest = proccess.env.FILE_PATH + '/manifest.yml';
}

deploy_config = YAML.load(manifest);

console.log('cf api ' + process.env.DEPLOY_API);
exec('/script/cf api ' + process.env.DEPLOY_API, function(err, stdout, stderr) {
    if (err) {
        console.log('DANCI_ERROR_Error running cf api ' + process.env.DEPLOY_API + ': ' + err);
        console.log('DANCI_STEP_SUMMARY_Error running cf api ' + process.env.DEPLOY_API + ': ' + err);
        return console.log('DANCI_STEP_STATUS_FAILURE');
    }
    console.log(stdout);
    cf_login();
});

function cf_login() {
    console.log('cf login -u ' + process.env.DEPLOY_USERNAME + ' -p [PRIVATE] -o ' + process.env.DEPLOY_ORGANIZATION + ' -s ' + process.env.DEPLOY_SPACE);
    exec('/script/cf login -u ' + process.env.DEPLOY_USERNAME + ' -p ' + process.env.DEPLOY_PASSWORD + ' -o ' + process.env.DEPLOY_ORGANIZATION + ' -s ' + process.env.DEPLOY_SPACE, function(err, stdout, stderr) {
        if (err) {
            console.log('DANCI_ERROR_Error running cf login -u ' + process.env.DEPLOY_USERNAME + ' -p [PRIVATE] -o ' + process.env.DEPLOY_ORGANIZATION + ' -s ' + process.env.DEPLOY_SPACE + ': ' + err);
            console.log('DANCI_STEP_SUMMARY_Error running cf login -u ' + process.env.DEPLOY_USERNAME + ' -p [PRIVATE] -o ' + process.env.DEPLOY_ORGANIZATION + ' -s ' + process.env.DEPLOY_SPACE + ': ' + err);
            return console.log('DANCI_STEP_STATUS_FAILURE');
        }
        console.log(stdout);
        parseManifest();
    });
}

function parseManifest() {
    for (var i = 0; i < deploy_config.applications.lenth; i++) {
        var app_name = deploy_config.applications[i].name;
        if (deploy_config.applications[i].env) {
            var env_variables = deploy_config.applications[i].env;
            for (var key in env_variables) {
                if (env_variables[key].substring(0, 1) == '{' && env_variables[key].substring(env_variables[key].length - 1, env_variables[key].length) == '}') {
                    env_variables[key] = process.env[key];
                }
            }
        }
    }
    writeManifet();

    /*
    //Async Version (un-comment top line too)
    async.eachSeries(deploy_config.applications, function(application, next) {
        var app_name = application.name;

        if (application.env) {
            async.forEachOf(application.env, function(value, key, next) {
                if (value.substring(0, 1) == '{' && value.substring(value.length - 1, value.length) == '}') {
                    value = process.env[key];
                    next();
                } else {
                    next();
                }
            }, function(err) {
                writeManifet();
                next();
            });
        } else {
            writeManifet();
            next();
        }
    });
    */
}

function writeManifet() {
    fs.writeFile(maifest, deploy_config, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log('Wrote new manifest.yml file');
        cf_push();
    });
}

function cf_push() {
    console.log('cf push ' + process.env.APP_NAME + '-new --no-route');
    exec('/script/cf push ' + process.env.APP_NAME + '-new --no-route', function(err, stdout, stderr) {
        if (err) {
            console.log('DANCI_ERROR_Error running cf push ' + process.env.APP_NAME + '-new --no-route: ' + err);
            console.log('DANCI_STEP_SUMMARY_Error running cf push ' + process.env.APP_NAME + '-new --no-route: ' + err);
            return console.log('DANCI_STEP_STATUS_FAILURE');
        }
        console.log(stdout);
        cf_active_deploy_create();
    });
}

function cf_active_deploy_create() {
    console.log('cf active-deploy-create ' + process.env.APP_NAME + ' ' + process.env.APP_NAME + '-new --label new_' + process.env.APP_NAME);
    exec('/script/cf active-deploy-create ' + process.env.APP_NAME + ' ' + process.env.APP_NAME + '-new --label new_' + process.env.APP_NAME, function(err, stdout, stderr) {
        if (err) {
            console.log('DANCI_ERROR_Error running cf active-deploy-create ' + process.env.APP_NAME + ' ' + process.env.APP_NAME + '-new --label new_' + process.env.APP_NAME + ': ' + err);
            console.log('DANCI_STEP_SUMMARY_Error running cf active-deploy-create ' + process.env.APP_NAME + ' ' + process.env.APP_NAME + '-new --label new_' + process.env.APP_NAME + ': ' + err);
            return console.log('DANCI_STEP_STATUS_FAILURE');
        }
        console.log(stdout);
        cf_active_deploy_advance();
    });
}

function cf_active_deploy_advance() {
    console.log('cf active-deploy-advance new_' + process.env.APP_NAME + ' --force');
    exec('/script/cf active-deploy-advance new_' + process.env.APP_NAME + ' --force', function(err, stdout, stderr) {
        if (err) {
            console.log('DANCI_ERROR_Error running cf active-deploy-advance new_' + process.env.APP_NAME + ' --force: ' + err);
            console.log('DANCI_STEP_SUMMARY_Error running cf active-deploy-advance new_' + process.env.APP_NAME + ' --force: ' + err);
            return console.log('DANCI_STEP_STATUS_FAILURE');
        }
        console.log(stdout);
        cf_delete();
    });
}

function cf_delete() {
    console.log('cf delete ' + process.env.APP_NAME + ' -f');
    exec('/script/cf delete ' + process.env.APP_NAME + ' -f', function(err, stdout, stderr) {
        if (err) {
            console.log('DANCI_ERROR_Error running cf delete ' + process.env.APP_NAME + ' -f: ' + err);
            console.log('DANCI_STEP_SUMMARY_Error running cf delete ' + process.env.APP_NAME + ' -f: ' + err);
            return console.log('DANCI_STEP_STATUS_FAILURE');
        }
        console.log(stdout);
        cf_rename();
    });
}

function cf_rename() {
    console.log('cf rename ' + process.env.APP_NAME + '-new ' + process.env.APP_NAME);
    exec('/script/cf rename ' + process.env.APP_NAME + '-new ' + process.env.APP_NAME, function(err, stdout, stderr) {
        if (err) {
            console.log('DANCI_ERROR_Error running cf rename ' + process.env.APP_NAME + '-new ' + process.env.APP_NAME + ': ' + err);
            console.log('DANCI_STEP_SUMMARY_Error running cf rename ' + process.env.APP_NAME + '-new ' + process.env.APP_NAME + ': ' + err);
            return console.log('DANCI_STEP_STATUS_FAILURE');
        }
        console.log(stdout);
    });
}
