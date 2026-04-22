const Quiz = require('../model/quiz');
const path = require('path');
const fs = require('fs');

const frontendSrcPath = path.join(__dirname, '../../client/src');
const funQuizzesPath = path.join(frontendSrcPath, 'components/FunQuizzes');
const assetsPath = path.join(__dirname, '../uploads/quizzes');
const indexJsPath = path.join(frontendSrcPath, 'index.js');

exports.generateQuiz = async (req, res) => {
    try {
        const { heading, link, questions, suggestions, traitTitle } = req.body;
        console.log("Generating Quiz:", heading, link);
        
        if (!req.file) {
            return res.status(400).json({ error: "Image file is required" });
        }
        
        const parsedQuestions = JSON.parse(questions);
        const parsedSuggestions = JSON.parse(suggestions);

        // 1. Save Image
        const ext = path.extname(req.file.originalname);
        const imageName = `${link}_${Date.now()}${ext}`;
        const imagePath = path.join(assetsPath, imageName);
        fs.writeFileSync(imagePath, req.file.buffer);

        // 2. Create Quiz Directory
        const quizDirPath = path.join(funQuizzesPath, link);
        if (!fs.existsSync(quizDirPath)) {
            fs.mkdirSync(quizDirPath, { recursive: true });
        }

        // 3. Generate questions.js
        const questionsContent = `const quizQuestions = ${JSON.stringify(parsedQuestions, null, 2)};\n\nexport default quizQuestions;\n`;
        fs.writeFileSync(path.join(quizDirPath, 'questions.js'), questionsContent);

        // 4. Generate trait.js
        const traitContent = `
import React from 'react';

const calculateFinalTrait = (score, totalQuestions) => {
  let traitText = '';

  if (score >= Math.ceil(totalQuestions * 0.8)) {
    traitText = (
      <div>
        <p>Excellent! Here is your suggestion:</p>
        <p>${parsedSuggestions[0] || 'Keep it up!'}</p>
      </div>
    );
  } else if (score >= Math.ceil(totalQuestions * 0.6)) {
    traitText = (
      <div>
        <p>Good job! Here is your suggestion:</p>
        <p>${parsedSuggestions[1] || 'You are doing fine.'}</p>
      </div>
    );
  } else if (score >= Math.ceil(totalQuestions * 0.4)) {
    traitText = (
      <div>
        <p>Needs improvement. Here is your suggestion:</p>
        <p>${parsedSuggestions[2] || 'Consider working on this.'}</p>
      </div>
    );
  } else {
    traitText = (
      <div>
        <p>Take action. Here is your suggestion:</p>
        <p>${parsedSuggestions[3] || 'Please seek out resources.'}</p>
      </div>
    );
  }

  return traitText;
};

export default calculateFinalTrait;
`;
        fs.writeFileSync(path.join(quizDirPath, 'trait.js'), traitContent);

        // 5. Generate Component.js
        const componentContent = `
import React from 'react';
import QuizTemplate from '../Components/QuizTemplate';
import quizQuestions from './questions';
import calculateFinalTrait from './trait';

const ${link} = ({ onClose }) => {
  const finalTrait = (score, totalQuestions) => {
    return calculateFinalTrait(score, totalQuestions);
  };

  return (
    <QuizTemplate
      title="${heading}"
      questions={quizQuestions}
      onClose={onClose}
      finalTrait={finalTrait}
    />
  );
};

export default ${link};
`;
        fs.writeFileSync(path.join(quizDirPath, `${link}.js`), componentContent);

        // 6. DB Record
        const newQuiz = await Quiz.create({
            heading,
            link: `/${link}`,
            imageUrl: imageName,
            suggestions: JSON.stringify(parsedSuggestions)
        });

        // 7. Inject Route into client/src/index.js
        let indexJsContent = fs.readFileSync(indexJsPath, 'utf8');
        
        const lazyImportMatches = [...indexJsContent.matchAll(/const .* = React\.lazy\(\(\) => import\(.*?\)\);/g)];
        if (lazyImportMatches.length > 0) {
            const lastLazyImport = lazyImportMatches[lazyImportMatches.length - 1];
            const injectionIndex = lastLazyImport.index + lastLazyImport[0].length;
            const newImport = `\nconst ${link} = React.lazy(() => import('./components/FunQuizzes/${link}/${link}'));`;
            indexJsContent = indexJsContent.slice(0, injectionIndex) + newImport + indexJsContent.slice(injectionIndex);
        }

        const childrenArrayMatch = indexJsContent.match(/children:\s*\[/);
        if (childrenArrayMatch) {
            const injectionIndex = childrenArrayMatch.index + childrenArrayMatch[0].length;
            const newRoute = `\n      { path: '/${link}', element: <${link}/> },`;
            indexJsContent = indexJsContent.slice(0, injectionIndex) + newRoute + indexJsContent.slice(injectionIndex);
        }

        fs.writeFileSync(indexJsPath, indexJsContent);

        res.status(201).json(newQuiz);
    } catch (err) {
        console.error("Error generating quiz:", err);
        res.status(500).json({ error: "Failed to generate quiz" });
    }
};

exports.deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const quiz = await Quiz.findByPk(id);
        
        if (!quiz) {
            return res.status(404).json({ error: "Quiz not found" });
        }

        const link = quiz.link.startsWith('/') ? quiz.link.substring(1) : quiz.link;
        
        await quiz.destroy();

        const quizDirPath = path.join(funQuizzesPath, link);
        if (fs.existsSync(quizDirPath)) {
            fs.rmSync(quizDirPath, { recursive: true, force: true });
        }

        const imagePath = path.join(assetsPath, quiz.imageUrl);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        let indexJsContent = fs.readFileSync(indexJsPath, 'utf8');
        
        // Use safer string replace instead of complex regex
        const importStr = `const ${link} = React.lazy(() => import('./components/FunQuizzes/${link}/${link}'));`;
        indexJsContent = indexJsContent.replace(importStr, '');

        const routeStr = `{ path: '/${link}', element: <${link}/> },`;
        indexJsContent = indexJsContent.replace(routeStr, '');
        
        // Also try to replace with whitespace variants if exact match fails
        const fallbackImportRegex = new RegExp(`const \\s*${link}\\s*=\\s*React\\.lazy\\(\\(\\) => import\\('\\./components/FunQuizzes/${link}/${link}'\\)\\);`, 'g');
        const fallbackRouteRegex = new RegExp(`\\{\\s*path:\\s*'/${link}',\\s*element:\\s*<\\s*${link}\\s*/>\\s*\\},?`, 'g');
        
        indexJsContent = indexJsContent.replace(fallbackImportRegex, '');
        indexJsContent = indexJsContent.replace(fallbackRouteRegex, '');

        fs.writeFileSync(indexJsPath, indexJsContent);

        res.json({ message: "Quiz deleted successfully" });
    } catch (err) {
        console.error("Error deleting quiz:", err);
        res.status(500).json({ error: "Failed to delete quiz" });
    }
};

exports.getQuizByName = async (req, res) => {
    try {
        const { quizName } = req.params;
        // Strip leading slash if present
        const cleanName = quizName.replace(/^\//, '');
        
        // Find in DB by link (stored as /QuizName)
        const quiz = await Quiz.findOne({ where: { link: `/${cleanName}` } });
        if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

        // Read the generated questions.js file
        const questionsPath = path.join(funQuizzesPath, cleanName, 'questions.js');
        if (!fs.existsSync(questionsPath)) {
            return res.status(404).json({ error: 'Quiz questions file not found' });
        }
        
        // Parse questions from the JS file content
        const content = fs.readFileSync(questionsPath, 'utf8');
        const match = content.match(/const \w+ = (\[[\s\S]*?\]);/);
        if (!match) return res.status(500).json({ error: 'Could not parse quiz questions' });
        
        // Convert JS array string to valid JSON
        let jsonStr = match[1]
            .replace(/(\w+):/g, '"$1":')        // quote keys
            .replace(/'/g, '"')                 // single to double quotes
            .replace(/,\s*\]/g, ']')            // remove trailing commas in arrays
            .replace(/,\s*\}/g, '}');           // remove trailing commas in objects
        
        const questions = JSON.parse(jsonStr);

        res.json({
            heading: quiz.heading,
            link: quiz.link,
            imageUrl: quiz.imageUrl,
            questions,
            suggestions: quiz.suggestions ? JSON.parse(quiz.suggestions) : []
        });
    } catch (err) {
        console.error('Error fetching quiz by name:', err);
        res.status(500).json({ error: 'Failed to fetch quiz' });
    }
};
exports.getAllQuizzes = async (req, res) => {
    try {
        let quizzes = await Quiz.findAll();
        
        // Auto-seed if empty
        if (quizzes.length === 0) {
            const initialQuizzes = [
                { heading: "Sleep Quiz", link: "/SleepQuiz", imageUrl: "sleep.jpg" },
                { heading: "Anger Quiz", link: "/AngerQuiz", imageUrl: "anger.webp" },
                { heading: "Anxiety Quiz", link: "/AnxietyQuiz", imageUrl: "anxiety.avif" },
                { heading: "Motivation Quiz", link: "/MotivationQuiz", imageUrl: "motivation.avif" },
                { heading: "Habit Quiz", link: "/HabitQuiz", imageUrl: "habit.jpeg" },
                { heading: "Stress Quiz", link: "/StressQuiz", imageUrl: "Stress.jpg" },
                { heading: "Quality of Life Quiz", link: "/QualityOfLifeQuiz", imageUrl: "QOL.jpg" },
                { heading: "Emotional Intelligence Quiz", link: "/EmotionalIntelligenceQuiz", imageUrl: "EI.jpeg" },
                { heading: "Happiness Quiz", link: "/HappinessQuiz", imageUrl: "happiness.png" },
                { heading: "Social Relationship Quiz", link: "/SocialRelationshipQuiz", imageUrl: "social.jpg" },
                { heading: "Lifestyle Quiz", link: "/LifeStyleQuiz", imageUrl: "lifestyle.jpg" },
                { heading: "Internet Usage Quiz", link: "/InternetUsageQuiz", imageUrl: "internet.jpg" },
                { heading: "Depression Test", link: "/DepressionTest", imageUrl: "DEPRESSION.jpeg" },
                { heading: "Body Image Quiz", link: "/BodyImageQuiz", imageUrl: "bodyImage.jpg" },
                { heading: "Time Management Quiz", link: "/TimeManagementQuiz", imageUrl: "time.jpg" }
            ];
            await Quiz.bulkCreate(initialQuizzes);
            quizzes = await Quiz.findAll();
        }

        res.json(quizzes);
    } catch (err) {
        console.error("Error fetching quizzes:", err);
        res.status(500).json({ error: "Failed to fetch quizzes" });
    }
};
