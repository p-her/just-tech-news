// this file collect the packaged API routes endpionts
// and prefixing them with the path /api

const router = require('express').Router();

const apiRoutes = require('./api');

router.use('/api', apiRoutes);

router.use((req, res) => {
    res.status(404).end();
});




module.exports = router;