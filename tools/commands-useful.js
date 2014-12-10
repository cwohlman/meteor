var main = require('./main.js');
var path = require('path');
var _ = require('underscore');
var fs = require('fs');
var files = require('./files.js');
var deploy = require('./deploy.js');
var buildmessage = require('./buildmessage.js');
var project = require('./project.js').project;
var warehouse = require('./warehouse.js');
var auth = require('./auth.js');
var authClient = require('./auth-client.js');
var config = require('./config.js');
var release = require('./release.js');
var Future = require('fibers/future');
var runLog = require('./run-log.js');
var packageClient = require('./package-client.js');
var utils = require('./utils.js');
var httpHelpers = require('./http-helpers.js');
var archinfo = require('./archinfo.js');
var tropohouse = require('./tropohouse.js');
var compiler = require('./compiler.js');
var catalog = require('./catalog.js');
var stats = require('./stats.js');
var isopack = require('./isopack.js');
var cordova = require('./commands-cordova.js');
var commandsPackages = require('./commands-packages.js');
var execFileSync = require('./utils.js').execFileSync;
var Console = require('./console.js').Console;

// var serverArch = options.serverArch || archinfo.host();

// {
//   packageName: name,
//   version: version,
//   architectures: [serverArch]
// }

main.registerCommand({
  name: 'clone',
  maxArgs: 1,
  minArgs: 1,
  requiresApp: false,
  requiresRelease: false,
  catalogRefresh: new catalog.Refresh.OnceAtStart({ ignoreErrors: true }),
  options: {
    template: { type: String, short: "t", default: "useful:-website" }
  }
}, function (options) {
  var appPath = options.args[0];
  var templatesDirectory = path.join(__dirname, 'project-templates');

  var serverArch = archinfo.host();

  var template = options.template.split('@')
    , name = template[0]
    , version = template[1];

  var versionInfo;
  var messages = buildmessage.capture(options, function () {
    versionInfo = catalog.complete.getLatestVersion(name);
  });

  var buildsToDownload = catalog.official.getBuildsForArches(
      name, version || versionInfo.version, [serverArch]);

  console.log(buildsToDownload);

  var downloadDirectory = tropohouse.default.downloadBuildToTempDir({
    packageName: name
    , version: version || versionInfo.version
  }, buildsToDownload[0]);

  // WIP - ok this copies the entire package, but really 
  // we're going to do something much smarter during
  // project initialization from a template bundle
  files.cp_r(downloadDirectory, appPath);
  return;

});