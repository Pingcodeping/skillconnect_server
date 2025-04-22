const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { postQuestion, answerQuestion, getAllQuestions, getAllQuestionsWithAnswers,
    getQuestionsByUser
 } = require('../controllers/questionController');

router.post('/', auth, postQuestion);
router.post('/:questionId/answer', auth, answerQuestion);
router.get('/', getAllQuestions);
router.get('/getAllQuestionsWithAnswers',getAllQuestionsWithAnswers);

router.get('/user/:userId', getQuestionsByUser);

module.exports = router;


