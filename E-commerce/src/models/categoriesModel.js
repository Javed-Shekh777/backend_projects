const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name : {
        type: String ,
        trim:true,
        required : [true,"Category name is required."]
    },
    description: {
        type : String ,
        trim:true,
    },
    parent_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"category"
    }
    
},
    { timestamps: true }
);

module.exports = mongoose.model("category", categorySchema);