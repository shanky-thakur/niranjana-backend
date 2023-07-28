const {Schema} = require ('mongoose');
const {mongoose} = require('mongoose');

const userschema = new Schema({
    email:{
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
});

const User = mongoose.model('user',userschema);

module.exports = User;