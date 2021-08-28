const Discord = require("discord.js");
const fs = require("fs");
const fetch = require('node-fetch');
const botInfo = require("./botInfo.json");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

const client = new Discord.Client({intents: ["GUILDS", "DIRECT_MESSAGES"]});
const guildId = '663799678596546570';

client.commands = new Discord.Collection();

function print(msg){
    let date = new Date();
    console.log(`[EmiBot Logs ${date.toLocaleDateString('fr-FR')} ${date.toLocaleTimeString('fr-FR')}]: ${msg}`);
}


async function readJSfiles(){
    let i=0;
    fs.readdir("./cmds/", (err, files) => {
        if(err) console.error(err);
            for(const file of files){
                let cmd = file.split(".")[0];
                let props = require(`./cmds/${cmd}.js`)
                console.log(`${i + 1} : ${props.help.name}`)
                i+=1;
                client.commands.set(props.help.name, {
                    run: props.run,
                    ...props.help});  
        };
    });
}

async function readSlashCommands(){
    const files = fs.readdirSync("./slashcmds");
    for(const file of files){
        let JSONCMD = fs.readFileSync("./slashcmds/" + file);
        JSONCMD = await JSON.parse(JSONCMD);
        client.application.commands.create(JSONCMD.data, guildId); // TODO REMOVE guildID
    }    
}


//TODO refaire ces 2 fonctions avec l'api v13
async function deleteAllGuildCommands(){
    client.guilds.cache.forEach(async (guild) => {
      let COMMANDS = await client.api.applications(client.user.id).guilds(guild.id).commands.get();
          for(i = 0; i<COMMANDS.length;i++){
          console.log("commande à supprimer: " + COMMANDS[i].name)
          await client.api.applications(client.user.id).guilds(guild.id).commands(COMMANDS[i].id).delete();
          }
    });
}

async function deleteAllGlobalCommands(){
    let GCOMMANDS = await client.api.applications(client.user.id).commands.get()
    for(i = 0; i<GCOMMANDS.length;i++){
      await client.api.applications(client.user.id).commands(GCOMMANDS[i].id).delete();
    }
}


client.on("ready", async () =>  {
    print("Bot ready !");
    await readJSfiles();
    await readSlashCommands();
    print("ok !");

    //await deleteAllGuildCommands();
    //await deleteAllGlobalCommands();
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
    let cmd = client.commands.get(interaction.commandName)
    if(cmd){
        await cmd.run(client, interaction);
    }
});

client.login(botInfo.token);