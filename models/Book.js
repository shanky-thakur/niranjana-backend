const {mongoose} = require('mongoose');
const {Schema} = require('mongoose');

const bookschema = new Schema({
    title : {
        type : String,
        require : true
    },
    link : {
        type : String,
        require : true
    }
});

const book = mongoose.model('book',bookschema);
module.exports = book;