const Discord = require("discord.js");
const fs = require("fs");
const fetch = require('node-fetch');

module.exports.run = async(client, interaction) => {
   console.log("trop bien !");
   await interaction.deferReply({ ephemeral: false }); //for long task. Ephemeral is for user only
   //await interaction.reply("EMT !");
   //await interaction.editReply({content: '** **', embeds: [embed]});

   const embed = new Discord.MessageEmbed()
   .setColor('#8700C1')
   .setTitle('EMT !')
   .setURL('https://discord.js.org/')
   .setAuthor('Emilia', 'https://i.pinimg.com/originals/36/a6/42/36a64244a6344c5ef39f259f6dbe6737.jpg', 'https://adandcoinc.xyz')
   .setDescription('Lorem ipsum doloris')
   .setImage('https://media.discordapp.net/attachments/723620072383447120/822068052308918292/Emi_Stats.gif')

   setTimeout( async() => {
       await interaction.editReply({embeds: [embed]});
   }, 3000);
}

module.exports.help =  {
    name:"test",
    aliases:[]
}