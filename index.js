const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql2');
const port = 3000;
const crypto = require('crypto');
const session = require('express-session');
const passport = require('passport');
const { access } = require('fs');
const { profile } = require('console');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use("/css", express.static(__dirname + 'public/css'));
app.use("/images", express.static(__dirname + 'public/images'));
app.use("/js", express.static(__dirname + 'public/js'));


const secretKey = crypto.randomBytes(32).toString('hex');
console.log(secretKey);


app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false
}));

const connection = mysql.createConnection({
  host: 'sql8.freemysqlhosting.net',
  user: 'sql8655169',
  password: 'fp7vPL1V8Y',
  database: 'sql8655169',
});

// google section started //

passport.use(new GoogleStrategy({
  clientID: '1093024460030-lkt96bcnfcajk984j3akl9dde7n46fa4.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: "http://localhost:3000/auth/google/callback"
},async (accessToken, refreshToken, profile, done) => {
  const [users] = await connection.query('SELECT * FROM users WHERE gmail = ?', [profile.id]);
  
  if (users.length > 0) {
    return done (null, users[0]);
  } else {
    const [result] = await connection.query('INSERT INTO users (email, name) VALUES (?, ?)', [profile.id, profile.displayName]);
    const newUser = {
      email: profile.id,
      name: profile.displayName
    };
    return done(null, newUser);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [id]);
  done(null, users[0]);
});

app.use(session({ secret: secretKey, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', { scope: ['profile']}));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (res, req) => {
  res.redirect('/dashboard')
})


const products = [
    {"id": 1, "image": "/images/collection/1.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 2, "image": "/images/collection/2.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 3, "image": "/images/collection/3.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 4, "image": "/images/collection/4.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 5, "image": "/images/collection/5.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 6, "image": "/images/collection/6.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 7, "image": "/images/home decor/1.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 8, "image": "/images/home decor/2.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 9, "image": "/images/home decor/3.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 10, "image": "/images/home decor/4.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 11, "image": "/images/home decor/5.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 12, "image": "/images/home decor/6.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 13, "image": "/images/home decor/7.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 14, "image": "/images/home decor/8.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 15, "image": "/images/home decor/9.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 16, "image": "/images/home decor/10.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 17, "image": "/images/future product/1.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 18, "image": "/images/future product/2.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 19, "image": "/images/future product/3.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 20, "image": "/images/future product/4.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 21, "image": "/images/future product/5.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 22, "image": "/images/future product/6.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 23, "image": "/images/future product/7.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 24, "image": "/images/bathroom decor/1.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 25, "image": "/images/bathroom decor/2.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 26, "image": "/images/bathroom decor/3.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
    {"id": 27, "image": "/images/bathroom decor/4.jpg", "name": "Lorem ipsum dolor sit amet consectetur adipisicing elit", "price": 3325},
];


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const cart = [];

app.get('', (req, res) => {
    res.render(__dirname + '/views/index', { products: products });
});

app.post('/add_cart/:productId', (req, res) => {
    const productId = parseInt(req.params.productId);
    // Find the product with the given ID in your products array
    const product = products.find(p => p.id === productId);
    if (product) {
      // Add the product to the cart
      cart.push(product);
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });

app.get('/cart', (req, res) => {
    res.render(__dirname + '/views/cart', { cart: cart });
})

app.get('/login', (req, res) => {
  res.render(__dirname + '/views/login')
})

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const query = 'SELECT * FROM users WHERE username = ?';
  connection.query(query, [username], (err, results) => {
    if(err) {
      console.error('Error query in database: ', err.stack);
    }

    const user = results[0];
    if(results.length > 0) {
      const fullname = results[0].name;
      if(user.password == password) {
        req.session.loggedIn = true;
        req.session.username = username; 
        res.render(__dirname + '/views/industrial_dashboard', { fullname: fullname });
      }
      else{
        console.log('User not found! ')
      }
    }
  })
})

app.get('/dashboard', (req, res) => {
  res.render(__dirname + '/views/industrial_dashboard', { fullname: req.query.fullname , email: profile.id});
});


app.get('/about', (req, res) => {
  res.render(__dirname + '/views/about')
})

app.get('/register', (req, res) => {
  res.render(__dirname + '/views/create')
})

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      username VARCHAR(50),
      name VARCHAR(50),
      phone VARCHAR(20),
      email VARCHAR(50),
      password VARCHAR(30)
    );`;
  
  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table: ' + err.stack);
    }
    console.log('Table created');
  });

app.post('/user_register', (req, res) => {

  const username = req.body.username;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const password= req.body.password;

  const insertQuery = 'INSERT INTO users(username, name, phone, email, password) VALUES (?, ?, ?, ?, ?)';
  connection.query(insertQuery, [username, name, phone, email, password], (err, result) => {
    if (err) {
      throw err;
    }
    else {
    }
    console.log(`1 record inserted ${result}`);
  });

  const recaptchaResponse = req.body['g-recaptcha-response'];

  const recaptchaSecretkey = '6LcDQqkoAAAAAGW3xxBGTpM-g4HkRwjUIjZJPh2n';
  const axios = require('axios');

  axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretkey}&response=${recaptchaResponse}`)
  
  res.redirect('/login');
});

app.listen(port, () => console.info(`Active port ${port}`));