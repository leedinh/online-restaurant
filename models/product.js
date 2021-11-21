var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    imagepath: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    category: { type: String, required: true }
});
mongoose.model('Product', schema)