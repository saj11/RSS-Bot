require('dotenv').config()

const {RTMClient, WebClient} = require('@slack/client')

// set your token to the bot token provided by slack
const token = process.env.XOXB

if (!token) { 
   console.log('You must specify a token to use this example')
   return 
}

// Initialize a Web API client
const web = new WebClient(token)
const rtm = new RTMClient(token)

// Personalize the Bot
const robotName   = 'RSS Bot';

let users = []

const updateUsers = data => {
    users = data.members
}

const getUsernameFromId = id => {
    const user = users.find(user => user.id === id)
    return user ? user.name : 'Unknown member'
}

rtm.on('message', message => {
    if(message.text){
        console.log(message)
        console.log(message.text)
        const userName = getUsernameFromId(message.user) 
        if(userName != robotName){
            rtm.sendMessage(`${userName} said: ${message.text}`, message.channel);
        }
    }
})

web.users.list((err, data) => {
    if (err) {
        console.error('web.users.list Error:', err);
    } else {
        updateUsers(data);
    }
});

(async () => {
    const { self, team } = await rtm.start();
  })();