const express = require('express');
const router = express.Router();
const quizManagementController = require('../controllers/quizManagementController');
const { authenticate } = require('../db/jwt.config');
const multer = require('multer');

// Configure multer to store files in memory so we can validate it before saving
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/generate', authenticate, upload.single('image'), quizManagementController.generateQuiz);
router.delete('/delete/:id', authenticate, quizManagementController.deleteQuiz);
router.get('/', authenticate, quizManagementController.getAllQuizzes);
router.get('/questions/:quizName', quizManagementController.getQuizByName);

module.exports = router;
