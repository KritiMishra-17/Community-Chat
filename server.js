/*const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const User = require('./models/user.js');
const Chat = require("./models/chat.js"); // Import Chat model

const app = express();

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/chatApp', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: false }));

// Set view engine
app.set('view engine', 'ejs');

// Signup route
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req, res) => {
    const { email, phone, username, password } = req.body;

    if (!email && !phone) {
        return res.send('Please provide either an email or a phone number');
    }

    // Check if email or phone is already registered
    if (email) {
        const userExists = await User.findOne({ email });
        if (userExists) return res.send('Email is already registered');
    }
    if (phone) {
        const userExists = await User.findOne({ phone });
        if (userExists) return res.send('Phone number is already registered');
    }

    const user = new User({ email, phone, username, password });
    await user.save();
    req.session.userId = user._id; // Log in the user
    res.redirect('chat.ejs');
});


// Login route
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { identifier, username, password } = req.body; // identifier can be either email or phone

    // Check if identifier is email or phone
    let user = await User.findOne({ email: identifier });
    if (!user) {
        user = await User.findOne({ phone: identifier });
    }
    if (!user) {
        return res.send('Invalid email/phone or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.send('Invalid email/phone or password');
    }

    req.session.userId = user._id; // Log in the user
    req.session.username = username; // Store the username in the session

    // Fetch all chats and pass them along with the username to the template
    let chats = await Chat.find();
    res.render("index.ejs", { chats, username });
});


// Middleware to check if the user is logged in
function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
}

// Chat route (protected)
app.get('/chats', requireLogin, (req, res) => {
    res.render('index.ejs');
});

app.get("/" , (req,res) => {
    res.send("Root page");
})

// Server
app.listen(8080, () => {
    console.log('Server running on http://localhost:8080');
});*/

const bcrypt= require('bcrypt');
const express= require('express');
const app= express();
const session= require('express-session');
const MongoStore= require('connect-mongo'); //to store the session ids
const passport= require('passport');
const configurePassport= require('./models/passport');
const User = require('./models/user.js');
const Chat = require("./models/chat.js"); // Import Chat model

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/CommunityChat', collectionName: "sessions"}),
  cookie: { maxAge: 1000*60*60*24 }
}))

configurePassport(passport);

app.use(passport.initialize())
app.use(passport.session())

app.get('/login', (req,res) => {
    //res.send("Login get");
    res.render('login');
})

app.get('/signup', (req,res) => {
    //res.send("Register get");
    //console.log("Register page requested"); 
    res.render('signup');
})

//app.post('/login', passport.authenticate('local', {successRedirect: 'protected'}))

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        // Authentication failed
        return res.status(400).json({ message: info.message });
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
      // Store the username in the session
      req.session.username = user.username;
      return res.redirect('/chats');
      });
    })(req, res, next);
  });

app.post('/signup', async (req, res) => {
    /*console.log("Registering in db...");
    console.log("Password received:", req.body.password);
    
    bcrypt.hash(req.body.password, 10)
        .then(hashedPassword => {
            console.log("Hashed password:", hashedPassword);

            let user = new UserModel({
                username: req.body.username,
                password: hashedPassword
            });
            
            return user.save();
        })
        .then(savedUser => {
            console.log("User saved:", savedUser);
            res.send({ success: true });
        })
        .catch(err => {
            console.error("Error saving user:", err);
            res.status(500).send({ success: false, message: "Failed to save user." });
        });

    req.session.userId = user._id; // Log in the user
    res.redirect('chat.ejs');*/

    try {
        const { username, password } = req.body;
    
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(400).render('signup', { error: 'Username already exists' });
        }
    
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create new user
        const user = new User({
          username,
          password: hashedPassword
        });
    
        await user.save();
    
        // Automatically log in after signup
        req.login(user, (err) => {
          if (err) {
            return res.status(500).send('Error logging in after signup');
          }
          req.session.username = username;
          res.redirect('/chats');
        });
      } catch (err) {
        console.error(err);
        res.status(500).render('signup', { error: 'Error during signup' });
      }
    });

app.get('/logout', (req,res) => {
   // res.send("Logout get");
   req.logout((err) => {
    if (err) {
      return res.redirect('/');
    }
    res.redirect('/login');
  });
})

app.get('/chats', async (req,res) => {
    /*console.log(req.session);
    console.log(req.user);

    if(req.isAuthenticated())
    {
    // Fetch all chats and pass them along with the username to the template
    let chats = await Chat.find();
    res.render("index.ejs", { chats, username: req.user.username });
    }
    else{
        res.status(401).send("Incorrect Username or Password");
    }*/
        if (!req.isAuthenticated()) {
            return res.redirect('/login');
          }
        
          try {
            const chats = await Chat.find();
            res.render('index', { 
              chats, 
              username: req.user.username 
            });
          } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
          }
})

// Middleware to check if the user is logged in
/*function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
}

// Chat route (protected)
app.get('/chats', requireLogin, (req, res) => {
    res.render('index.ejs');
});*/


app.get('/', (req,res) => {
    //res.send("Hello World! This is the home page.");
    res.render('index', { username: req.user ? req.user.username : 'Guest' });
})

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/passport', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(8080, (req,res) => {
    console.log("Listening to port 5000");
});

