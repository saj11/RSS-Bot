require('dotenv').config()

const {RTMClient, WebClient} = require('@slack/client')

const obtainFeed = require('./feed')

// set your token to the bot token provided by slack
const token = process.env.XOXB

// Initialize a Web API client
const web = new WebClient(token)
const rtm = new RTMClient(token)

const robotName = 'RSS Bot'

let users = []

const updateUsers = data => {
    users = data.members
}

const getUsernameFromId = id => {
    const user = users.find(user => user.id === id)
    return user ? user.name : 'Unknown member'
}

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

rtm.on('channel_joined', async message => {
    if(message.text){
        console.log('###### - channel_joined')
        console.log(message)
    }
})

rtm.on('member_joined_channel', async message => {
    if(message.text){
        console.log('###### - member_joined_channel')
        console.log(message)
    }
})

//rtm.on('', async message => {})
rtm.on('im_created', async message => {
    if(message.text){
        console.log('###### - im_created')
        console.log(message)
    }
})

rtm.on('subteam_self_added', async message => {
    if(message.text){
        console.log('###### - subteam_self_added')
        console.log(message)
    }
})

web.users.list((err, data) => {
    if (err) {
        console.error('web.users.list Error:', err)
    } else {
        console.log("aqui")
        updateUsers(data)
    }
});

(async () => {
    const { self, team } = await rtm.start()
  })();