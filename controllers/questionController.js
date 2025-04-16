const Question = require('../models/Question');

exports.postQuestion = async (req, res) => {
  const { title, body, tags } = req.body;
  const question = await Question.create({ title, body, tags, user: req.user.id });
  res.json(question);
};

exports.answerQuestion = async (req, res) => {
  const { questionId } = req.params;
  const { text } = req.body;
  const question = await Question.findById(questionId);
  question.answers.push({ text, user: req.user.id });
  await question.save();
  res.json(question);
};

exports.getAllQuestions = async (req, res) => {
  const questions = await Question.find().populate('user', 'name').sort({ createdAt: -1 });
  res.json(questions);
};
