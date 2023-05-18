require('dotenv').config();
const {TwitterApi} = require('twitter-api-v2');
const client = new TwitterApi({
    appKey: process.env.APP_KEY,
    appSecret: process.env.APP_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_SECRET
});

const twitter = client.readWrite;
let lastTwitId = process.env.LAST_TWEET_ID;

async function sendMessage(text) {
    console.log(text, lastTwitId);
    try {
        await twitter.v2.reply(text, lastTwitId).then((twit) => {
            lastTwitId = twit.data.id;
        });
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    sendMessage
};