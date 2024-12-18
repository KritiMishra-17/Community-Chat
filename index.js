/*const express = require("express");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);  // Create the HTTP server
const io = new Server(httpServer);     // Integrate Socket.IO with the HTTP server

// Middleware for serving static files
app.use(express.static(path.join(__dirname, "public")));

// Set view engine to EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle incoming chat messages
  socket.on("chat message", (msg) => {
    console.log("Message received: " + msg);
    // Broadcast the message to all connected clients
    io.emit("chat message", msg);
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.get("/chats", async (req,res) => {
  try{
 let chats= await Chat.find();
 //console.log(chats);
 //res.send("working");
 res.render("index.ejs", {chats});
  }
  catch(err) {
      next(err);
  }
})

// Route to render the chat interface
app.get("/", (req, res) => {
  res.send("This is the root page");
});

// Start the server
httpServer.listen(3000, () => {
  console.log("Server running on port 3000");
});*/

/*const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");
const methodOverride = require("method-override");
const Chat = require("./models/chat.js"); // Import Chat model

const app = express(); 
const httpServer = createServer(app);
const io = new Server(httpServer);

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Set EJS as the view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/CommunityChat', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 20000, // 20 seconds timeout
  });
  console.log("Connected to MongoDB");
}

main()
  .catch(err => console.log("Error connecting to MongoDB:", err));


// Serve the chat page
app.get("/chats", async (req, res, next) => {
  try {
    // Fetch all chats from the database
    let chats = await Chat.find();
    // Render the chat page with existing chats
    res.render("index.ejs", { chats });
  } catch (err) {
    next(err);
  }
});

app.get("/chats/new", (req,res) => {
  //throw new expressError(404, "page not found");
  const username = req.session.username; 
  if (!username) {
      return res.redirect('/login'); 
  }
  res.render("new.ejs", {username});
})

//Create route
app.post("/chats", async (req,res) => {
  try{
      let {username, message} =req.body;
      let newChat = new Chat({
          username: username,
          message: message,
          timestamp: new Date(),
      })
      //console.log(newChat);
      await newChat.save()
      .then((res) => {
          console.log("Chat was saved");
      })
      .catch((err) => {
       console.log(err);
      })
      res.redirect("/chats");
  }
  catch(err) {
      next(err);
  }
})

io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle incoming chat messages from a user
  socket.on("chat message", async (msg) => {
    try {
      let newChat = new Chat({
        username: msg.username,
        message: msg.message,
        userRole: msg.userRole || 'member', // Set default userRole
        timestamp: msg.timestamp,
        reactions: { likes: 0, emojis: [] }
      });

      let savedChat = await newChat.save();

      // Broadcast the message to all connected clients
      io.emit("chat message", savedChat);
    } catch (err) {
      console.error("Error saving chat message:", err);
    }
  });

  // Handle 'like message' event
  socket.on("like message", async (data) => {
    try {
      let message = await Chat.findById(data.id);
      message.reactions.likes += 1;
      let updatedMessage = await message.save();

      // Broadcast the updated reactions to all clients
      io.emit("reaction update", updatedMessage);
    } catch (err) {
      console.error("Error liking message:", err);
    }
  });

  // Handle 'emoji message' event
  socket.on("emoji message", async (data) => {
    try {
      let message = await Chat.findById(data.id);
      message.reactions.emojis.push(data.emoji);
      let updatedMessage = await message.save();

      // Broadcast the updated reactions to all clients
      io.emit("reaction update", updatedMessage);
    } catch (err) {
      console.error("Error adding emoji to message:", err);
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
});

app.get("/", (req,res) => {
res.send("This is the root page");
})

// Start the server
httpServer.listen(8080, () => {
  console.log("Server running on port 8080");
});*/

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const configurePassport = require('./models/passport.js');
const Survivor = require('./models/user.js');
const Chat = require('./models/chat.js');
//import configurePassport from './models/passport.js';

/*const path= require('path');
const configurePassportPath = path.resolve(__dirname, './models/passport');
console.log('Resolved passport path:', configurePassportPath);

const configurePassport = require(configurePassportPath);
console.log('Type of configurePassport:', typeof configurePassport);
console.log('configurePassport:', configurePassport);
// Add more logging
console.log('Passport module:', passport);
console.log('ConfigurePassport function:', configurePassport);

// Explicitly check and call the function
if (typeof configurePassport === 'function') {
  configurePassport(passport);
} else {
  console.error('configurePassport is not a function');
}*/

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Set EJS as the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// MongoDB connection
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/CommunityChat', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 20000,
  });
  console.log('Connected to MongoDB');
}

main().catch((err) => console.log('Error connecting to MongoDB:', err));

// Session and Passport setup
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/CommunityChat', collectionName: 'sessions' }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

// ...
// Set up Passport
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());
// ...

/*configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());*/ 

// Login route
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ message: info.message });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      req.session.username = user.username;
      return res.redirect('/chats');
    });
  })(req, res, next);
});

// Signup route
app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await Survivor.findOne({ username });
    if (existingUser) {
      return res.status(400).render('signup', { error: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Survivor({
      username,
      password: hashedPassword,
    });
    await user.save();
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

// Logout route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.redirect('/');
    }
    res.redirect('/login');
  });
});

// Chat routes
app.get('/chats', async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  try {
    const chats = await Chat.find();
    console.log('Chats:', chats);
    res.render('index', {
      chats,
      username: req.user.username,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/chats/new', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  res.render('new', { username: req.session.username });
});

app.post('/chats', async (req, res, next) => {
  try {
    const { username, message } = req.body;
    const newChat = new Chat({
      username,
      message,
      timestamp: new Date(),
    });
    await newChat.save();
    res.redirect('/chats');
  } catch (err) {
    next(err);
  }
});

// Edit Route - Render the edit form
app.get('/chats/:id/edit', async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).send('Chat not found');
    }
    if (chat.username !== req.user.username) {
      return res.status(403).send('You are not authorized to edit this chat');
    }
    res.render('edit', { chat });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update Route - Handle form submission to update the chat
app.patch('/chats/:id', async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).send('Chat not found');
    }
    if (chat.username !== req.user.username) {
      return res.status(403).send('You are not authorized to edit this chat');
    }
    chat.message = req.body.message;
    chat.timestamp = new Date(); // Update the timestamp
    await chat.save();
    res.redirect('/chats');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete Route
app.delete('/chats/:id', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  try {
    const chat = await Chat.findById(req.params.id);
    
    // Check if chat exists
    if (!chat) {
      return res.status(404).send('Chat not found');
    }
    
    // Check if the current user is the author of the chat
    if (chat.username !== req.user.username) {
      return res.status(403).send('You are not authorized to delete this chat');
    }
    
    // Delete the chat
    await Chat.findByIdAndDelete(req.params.id);
    
    // Redirect back to chats page
    res.redirect('/chats');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Add a comment to a chat
app.post('/chats/:id/comments', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  
  try {
    const chat = await Chat.findById(req.params.id);
    
    if (!chat) {
      return res.status(404).send('Chat not found');
    }
    
    const newComment = {
      username: req.user.username,
      text: req.body.commentText,
      timestamp: new Date()
    };
    
    chat.comments.push(newComment);
    await chat.save();
    
    // Emit socket event for real-time comment
    io.emit('new comment', { 
      chatId: chat._id, 
      comment: newComment 
    });
    
    res.redirect('/chats');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


/*app.post('/chats/:id/like', async (req, res) => {
  try {
    const message = await Chat.findById(req.params.id);
    message.reactions.likes += 1;
    const updatedMessage = await message.save();
    res.json(updatedMessage);
  } catch (err) {
    console.error('Error liking message:', err);
    res.status(500).send('Error liking message');
  }
});*/

// Socket.IO chat functionality
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', async (msg) => {
    try {
      const newChat = new Chat({
        username: msg.username,
        message: msg.message,
        userRole: msg.userRole || 'member',
        timestamp: msg.timestamp,
        reactions: { likes: 0, emojis: [] },
      });
      const savedChat = await newChat.save();
      io.emit('chat message', savedChat);
    } catch (err) {
      console.error('Error saving chat message:', err);
    }
  });

  socket.on('like message', async (data) => {
    try {
      console.log('Chat ID received:', data.id); // Debugging line
      const message = await Chat.findById(data.id);
      if (!message) {
        console.error('Message not found in the database for ID:', data.id);
        return;
      }
      message.reactions.likes += 1;
      const updatedMessage = await message.save();
      io.emit('reaction update', updatedMessage);
    } catch (err) {
      console.error('Error liking message:', err);
    }
  });

  socket.on('emoji message', async (data) => {
    try {
      const message = await Chat.findById(data.id);
      message.reactions.emojis.push(data.emoji);
      const updatedMessage = await message.save();
      io.emit('reaction update', updatedMessage);
    } catch (err) {
      console.error('Error adding emoji to message:', err);
    }
  });

  socket.on('add comment', async (data) => {
    try {
      const chat = await Chat.findById(data.chatId);
      if (!chat) {
        console.error('Chat not found');
        return;
      }
      
      const newComment = {
        username: data.username,
        text: data.commentText,
        timestamp: new Date()
      };
      
      chat.comments.push(newComment);
      const savedChat = await chat.save();
      
      // Broadcast the new comment to all clients
      io.emit('new comment', { 
        chatId: data.chatId, 
        comment: newComment 
      });
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const { status = 500, message = 'Something went wrong' } = err;
  res.status(status).send(message);
});

app.get('/', (req, res) => {
  res.render('index', { username: req.user ? req.user.username : 'Guest' });
});

// Start the server
httpServer.listen(8080, () => {
  console.log('Server running on port 8080');
});