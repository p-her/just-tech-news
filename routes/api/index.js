const router = require('express').Router();
const userRoutes = require('./user-routes');



// in user-routes.js, we didn't use the word users in any routes
// because in this file we take those routes and implement them to
// another router instance, prefixing them with the path /users at that time
router.use('/users', userRoutes);


module.exports = router;