const Discord = require("discord.js");
const fs = require("fs");
const { EDT } = require("../class/edt");

module.exports.run = async(client, interaction) => {
    console.log("trop bien !");
    console.log(interaction.options._hoistedOptions);
    await interaction.deferReply({ ephemeral: false }); //for long task. Ephemeral is for user only
    //await interaction.reply("EMT !");
    //await interaction.editReply({content: '** **', embeds: [embed]});

    const edt = new EDT(interaction.user.id);

    if(interaction.options._subcommand == "add"){
        edt.FileExist();
        const option = interaction.options._hoistedOptions;
        edt.addEvent(option[0].value, option[1].value, option[2].value, option[3].value, option[4].value, option[5].value, option[6].value);
        console.log("mois" + option[3].value + " heure: " + option[5].value + " minute: " + option[6].value );
        console.log("add");
        await interaction.editReply("Evènement ajouté !");

    }
    else if(interaction.options._subcommand == "remove"){
        const exist = edt.FileExist();
        if(!exist){
            await interaction.editReply("Vous n'avez pas d'agenda en place, et aucun évènements")
        }else{
            if(interaction.options._hoistedOptions[0].value == 0){
                edt.removeAllEvent();
                await interaction.editReply(`Tout vos évènements on été supprimer.`);
            }else{
                edt.removeEvent(interaction.options._hoistedOptions[0].value)
                await interaction.editReply(`L'evenement numéro ${interaction.options._hoistedOptions[0].value} à été supprimer`);
            }
        }
    }
    else if(interaction.options._subcommand == "show"){
        edt.FileExist();
        const data = edt.getData();
        const player = await client.users.fetch(data.id);

        const embed = new Discord.MessageEmbed()
        .setColor('#8700C1')
        .setTitle(`Agenda partie 1`)
        .setAuthor(player.username, player.avatarURL())

        console.log("base embed create. event: " + data.event_nb);

        if(data.events_nb == 0){
            embed.setDescription("Rien à faire ! Vous êtes tranquilles");
            await interaction.editReply({embeds: [embed]});
            return;
        }

        //pour les 25 premiers: ajouter un field
        //pour le rest créer un embed avec 25 field
        //c'est fait ;)
        //alors supprime les commentaires
        //nan toi.
        //bonne idée: TODO DELETE ALL USELESS COMMENTS
        for(let i=0; i<25; i++){
            if(data.events[i] != null){
                const date = new Date(parseInt(data.events[i].date));
                //console.log("date : " + parseInt(data.events[i].date) + " date local: " + date.toLocaleDateString('fr-FR'));
                embed.addField(`Numéro ${i+1}. Le ${date.toLocaleDateString('fr-FR')} à ${date.toLocaleTimeString('fr-FR')}:`, data.events[i].name);
            }else{
                break;
            }
        }
        await interaction.editReply({embeds: [embed]});

        let j = 2;
        let otherEmbed = new Discord.MessageEmbed()
        .setColor('#8700C1')
        .setTitle(`Agenda partie ${j}`)
        .setAuthor(player.username, player.avatarURL());
        
        for(let i = 26; i < (data.events_nb)+1; i++){
            console.log("for: " + i);
            if(i%25 == 0 && i != 0){
                console.log("modulo 25 == 0 !");
                await interaction.followUp({embeds: [otherEmbed]});
                j++;
                otherEmbed = new Discord.MessageEmbed()
                .setColor('#8700C1')
                .setTitle(`Agenda partie ${j}`)
                .setAuthor(player.username, player.avatarURL());
            }
            if(data.events[i] == undefined){
                break;
            }
            const date = new Date(parseInt(data.events[i].date));
            otherEmbed.addField(`Numéro ${i+1}. Le ${date.toLocaleDateString('fr-FR')} à ${date.toLocaleTimeString('fr-FR')}:`, data.events[i].name);

        }


    }
    
}

module.exports.help =  {
    name:"remind",
    aliases:[]
}