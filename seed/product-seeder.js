const mongoose = require('mongoose');

// require('../models/product')
require('../models/db')
var Product = mongoose.model('Product');
var products = [

    new Product({
        imagePath: "https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png",
        title: "Gothiccover",
        description: "Good game",
        price: 10
    }),
    new Product({
        imagePath: "https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png",
        title: "Gothiccover",
        description: "Good game",
        price: 11
    }),
    new Product({
        imagePath: "https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png",
        title: "Gothiccover",
        description: "Good game",
        price: 12
    })
];
console.log(products);
var done = 0
for (var i = 0; i < products.length; i++) {
    products[i].save(function(err, result) {
        done++;
        if (done === products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}