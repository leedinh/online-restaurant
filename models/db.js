const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://admin123:admin123@cluster0.tkgnx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded!') } else {
        console.log('MongoDB Connection Failed')
    }
});

require('./product')