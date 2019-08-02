"use strict"
require('dotenv').config()

const botkit = require('botkit')

const obtainFeed = require('./feed')

//Configuration
var slackController = botkit.slackbot({
    json_file_store: __dirname + '/.data/db/',
    debug: true,
    clientSigningSecret: process.env.SLACK_CLIENT_SIGNING_SECRET,
  })

//Connect Node app to Slack app
slackController.configureSlackApp({
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    clientSigningSecret: process.env.SLACK_CLIENT_SIGNING_SECRET,
    scopes: ['commands', 'bot'],
})

//Bot configuration
var bot = slackController.spawn({
    token: process.env.SLACK_BOT_TOKEN,
    incoming_webhook: {
      url: 'https://hooks.slack.com/services/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'
    }
  }).startRTM()

slackController.setupWebserver(process.env.PORT, function(err, webserver){
    slackController.createWebhookEndpoints(slackController.webserver)
    slackController.createOauthEndpoints(slackController.webserver, 
        function(err, req, res) {
            if(err){
                res.status(500).send(`ERROR: ${err}`);
            }else{
                res.send('Success!');
            }
        }
    )
})

slackController.hears('hi', 'direct_message', function(bot, message) {
  bot.reply(message,'Hello.')
})

slackController.on('direct_message', function(bot, message) {
  bot.reply(message,'I heard a message')
})

slackController.hears('webhook', 'direct_message', function(bot, message) {
    bot.sendWebhook({
      text: "Hey we've got the webhook!"
    },function(err,res) {
      if (err) {
        console.log('web err', err)
      }
    })
})

slackController.on('slash_command', function(bot, message){
    bot.replyAcknowledge() //Requires a response within 3000 ms
    switch (message.command) {
        case "/echo":
          bot.reply(message, 'heard ya!')
          break;
        default:
          bot.reply(message, 'Did not recognize that command, sorry!')
      }
})