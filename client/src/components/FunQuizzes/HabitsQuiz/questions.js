const habitQuizQuestions = [
    {
      question: "Which of the following best describes a habit?",
      options: [
        { text: "A behavior that is repeated regularly and tends to occur subconsciously", isCorrect: true },
        { text: "A behavior that is done only occasionally", isCorrect: false },
        { text: "A behavior that is difficult to change", isCorrect: false },
        { text: "A behavior that is harmful to oneself", isCorrect: false }
      ],
      suggestion: "A habit is a behavior that is repeated regularly and tends to occur subconsciously, often without much thought or effort."
    },
    {
      question: "How often do you reflect on your current habits and their impact on your life?",
      options: [
        { text: "Never", isCorrect: false },
        { text: "Rarely", isCorrect: false },
        { text: "Sometimes", isCorrect: false },
        { text: "Often", isCorrect: false },
        { text: "Very Often", isCorrect: true }
      ],
      suggestion: "Regularly reflecting on your habits helps you identify areas for improvement and track your progress."
    },
    {
      question: "When trying to form a new habit, do you set clear and achievable goals?",
      options: [
        { text: "No, I don't set goals.", isCorrect: false },
        { text: "My goals are vague.", isCorrect: false },
        { text: "My goals are challenging but achievable.", isCorrect: true },
        { text: "My goals are very ambitious.", isCorrect: false }
      ],
      suggestion: "Setting clear and achievable goals increases your chances of success when forming new habits."
    },
    {
      question: "Do you have a plan to overcome potential obstacles that might prevent you from sticking to your new habit?",
      options: [
        { text: "No, I don't plan for obstacles.", isCorrect: false },
        { text: "I might improvise if obstacles arise.", isCorrect: false },
        { text: "I have a general idea of how to handle obstacles.", isCorrect: false },
        { text: "I have a specific plan to overcome potential obstacles.", isCorrect: true }
      ],
      suggestion: "Anticipating and having a plan for overcoming obstacles is crucial for habit formation."
    },
    {
      question: "Do you reward yourself for achieving your habit goals?",
      options: [
        { text: "No, I don't reward myself.", isCorrect: false },
        { text: "Rarely", isCorrect: false },
        { text: "Sometimes", isCorrect: false },
        { text: "Often", isCorrect: true }
      ],
      suggestion: "Rewarding yourself helps reinforce positive behavior and motivates you to continue building the habit."
    },
    {
      question: "Do you track your progress towards your habit goals?",
      options: [
        { text: "No, I don't track progress.", isCorrect: false },
        { text: "I have a vague idea of my progress.", isCorrect: false },
        { text: "I track my progress informally (e.g., mentally).", isCorrect: false },
        { text: "I use a specific method to track my progress (e.g., habit tracker app).", isCorrect: true }
      ],
      suggestion: "Tracking your progress allows you to visualize improvement and stay motivated."
    },
    {
      question: "Do you find yourself relying on external cues to trigger your desired habits?",
      options: [
        { text: "No, I don't use external cues.", isCorrect: false },
        { text: "Rarely", isCorrect: false },
        { text: "Sometimes", isCorrect: true },
        { text: "Often", isCorrect: true }
      ],
      suggestion: "Utilizing external cues (e.g., alarms, reminders) can be helpful for initiating new habits."
    },
];
export default habitQuizQuestions;
  