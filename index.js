// Load dotenv and env variables
var dotenv = require('dotenv').config();
var chokidar = require('chokidar');
var SlackClient = require('slack-client');

// Read environment vars
var syncDirectory = process.env.SYNC_DIR;
var slackApi = process.env.SLACK_API;

// Set globieBot
globieBot = new SlackClient(slackApi, true, false);
globieBot.login();

// Set watcher
var watcher = chokidar.watch(syncDirectory, {
  ignored: /\.!sync|\.sync|\.bts|\.DS_Store/,
  persistent: true,
  ignoreInitial: true
});

watcher
  .on('add', function(path) {
    path = clearPath(path);
    console.log('File', path, 'has been added');
    sendMessage('File ' + path + ' has been added');
  })
  .on('addDir', function(path) {
    path = clearPath(path);
    console.log('Directory', path, 'has been added');
    sendMessage('Directory ' + path + ' has been added');
  })
  .on('change', function(path) {
    path = clearPath(path);
    console.log('File', path, 'has been changed');
    sendMessage('File ' + path + ' has been changed');
  })
  .on('unlink', function(path) {
    path = clearPath(path);
    console.log('File', path, 'has been removed');
    sendMessage('File ' + path + ' has been removed');
  })
  .on('unlinkDir', function(path) {
    path = clearPath(path);
    console.log('Directory', path, 'has been removed');
    sendMessage('Directory ' + path + ' has been removed');
  })
  .on('error', function(error) {console.error('Error happened', error);})
  .on('ready', function() {console.info('Initial scan complete. Ready for changes.')})

// clearPath()
// Removes the sycnDirectory from the path to make it shorter
var clearPath = function (path) {
  path = path.replace(syncDirectory + "/", "");
  return path;
}

var sendMessage = function(msg) {
  channel = globieBot.getChannelByName('general');
  channel.send(msg);
}
