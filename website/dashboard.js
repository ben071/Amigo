const express = require("express");
const session = require("express-session");
const app = express();
const http = require("http").Server(app);
const passport = require("passport");
const { Strategy } = require("passport-discord");
const bodyparser = require("body-parser");
const path = require("path");

module.exports.load = async(client) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  let scopes = ["identify", "guilds"];

  passport.use(new Strategy({
    clientID: client.user.id,
    clientSecret: client.config.clientSecret,
    callbackURL: `${client.config.websiteURL}/login`,
    scope: scopes
  }, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
        return done(null, profile);
    });
  }));

  http.port = process.env.PORT || 3000;
  http.client = client;

  app
  .use(bodyparser.json())
  .use(bodyparser.urlencoded({ extended: true }))
  .engine("html", require("ejs").renderFile)
  .use(express.static(path.join(__dirname, "/public")))
  .set("view engine", "ejs")
  .set("views", path.join(__dirname, "views"))
  .use(session({
    secret: "amigo.fun dashboard",
    resave: false,
    saveUninitialized: false
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use("/", require("./router/index"))
  .use("/profile", require("./router/profile"))
  .use("/servers", require("./router/servers"))
  .get("*", function(req, res) {
    res.redirect("/");
  });

  http.listen(http.port, function(err) {
    if (err) throw err;
    client.logger.log(`Dashboard is online at the port: ${http.port}`);
  });
  
  process.on("unhandledRejection", (r) => {
    console.dir(r);
  });  
};

