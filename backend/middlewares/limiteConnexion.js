const rateLimit = require("express-rate-limit");

limiteConnexion = rateLimit({
    windowMs: 300000, // 5 minutes
    max: 3 // Bloque après 3 essaies.
});

module.exports = limiteConnexion;