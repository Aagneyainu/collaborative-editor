
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(auth);
router.use(authorize('admin'));

router.get('/dashboard', (req, res) => {
  res.send('Admin Dashboard');
});

module.exports = router;
