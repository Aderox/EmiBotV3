const Discord = require("discord.js");
const fs = require("fs");
const fetch = require('node-fetch');

module.exports.run = async(client, interaction) => {
   console.log("trop bien !");
   //await interaction.deferReply({ ephemeral: true }); //for long task
   await interaction.reply("EMT !");

   const embed = new Discord.MessageEmbed()
   .setColor('#0099ff')
   .setTitle('Some title')
   .setURL('https://discord.js.org/')
   .setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
   .setDescription('Some description here')

   setTimeout( () => {
       interaction.editReply({embeds: [embed]});
   }, 200);
}

module.exports.help =  {
    name:"test",
    aliases:[]
}