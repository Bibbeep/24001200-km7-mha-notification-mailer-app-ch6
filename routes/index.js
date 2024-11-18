const router = require('express').Router();
const UserController = require('../controllers/user');

router.get('/register', (req, res) => {
    res.render('register');
});
router.post('/register', UserController.create);

router.get('/login', (req, res) => {
    const { email } = req.query;
    res.render('login', { email });
});
router.post('/login', UserController.login);

router.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});

module.exports = router;