const rateLimit = require("express-rate-limit");

//limite d'utilisation de requêtes à 250 max par quart d'heure

const limiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 250,
    message: " Trop de tentatives, réessayez dans 5 minutes",

});

module.exports = limiter;

/*const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 5,
  error: " Trop de tentatives, réessayez dans 5 mins",
});

module.exports = rateLimiter;*/