const router = require('express').Router();
const UserController = require('../controllers/user');

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', UserController.create);

module.exports = router;