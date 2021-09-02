const Discord = require("discord.js");
const fs = require("fs");
const fetch = require('node-fetch');
const botInfo = require("./botInfo.json");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

const client = new Discord.Client({intents: ["GUILDS", "DIRECT_MESSAGES"]});
//const guildId = '663799678596546570';
const guildId = '850021375074238504';

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



async function deleteAllGuildCommands(){
    client.guilds.cache.forEach(async (guild) => {
      let COMMANDS = await client.api.applications(client.user.id).guilds(guild.id).commands.get();
          for(i = 0; i<COMMANDS.length;i++){
          console.log("commande à supprimer: " + COMMANDS[i].name)
          try{
          await client.api.applications(client.user.id).guilds(guild.id).commands(COMMANDS[i].id).delete();
          }catch(e){
              console.log("impossible de supprimer " + COMMANDS[i].name);
              console.log(e.stack());
          }
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

    let interval = setInterval(async() => {
        let remindersDir = fs.readdirSync('./edt/');
        for(let i = 0; i<remindersDir.length; i++){
            let edt = remindersDir[i];
            //let edtReaded = require('./edt/' + edt);
            let edtReaded = JSON.parse(fs.readFileSync('./edt/' + edt));
            //console.log("edt readed read !");
            //console.log(edtReaded);
            for(let j = 0; j<edtReaded.events.length; j++){
                let event = edtReaded.events[j];
                if(Date.now() >= event.date){
                    //FAIRE l'ANNONCE & delete l'event
                    //console.log("nom: " + event.name + " date: " + event.date, " fichier: " + edt + " event numéro: " + j);
                    //console.log("omg un event est arrivé à expiration comme un joueur cs avec une mauvaise co #cesariou");
                    let id = edt.split('.')[0];
                    let player = await client.users.fetch(id);
                    player.send("Tu dois: " + event.name);
                    edtReaded.events.splice(j,1);
                    edtReaded.events_nb -= 1;
                    fs.writeFileSync('./edt/'+edt, JSON.stringify(edtReaded));
                }else{
                    //console.log("nada: date now: " + Date.now());
                }
            }
        }
    }, 1000);

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