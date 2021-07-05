const passport = require("passport");
const User = require("./models/user");
const passportJWT = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require("bcryptjs");


// Passport login auth
passport.use(
  new LocalStrategy((username, password, done) => {
      User.findOne({ username }, (err, user) => {
          if (err) return done(err);
          if (!user) return done(null, false, { message: 'Incorrect data:' });
          bcrypt.compare(password, user.password, (error, res) => {
              if (res) {
                  return done(null, user);
              }
              return done(null, false, { message: 'Incorrect data' });
          });
      });
  })
);


// Passport signup auth
passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await User.create({ username, password });

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);


// Passport JWT auth
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey : process.env.JWT_SECRET
},
function (jwtPayload, cb) {

  //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
  return UserModel.findOneById(jwtPayload.id)
      .then(user => {
          return cb(null, user);
      })
      .catch(err => {
          return cb(err);
      });
}
));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});