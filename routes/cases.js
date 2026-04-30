const router = require('express').Router();
const Case = require('../models/Case');
const User = require('../models/User');
const PointsLog = require('../models/PointsLog');
const auth = require('../middleware/auth');
router.get('/', auth, async (req, res) => {
  try {
    const cases = await Case.find({ approved: true }).select('bedNo disease severity createdAt').sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/', auth, async (req, res) => {
  try {
    const { bedNo, disease, severity } = req.body;
    if (!bedNo || !disease || !severity) return res.status(400).json({ message: 'All fields required' });
    const newCase = await Case.create({ bedNo, disease, severity, submittedBy: req.user.userId });
    res.status(201).json({ message: 'Case submitted, pending approval', case: newCase });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/pending', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    const cases = await Case.find({ approved: false }).populate('submittedBy', 'name email').sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.patch('/:id/approve', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    const caseDoc = await Case.findById(req.params.id);
    if (!caseDoc) return res.status(404).json({ message: 'Case not found' });
    if (caseDoc.approved) return res.status(400).json({ message: 'Already approved' });
    if (!caseDoc.pointsAwarded) {
      await User.findByIdAndUpdate(caseDoc.submittedBy, { $inc: { points: 10 } });
      await PointsLog.create({ userId: caseDoc.submittedBy, caseId: caseDoc._id, points: 10 });
      caseDoc.pointsAwarded = true;
    }
    caseDoc.approved = true;
    caseDoc.approvedBy = req.user.userId;
    await caseDoc.save();
    res.json({ message: 'Case approved, +10 points awarded' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
module.exports = router;
