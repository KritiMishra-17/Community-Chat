const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  userRole: { type: String, enum: ['admin', 'moderator', 'member'], default: 'member' },
  timestamp: { type: Date, default: Date.now },
  reactions: {
    likes: { type: Number, default: 0 },
    emojis: { type: [String], default: [] }
  },
  comments: [commentSchema] // Add comments array to the chat schema
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;

