const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');

require('dotenv').config();
const text_answer = require ('./const');
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start(isItMe,(ctx) => ctx.reply(text_answer.lets_start));
bot.help(isItMe,(ctx) => ctx.reply(':)'));

// starting
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));


function isItMe (ctx, next) {
    if (ctx.message.from.id != process.env.MY_ID) {
        ctx.reply_to_message(text_answer.access_denied);
    } else {
        next();
    }
}
