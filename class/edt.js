const Discord = require("discord.js");
const fs = require("fs");


module.exports =  {
    EDT: class{
        constructor(id, client, interaction){
            this.id = id;
            this.client = client;
            this.interaction = interaction;
            this.data = undefined;
        }

        FileExist(){
            const edts = fs.readdirSync('./edt/');
            if(!edts.includes(this.id+".json")){
                console.log("création de la fiche");
                this.setData();
                this.writeFile();
                return false;
            }
            return true;
        }

        setData(){
            this.data = {
                id: this.id,
                events_nb: 0,
                events: [],
                settings: {
                    color: [185,76,225]
                }
            }
        }

        /**
         * @param {*} type Le type (le ou dans)
         */
        addEvent(eventName, type, day, month, year, hours, minute){
            this.readFile()
            this.data.events_nb += 1;

            let date = new Date();
            if(type == 'le'){
                /*date.setFullYear(year);
                console.log("le mois est: " + month);
                month == 0 ? date.setMonth(0) : date.setMonth(month-1); // pas bo
                date.setDate(day);
                date.setHours(hours);
                date.setMinutes(minute);*/
                date = new Date(year, month == 0 ? 0 : month-1, day, hours, minute)
            }
            else if(type == 'dans'){
                let today = new Date();
                date.setFullYear(year + today.getFullYear());
                date.setMonth(month + today.getMonth());
                date.setDate(day + today.getDate());
                date.setHours(hours + today.getHours());
                date.setMinutes(minute + today.getMinutes());
            }

            
            console.log("date : " + new Date(date).toLocaleDateString() + " em mili: " + date.getTime());
            const event = {
                name: eventName,
                date: parseInt(date.getTime())
            }
            this.data.events.push(event);
            this.writeFile();
        }

        removeEvent(eventID){
            this.readFile();
            if(this.data.events_nb == null){
                return 'NO_AGENDA';
            }else if(eventID > this.data.events_nb){
                return 'NOT_FOUND'
            }else{
                this.data.events_nb -= 1;
                this.data.events.splice(eventID-1, 1);
                console.log("data changed: ");
                console.log(this.data);
                this.writeFile();
            }
        }

        removeAllEvent(){
            this.readFile();
            this.data.events = [];
            this.data.events_nb = 0;
            this.writeFile();
        }
        readFile(){
            const data = fs.readFileSync(`./edt/${this.id}.json`)
            this.data = JSON.parse(data);
        }

        getData(){
            this.readFile();
            return this.data;
        }

        writeFile(){
            console.log("write dir !");
            if(this.data == undefined || this.data == null){
                console.log("On a essayer d'écrire les donnée de: " + this.id +" or il n'y a aucune donnée");
                throw 'Data is empty !';
            }else{
                fs.writeFileSync(`./edt/${this.id}.json`, JSON.stringify(this.data));
                return;
            }
        }

        get eventNumber(){
            if(isNaN(this.data.eventNumber)){
                this.readFile();
                if(isNaN(this.data.eventNumber)){
                    console.log("this.data.eventNumber undefined or null or errored");
                    return 0;
                }else{
                    return this.data.eventNumber;
                }
            }else{
                return this.data.eventNumber;
            }
        }
    },
    main: async function(){
        console.log('edt !')
    }
}