const { v4: uuid4 } = require("uuid");


const voterIdgenerator = (name) => {


    const uuid = uuid4();
    const uiP = uuid.split('-').join('').slice(0, 8);
    const nameP = name.substring(0, 3).toUpperCase();
    const yearP = new Date().getFullYear().toString().slice(2);
    


    const id = `${nameP}${yearP}${uiP}`.slice(0, 12);
     

    return id;

}

module.exports = voterIdgenerator;