const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Survivor = require('./user');

/*module.exports= function (passport) {
    console.log('Configuring Passport - Function Called');
    console.log('Passport object received:', passport);
  
    if (typeof passport !== 'object') {
      console.error('Invalid passport object received');
      return;
    }  
  console.log('Configuring Passport');
  console.log('User model:', User);

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
    }, async (username, password, done) => {
        try {
            // Proper usage of Mongoose's async API
            const user = await User.findOne({ username }).exec();

            if (!user) {
                return done(null, false, { message: 'Incorrect Username' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return done(null, false, { message: 'Incorrect Password' });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id).exec();
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
}*/

module.exports = function(passport) {
    console.log('Configuring Passport - Function Called');
    console.log('Passport object received:', passport);
  
    if (typeof passport !== 'object') {
      console.error('Invalid passport object received');
      return;
    }  
    console.log('Configuring Passport');
    console.log('User model:', Survivor);

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
    }, async (username, password, done) => {
        try {
            const user = await Survivor.findOne({ username }).exec();

            if (!user) {
                return done(null, false, { message: 'Incorrect Username' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return done(null, false, { message: 'Incorrect Password' });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await Survivor.findById(id).exec();
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};

//module.exports = {configurePassport};

