const TelegramApi = require('node-telegram-bot-api')


require('dotenv').config()
const api = process.env.API
const bot = new TelegramApi(api, {polling:true})

const chats = {}
const gameOptions = {
   reply_markup: JSON.stringify({
      inline_keyboard: [
         [{text: '1', callback_data: '1'},{text: '2', callback_data: '2'},{text: '3', callback_data: '3'},],
         [{text: '4', callback_data: '4'},{text: '5', callback_data: '5'},{text: '6', callback_data: '6'},],
         [{text: '7', callback_data: '7'},{text: '8', callback_data: '8'},{text: '9', callback_data: '9'},],
         [{text: '0', callback_data: '0'}]
      ]
   })
}

const againOptions = {
   reply_markup: JSON.stringify({
      inline_keyboard: [
         [{text: 'Qaytadan boshlash', callback_data: '/again'}]        
      ]
   })
}
bot.setMyCommands([
   {command: '/start', description: `boshlang'ich uchrashuv`},
   {command: '/info', description: `siz haqingizda ma'lumot`},
   {command: '/game', description: `Uyin boshlandi ...`} 
])

const startGame = async (chatId) => {
   await bot.sendMessage(chatId, '0 dan 9 gacha son tanladim')

   const randomNumber = Math.floor(Math.random()*10)
   
   chats[chatId] = randomNumber
   return bot.sendMessage(chatId, 'Sonni top', gameOptions)

}

const start = () => {
   bot.on('message', async msg => {
    const text = msg.text
    const chatId = msg.chat.id

    if(text === '/start') {
      await bot.sendSticker(chatId, 'https://c.tenor.com/ztDMimXwhsAAAAAi/hello.gif')
       return bot.sendMessage(chatId, 'Xush kelibsiz bizni botimizga')
       
    }

    if(text === '/info') {
       return bot.sendMessage(chatId, `Sizni ismingiz ${msg.from.first_name}`)
    }

    if(text === '/game') {
     return startGame(chatId)
    }

    return bot.sendMessage(chatId, 'Man bu narsani bilmayman...')
})

bot.on('callback_query', msg => {
   
   const data = msg.data
   const chatId = msg.message.chat.id
   console.log(data, chats[chatId]);
   if(data === '/again') {
     return startGame(chatId)
   }
   if(data === chats[chatId]) {
      return bot.sendMessage(chatId,`Tabriklayman, siz to'g'ri javob topdingiz ${chats[chatId]}`)    
   }else{
      return bot.sendMessage(chatId, `Afsuski, siz no'togri javob berdingiz, ${chats[chatId]}`, againOptions)
   }

})
   
}

start()


