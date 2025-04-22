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

exports.getAllQuestionsWithAnswers = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('user', 'name')  // Populating the user who posted the question
      .populate('answers.user', 'name')  // Populating the user who posted the answers
      .sort({ createdAt: -1 }); // Sorting by creation date (newest first)
    
    // Structuring the response with question and answers together
    const formattedQuestions = questions.map(question => ({
      _id: question._id,
      title: question.title,
      body: question.body,
      tags: question.tags,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      user: question.user, // The user who posted the question
      answers: question.answers.map(answer => ({
        text: answer.text,
        user: answer.user, // The user who posted the answer
        createdAt: answer.createdAt
      }))
    }));

    res.json(formattedQuestions);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching questions and answers' });
  }
};


exports.getQuestionsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const questions = await Question.find({ user: userId })
      .populate('user', 'name email')  // optionally populate user details
      .populate('answers.user', 'name email') // optionally populate answer authors
      .sort({ createdAt: -1 }); // newest first

    res.json({ success: true, data: questions });
  } catch (err) {
    console.error("Error fetching user questions:", err);
    res.status(500).json({ success: false, message: "Failed to fetch questions" });
  }
};


