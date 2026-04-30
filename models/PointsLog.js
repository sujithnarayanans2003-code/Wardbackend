const mongoose = require('mongoose');
const pointsLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  points: { type: Number, default: 10 },
  reason: { type: String, default: 'Case approved' },
}, { timestamps: true });
module.exports = mongoose.model('PointsLog', pointsLogSchema);
