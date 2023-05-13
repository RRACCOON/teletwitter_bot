const {Telegraf, Markup} = require('telegraf');
const {message} = require('telegraf/filters');

require('dotenv').config();
const text_answer = require('./const');
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start(isItMe, (ctx) => ctx.reply(text_answer.lets_start));
bot.help(isItMe, (ctx) => ctx.reply(':)'));

bot.command('menu', isItMe, async (ctx) => {
    try {
        await ctx.replyWithHTML('<b>Grand Final Running Order:</b>', Markup.inlineKeyboard(
            [
                [
                    Markup.button.callback('1🇦🇹', 'btn_1')
                    , Markup.button.callback('2🇵🇹', 'btn_2')
                    , Markup.button.callback('3🇨🇭', 'btn_3')
                    , Markup.button.callback('4🇵🇱', 'btn_4')
                    , Markup.button.callback('5🇷🇸', 'btn_5')
                ],
                [
                    Markup.button.callback('6🇫🇷', 'btn_6')
                    , Markup.button.callback('7🇨🇾', 'btn_7')
                    , Markup.button.callback('8🇪🇸', 'btn_8')
                    , Markup.button.callback('9🇸🇪', 'btn_9')
                    , Markup.button.callback('10🇦🇱', 'btn_10')
                ],
                [
                    Markup.button.callback('11🇮🇹', 'btn_11')
                    , Markup.button.callback('12🇪🇪', 'btn_12')
                    , Markup.button.callback('13🇫🇮', 'btn_13')
                    , Markup.button.callback('14🇨🇿', 'btn_14')
                    , Markup.button.callback('15🇦🇺', 'btn_15')
                ],
                [
                    Markup.button.callback('16🇧🇪', 'btn_16')
                    , Markup.button.callback('17🇦🇲', 'btn_17')
                    , Markup.button.callback('18🇲🇩', 'btn_18')
                    , Markup.button.callback('19🇺🇦', 'btn_19')
                    , Markup.button.callback('20🇳🇴', 'btn_20')
                ],
                [
                    Markup.button.callback('21🇩🇪', 'btn_21')
                    , Markup.button.callback('22🇱🇹', 'btn_22')
                    , Markup.button.callback('23🇮🇱', 'btn_23')
                    , Markup.button.callback('24🇸🇮', 'btn_24')
                    , Markup.button.callback('25🇭🇷', 'btn_25')
                ],
                [
                    Markup.button.callback('26🇬🇧', 'btn_26')
                ]
            ]
        ))
    } catch (e) {
        console.error(e)
    }
})

let currentFlag = '';
let currentBtn = '';

function addCompetitorAction(btn_id, emoji_flag) {
    bot.action(btn_id, async (ctx) => {
        try {
            await ctx.answerCbQuery();
            ctx.reply('Напиши своё мнение об участнике ' + emoji_flag);
            currentFlag = emoji_flag;
            currentBtn = btn_id;
        } catch (e) {
            console.error(e);
        }
    });
}

bot.on('message', (ctx) => {
    try {
        console.log('currentBtnId=' + currentBtn);
        if (currentFlag != '') {
            console.log(currentBtn);
            const text = ctx.message.text;
            let text_twitter = text + '  #Eurovision2023';
            sendMessageToTelegramBlog(currentFlag + ' ' + text);
            currentFlag = currentBtn = '';
            console.log('Twitter' + text_twitter);
            ctx.reply('done');
        }
    } catch (e) {
        console.error(e);
    }
})

function sendMessageToTelegramBlog(text) {
    const options = {disable_notification: true};
    bot.telegram.sendMessage(process.env.FORWARD_TO_CHAT_ID, text, options);
}

addCompetitorAction('btn_1', '🇦🇹');
addCompetitorAction('btn_2', '🇵🇹');
addCompetitorAction('btn_3', '🇨🇭');
addCompetitorAction('btn_4', '🇵🇱');
addCompetitorAction('btn_5', '🇷🇸');
addCompetitorAction('btn_6', '🇫🇷');
addCompetitorAction('btn_7', '🇨🇾');
addCompetitorAction('btn_8', '🇪🇸');
addCompetitorAction('btn_9', '🇸🇪');
addCompetitorAction('btn_10', '🇦🇱');
addCompetitorAction('btn_11', '🇮🇹');
addCompetitorAction('btn_12', '🇪🇪');
addCompetitorAction('btn_13', '🇫🇮');
addCompetitorAction('btn_14', '🇨🇿');
addCompetitorAction('btn_15', '🇦🇺');
addCompetitorAction('btn_16', '🇧🇪');
addCompetitorAction('btn_17', '🇦🇲');
addCompetitorAction('btn_18', '🇲🇩');
addCompetitorAction('btn_19', '🇺🇦');
addCompetitorAction('btn_20', '🇳🇴');
addCompetitorAction('btn_21', '🇩🇪');
addCompetitorAction('btn_22', '🇱🇹');
addCompetitorAction('btn_23', '🇮🇱');
addCompetitorAction('btn_24', '🇸🇮');
addCompetitorAction('btn_25', '🇭🇷');
addCompetitorAction('btn_26', '🇬🇧');
// starting
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));


function isItMe(ctx, next) {
    if (ctx.message.from.id != process.env.MY_ID) {
        ctx.reply_to_message(text_answer.access_denied);
    } else {
        next();
    }
}
