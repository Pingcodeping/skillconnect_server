const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
 
const questionSchema = new mongoose.Schema({
  title: String,
  body: String,
  tags: [String],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answers: [answerSchema],
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
