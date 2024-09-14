const User = require("../models/userModel.js");

const generateUsername = async (newName)=>{

    return User.findOne({username : newName})
          .then(function (account){
            if(account != null){
                newName += Math.floor(Math.random() * 100 + 1);
                generateUsername(newName);
            }
            return newName;
    })
    .catch(function (err){
        throw err;
    });
}

module.exports =  generateUsername;