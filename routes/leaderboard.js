const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
router.get('/', auth, async (req, res) => {
  try {
    const leaders = await User.find({ role: 'student' }).select('name points').sort({ points: -1 }).limit(20);
    res.json(leaders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
module.exports = router;
