const {Telegraf, Markup, Extra} = require('telegraf');
const {message} = require('telegraf/filters');
require('dotenv').config();
const twitter = require('./twitterСonnection');
const textConsts = require('./utils/const');
const countries = require('./utils/countries');
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(isItMe, (ctx) => ctx.reply(textConsts.lets_start));
bot.help(isItMe, (ctx) => ctx.reply('Nothing can help you :)'));


//Creating a menu with list of competitors
bot.command('menu', isItMe, async (ctx) => {
    await initMenu(ctx);
})
initMenuActions();

let currentFlag = '';
//Waiting all messages, and if you are choose a flag before, it will be sent to blogs
bot.on('message',isItMe, (ctx) => {
    try {
        if (currentFlag != '') {
            const text = ctx.message.text;

            sendMessageToTwitterBlog(text);
            sendMessageToTelegramBlog(text);
            currentFlag = '';
            ctx.reply('Sended');
        }
    } catch (e) {
        console.error(e);
    }
})


// starting
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

async function initMenu(ctx) {
    try {
        await ctx.replyWithHTML('<b>Grand Final Running Order:</b>', Markup.inlineKeyboard(
            [
                [
                    Markup.button.callback('1' + countries.Austria.flag, countries.Austria.btn_id),
                    Markup.button.callback('2' + countries.Portugal.flag, countries.Portugal.btn_id),
                    Markup.button.callback('3' + countries.Switzerland.flag, countries.Switzerland.btn_id),
                    Markup.button.callback('4' + countries.Poland.flag, countries.Poland.btn_id),
                    Markup.button.callback('5' + countries.Serbia.flag, countries.Serbia.btn_id),
                ],
                [
                    Markup.button.callback('6' + countries.France.flag, countries.France.btn_id),
                    Markup.button.callback('7' + countries.Cyprus.flag, countries.Cyprus.btn_id),
                    Markup.button.callback('8' + countries.Spain.flag, countries.Spain.btn_id),
                    Markup.button.callback('9' + countries.Sweden.flag, countries.Sweden.btn_id),
                    Markup.button.callback('10' + countries.Albania.flag, countries.Albania.btn_id),
                ],
                [
                    Markup.button.callback('11' + countries.Italy.flag, countries.Italy.btn_id),
                    Markup.button.callback('12' + countries.Estonia.flag, countries.Estonia.btn_id),
                    Markup.button.callback('13' + countries.Finland.flag, countries.Finland.btn_id),
                    Markup.button.callback('14' + countries.Czechia.flag, countries.Czechia.btn_id),
                    Markup.button.callback('15' + countries.Austria.flag, countries.Australia.btn_id),
                ],
                [
                    Markup.button.callback('16' + countries.Belgium.flag, countries.Belgium.btn_id),
                    Markup.button.callback('17' + countries.Armenia.flag, countries.Armenia.btn_id),
                    Markup.button.callback('18' + countries.Moldova.flag, countries.Moldova.btn_id),
                    Markup.button.callback('19' + countries.Ukraine.flag, countries.Ukraine.btn_id),
                    Markup.button.callback('20' + countries.Norway.flag, countries.Norway.btn_id),
                ],
                [
                    Markup.button.callback('21' + countries.Germany.flag, countries.Germany.btn_id),
                    Markup.button.callback('22' + countries.Lithuania.flag, countries.Lithuania.btn_id),
                    Markup.button.callback('23' + countries.Israel.flag, countries.Israel.btn_id),
                    Markup.button.callback('24' + countries.Slovenia.flag, countries.Slovenia.btn_id),
                    Markup.button.callback('25' + countries.Croatia.flag, countries.Croatia.btn_id),
                ],
                [
                    Markup.button.callback('26' + countries.UnitedKingdom.flag, countries.UnitedKingdom.btn_id),
                    Markup.button.callback('🖊️', 'btn_27'),

                ]
            ]
        ))
    } catch (e) {
        console.error(e)
    }
}

function addCompetitorAction(btn_id, emoji_flag) {
    bot.action(btn_id, async (ctx) => {
        try {
            await ctx.answerCbQuery();
            ctx.reply('Напиши своё мнение об участнике ' + emoji_flag);
            currentFlag = emoji_flag;
        } catch (e) {
            console.error(e);
        }
    });
}

function initMenuActions() {
    addCompetitorAction( countries.Austria.btn_id, countries.Austria.flag);
    addCompetitorAction( countries.Portugal.btn_id, countries.Portugal.flag);
    addCompetitorAction( countries.Switzerland.btn_id, countries.Switzerland.flag);
    addCompetitorAction( countries.Poland.btn_id, countries.Poland.flag);
    addCompetitorAction( countries.Serbia.btn_id, countries.Serbia.flag);
    addCompetitorAction( countries.France.btn_id, countries.France.flag);
    addCompetitorAction( countries.Cyprus.btn_id, countries.Cyprus.flag);
    addCompetitorAction( countries.Spain.btn_id, countries.Spain.flag);
    addCompetitorAction( countries.Sweden.btn_id, countries.Sweden.flag);
    addCompetitorAction( countries.Albania.btn_id, countries.Albania.flag);
    addCompetitorAction( countries.Italy.btn_id, countries.Italy.flag);
    addCompetitorAction( countries.Estonia.btn_id, countries.Estonia.flag);
    addCompetitorAction( countries.Finland.btn_id, countries.Finland.flag);
    addCompetitorAction( countries.Czechia.btn_id, countries.Czechia.flag);
    addCompetitorAction( countries.Australia.btn_id, countries.Austria.flag);
    addCompetitorAction( countries.Belgium.btn_id, countries.Belgium.flag);
    addCompetitorAction( countries.Armenia.btn_id, countries.Armenia.flag);
    addCompetitorAction( countries.Moldova.btn_id, countries.Moldova.flag);
    addCompetitorAction( countries.Ukraine.btn_id, countries.Ukraine.flag);
    addCompetitorAction( countries.Norway.btn_id, countries.Norway.flag);
    addCompetitorAction( countries.Germany.btn_id, countries.Germany.flag);
    addCompetitorAction( countries.Lithuania.btn_id, countries.Lithuania.flag);
    addCompetitorAction( countries.Israel.btn_id, countries.Israel.flag);
    addCompetitorAction( countries.Slovenia.btn_id, countries.Slovenia.flag);
    addCompetitorAction( countries.Croatia.btn_id, countries.Croatia.flag);
    addCompetitorAction( countries.UnitedKingdom.btn_id, countries.UnitedKingdom.flag);
    addCompetitorAction('btn_27', '🖊️');
}

//Middleware for check that only you can use this bot
function isItMe(ctx, next) {
    if (ctx.message.from.id != process.env.MY_ID) {
        ctx.reply_to_message(textConsts.access_denied);
    } else {
        next();
    }
}

function sendMessageToTwitterBlog(text) {
    let text_twitter = currentFlag + ' ' + text + textConsts.hashtag2023;
    twitter.sendMessage(text_twitter).then(() => console.log('twitter done'));
}

function sendMessageToTelegramBlog(text) {
    const options = {disable_notification: true};
    try {
        bot.telegram.sendMessage(process.env.FORWARD_TO_CHAT_ID, currentFlag + ' ' + text, options);
    } catch (e) {
        console.log('Problem with message for telegram: \n' + e);
    }

    console.log("Telegram done");
}
