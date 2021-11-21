var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Product = mongoose.model('Product')
var csurf = require('csurf')
var passport = require('passport');
var Cart = require('../models/cart')
var Order = require('../models/order')

router.use(csurf());
// router.use(csrfProctection);
/* GET home page. */
router.get('/', function(req, res, next) {
    Product.find(function(err, docs) {
        chunksz = 3
        chunks = []
        for (var i = 0; i < docs.length; i += chunksz) {
            chunks.push(docs.slice(i, i + chunksz))
        }
        res.render('shop/index', { title: 'Shopping Cart', products: chunks })
    }).lean()
});

router.get('/add-to-cart/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function(err, product) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        res.redirect('/');
    });
});
router.get('/delete/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/');
        } else { console.log('Error in employee delete :' + err); }
    });
});
router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});



router.get('/shopping-cart', function(req, res, next) {
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', { products: null })
    }
    var cart = new Cart(req.session.cart)
    res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice })
})

router.get('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', { total: cart.totalPrice, errMsg: errMsg, noError: !errMsg, csrfToken: req.csrfToken() });
});

router.post('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
        paymentId: '123'
    });
    order.save(function(err, result) {
        req.flash('success', 'Successfully bought product!');
        req.session.cart = null;
        res.redirect('/');
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}