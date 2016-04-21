// Load dotenv and env variables
var dotenv = require('dotenv').config();
var chokidar = require('chokidar');
var Botkit = require('botkit');

// Read environment vars
var syncDirectory = process.env.SYNC_DIR;
var slackApi = process.env.SLACK_API;
var webhook_url = process.env.WEBHOOK_URL;

// Create bot controller
var controller = Botkit.slackbot({
  debug: true
  //include "log: false" to disable logging
  //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});


// connect the bot to a stream of messages
var bot = controller.spawn({
  token: slackApi
});

// Configure webhooks
bot.configureIncomingWebhook({url: webhook_url});

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
    sendMessage('File ' + path + ' has been added', path);
  })
  .on('addDir', function(path) {
    path = clearPath(path);
    console.log('Directory', path, 'has been added');
    sendMessage('Directory ' + path + ' has been added', path);
  })
  .on('change', function(path) {
    path = clearPath(path);
    console.log('File', path, 'has been changed');
    sendMessage('File ' + path + ' has been changed', path);
  })
  .on('unlink', function(path) {
    path = clearPath(path);
    console.log('File', path, 'has been removed');
    sendMessage('File ' + path + ' has been removed', path);
  })
  .on('unlinkDir', function(path) {
    path = clearPath(path);
    console.log('Directory', path, 'has been removed');
    sendMessage('Directory ' + path + ' has been removed', path);
  })
  .on('error', function(error) {console.error('Error happened', error);})
  .on('ready', function() {console.info('Initial scan complete. Ready for changes.')})

// clearPath()
// Removes the sycnDirectory from the path to make it shorter
var clearPath = function (path) {
  path = path.replace(syncDirectory + "/", "");
  return path;
}

var sendMessage = function(msg, path) {
  var channel = '#general';

  // check if path is active projects
  if (path.indexOf('Projects/Active Work/') > -1) {

    // get name of sub folder of Active Work
    var projectName = path.replace('Projects/Active Work/', '');
    projectName = projectName.substring(0, projectName.indexOf('/'));

    console.log('Project name:', projectName);

    channel = '#' + projectName;
  }

  bot.sendWebhook({
    text: msg,
    channel: channel,
  },function(err,res) {
    if(err) {
      return console.log(err);
    }
    console.log(res);
  });
};
