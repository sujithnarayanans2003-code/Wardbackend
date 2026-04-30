const mongoose = require('mongoose');
const caseSchema = new mongoose.Schema({
  bedNo: { type: String, required: true },
  disease: { type: String, required: true },
  severity: { type: String, enum: ['Mild','Moderate','Severe'], required: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  approved: { type: Boolean, default: false },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  pointsAwarded: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('Case', caseSchema);
