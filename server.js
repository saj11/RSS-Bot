require('dotenv').config()

const {RTMClient, WebClient} = require('@slack/client')

// set your token to the bot token provided by slack
const token = process.env.XOXB;
let conversationId

if (!token) { 
   console.log('You must specify a token to use this example');
   return; 
}

// Initialize a Web API client
const web = new WebClient(token);

web.channels.list().then(res => {
    conversationId = res.channels[0].id

    web.chat.postMessage({ channel: conversationId, text: 'Hello World!' }).then((res) => {
        console.log('Message sent: ', res.ts);
    }).catch(console.error);
    
}).catch((error) => {
    console.log('Team info error:');
    console.log(error);
});