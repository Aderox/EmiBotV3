const Discord = require("discord.js");
const fs = require("fs");
const fetch = require('node-fetch');
const bot = new Discord.Client();

bot.commands = new Discord.Collection();    

function print(msg){
    let date = new Date();
    console.log(`[EmiBot Logs ${date.toLocaleDateString('fr-FR')} ${date.toLocaleTimeString('fr-FR')}]: ${msg}`);
  }

  bot.on("ready", async () =>  {
    sendLog("Bot ready !");
})
print("hello world");

bot.login(botInfo.token);