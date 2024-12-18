/*const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, sparse: true }, // 'sparse' allows this to be optional
    phone: { type: String, unique: true, sparse: true },
    username: {type: String, unique: true, required:true},
    password: { type: String, required: true }
});

// Hash password before saving to the database
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;*/

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/CommunityChat', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const SurvivorSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('Survivor', SurvivorSchema);
