/*const mongoose = require('mongoose');
const { Schema } = mongoose; // Import Schema

main()
.then(() =>{
console.log("Connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/CommunityChat');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const Joi = require('joi');

// Define the schema
const chatMessageSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    message: Joi.string().min(1).max(500).required(),
    timestamp: Joi.date().timestamp().required(),
    //roomId: Joi.string().required(),  // For different chat rooms
    reactions: Joi.object({
        likes: Joi.number().integer().min(0).default(0),
        emojis: Joi.array().default([])
    }).optional(),
    userRole: Joi.string().valid('admin', 'moderator', 'member').default('member')
});

const Chat = mongoose.model('Chat', chatMessageSchema);

// Example data to validate
const chat1 = new Chat({
    username: "JohnDoe",
    message: "Hello, everyone!",
    timestamp: Date.now(),
    //roomId: "community_chat_001",
    reactions: {
        likes: 5,
        emojis: ['😀', '👍']
    },
    userRole: 'member'
});

chat1.save();

// Validate the message
const { error, value } = chatMessageSchema.validate(chat1);

if (error) {
    console.log('Validation error:', error.details[0].message);
} else {
    console.log('Validated message data:', value);
}*/

const mongoose = require('mongoose');
const { Schema } = mongoose;
const Joi = require('joi');

// Mongoose connection
main()
  .then(() => {
    console.log("Connection successful");
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/CommunityChat');
}

// Define Mongoose schema for chat messages
const chatSchema = new Schema({
  username: { type: String, required: true, minlength: 3, maxlength: 30 },
  message: { type: String, required: true, minlength: 1, maxlength: 500 },
  timestamp: { type: Date, default: Date.now },
  reactions: {
    likes: { type: Number, default: 0 },
    emojis: { type: [String], default: [] }
  },
  userRole: { type: String, enum: ['admin', 'moderator', 'member'], default: 'member' }
});

// Create a Mongoose model
const Chat = mongoose.model('Chat', chatSchema);

// Define Joi schema for validation
const joiChatMessageSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  message: Joi.string().min(1).max(500).required(),
  timestamp: Joi.date().timestamp().required(),
  reactions: Joi.object({
    likes: Joi.number().integer().min(0).default(0),
    emojis: Joi.array().items(Joi.string()).default([])
  }).optional(),
  userRole: Joi.string().valid('admin', 'moderator', 'member').default('member')
});

// Example data to validate and save
const messageData = {
  username: "JohnDoe",
  message: "Hello, everyone!",
  timestamp: Date.now(),
  reactions: {
    likes: 5,
    emojis: ['😀', '👍']
  },
  userRole: 'member'
};

// Validate the message data using Joi
const { error, value } = joiChatMessageSchema.validate(messageData);

if (error) {
  console.log('Validation error:', error.details[0].message);
} else {
  console.log('Validated message data:', value);

  // If data is valid, save it to the MongoDB database using Mongoose
  const chat1 = new Chat(value);
  chat1.save()
    .then(savedMessage => {
      console.log('Message saved successfully:', savedMessage);
    })
    .catch(err => {
      console.error('Error saving message:', err);
    });
}


      