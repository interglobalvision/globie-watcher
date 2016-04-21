// Load dotenv and env variables
var dotenv = require('dotenv').config();
var chokidar = require('chokidar');

var Botkit = require('botkit');
// init Slack Botkit Bot
var controller = Botkit.slackbot({
  debug: true,
});

// Read environment vars
var syncDirectory = process.env.SYNC_DIR;
var slackApi = process.env.SLACK_API;



// >>> WORK OUT HOW THE FUCK BOTKIT ACTUALLY WORKS> PERHAPS USE BASIC HTTP POSTS NOT RTM STUFF I DUNNO>



// connect to Slack
controller.spawn({
  token: slackApi,
});

bot.startRTM(function(err, bot, payload) {

  console.log(payload);

});

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
  .on('ready', function() {console.info('Initial scan complete. Ready for changes.')});


// Removes the sycnDirectory from the path to make it shorter
var clearPath = function (path) {
  path = path.replace(syncDirectory + "/", "");
  return path;
}

// Sends message in correct Slack channel
var sendMessage = function(msg, path) {

  // check if path is active projects
  if (path.indexOf('Projects/Active Work/') > -1) {

    // get name of sub folder of Active Work
    var projectName = path.replace('Projects/Active Work/', '');
    projectName = projectName.substring(0, projectName.indexOf('/'));

    console.log('Project name:', projectName);

    // try to connect to Slack channel
    channel = globieBot.getChannelByName(projectName);

    if (channel) {

      console.log('Should be sending this message in channel:', msg);
      console.log('Channel name from object', channel.name);



    } else {



    }

  // if other dirs
  } else {

    bot.say({
      text: msg,
      channel: '#general'
    });


  }

}