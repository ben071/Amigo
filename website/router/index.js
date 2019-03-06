const express = require('express');
const router = express.Router();
const passport = require("passport");
const CheckAuth = require('../auth/CheckAuth');

router.get("/", function(req, res) { 
    res.render("index.ejs", {
        status: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : "Login"),
        client: req.client.server.client.user,
        user: req.user,
        login: (req.isAuthenticated() ? "yes" : "no"),
        invite: `https://discordapp.com/oauth2/authorize?client_id=${req.client.server.client.user.id}&scope=bot&permissions=-1`
    });
})
    .get("/login", passport.authenticate("discord", { failureRedirect: "/" }), 
        function(req, res) {
            res.redirect("/profile");
    })
        .get("/logout", async function(req, res) {
            await req.logout();
            await res.redirect("/");
        });


module.exports = router;
