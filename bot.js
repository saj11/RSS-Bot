require('dotenv').config()

const bodyParser = require('body-parser')
const botkit = require('botkit')
const express = require('express')
const http = require('http')

const obtainFeed = require('./feed')

const app = express()
const server = http.createServer(app)
const router = express.Router()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))

//Configuration
var slackController = botkit.slackbot({
    json_file_store: __dirname + '/.data/db/',
    debug: true,
    clientSigningSecret: process.env.CLIENT_SIGNING_SECRET,
  })

//Connect Node app to Slack app
slackController.configureSlackApp({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    clientSigningSecret: process.env.CLIENT_SIGNING_SECRET,
    scopes: ['commands', 'bot'],
})

//Bot configuration
var bot = slackController.spawn({
    token: process.env.BOT_TOKEN,
    incoming_webhook: {
      url: 'https://hooks.slack.com/services/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IS'
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

/*
rtm.on('message', async message => {
    if(message.text){
        try{
            switch(message.subtype){
                case 'channel_join':
                        await rtm.sendMessage(`${message.user} said: ${message.text}`, message.channel)
            }
        }
        console.log('###### - message')
        console.log(message)
        console.log(message.text)
        const userName = getUsernameFromId(message.user) 
        if(userName != robotName){
            await rtm.sendMessage(`${userName} said: ${message.text}`, message.channel)
            //await console.log(obtainFeed('https://medium.com/feed/tag/js'))
        }
    }
})
*/