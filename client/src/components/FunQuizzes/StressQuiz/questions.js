const stressQuizQuestions = [
    {
      question: "When was the last time you took a break to relax and recharge?",
      options: [
        { text: "Today", isCorrect: true },
        { text: "Within the past week", isCorrect: false },
        { text: "Within the past month", isCorrect: false },
        { text: "It's been a while", isCorrect: false }
      ],
      suggestion: "Taking regular breaks to relax and recharge is essential for managing stress. Consider scheduling short breaks throughout your day to engage in activities you enjoy, such as going for a walk, practicing mindfulness, or listening to calming music."
    },
    {
      question: "How do you typically cope with stress?",
      options: [
        { text: "Engage in physical activity or exercise", isCorrect: true },
        { text: "Talk to a friend or loved one", isCorrect: true },
        { text: "Practice deep breathing or meditation techniques", isCorrect: true },
        { text: "Ignore it and hope it goes away", isCorrect: false }
      ],
      suggestion: "Finding healthy coping mechanisms can help reduce stress and improve overall well-being. Consider incorporating activities like exercise, socializing, and relaxation techniques into your daily routine to manage stress effectively."
    },
    {
      question: "Do you often feel guilty for taking time for yourself?",
      options: [
        { text: "Yes, frequently", isCorrect: true },
        { text: "Sometimes", isCorrect: false },
        { text: "Rarely", isCorrect: false },
        { text: "No, never", isCorrect: false }
      ],
      suggestion: "It's common to feel guilty for prioritizing self-care, but taking time for yourself is essential for maintaining balance and well-being. Remind yourself that self-care is not selfish and is necessary for overall health and happiness."
    },
    {
      question: "How do you feel about asking for help when you're feeling stressed?",
      options: [
        { text: "Comfortable, I know when to ask for help", isCorrect: true },
        { text: "Sometimes hesitant, but I'm working on it", isCorrect: true },
        { text: "Uncomfortable, I prefer to handle things on my own", isCorrect: false },
        { text: "I never ask for help, it's a sign of weakness", isCorrect: false }
      ],
      suggestion: "Asking for help when you're feeling stressed is a sign of strength, not weakness. Reach out to friends, family, or a professional for support when needed. Remember, you don't have to face challenges alone."
    },
    // Add more questions here
    {
    question: "How do you feel about your current workload and responsibilities?",
    options: [
      { text: "Overwhelmed", isCorrect: false },
      { text: "Manageable", isCorrect: true },
      { text: "Underwhelmed", isCorrect: false },
      { text: "Balanced", isCorrect: true }
    ],
    suggestion: "Feeling overwhelmed by your workload and responsibilities is common, but it's important to find ways to manage stress effectively. Consider prioritizing tasks, setting boundaries, and seeking support when needed."
  },
  {
    question: "Do you often feel pressured to meet others' expectations?",
    options: [
      { text: "Yes, frequently", isCorrect: false },
      { text: "Sometimes", isCorrect: false },
      { text: "Rarely", isCorrect: true },
      { text: "No, never", isCorrect: true}
    ],
    suggestion: "Feeling pressured to meet others' expectations can contribute to stress and anxiety. Remember that it's okay to prioritize your own well-being and set boundaries with others. Focus on what's important to you and communicate your needs openly."
  },
  {
    question: "How do you unwind and relax after a long day?",
    options: [
      { text: "Engage in a hobby or creative activity", isCorrect: true },
      { text: "Watch TV or movies", isCorrect: true },
      { text: "Spend time with loved ones", isCorrect: true },
      { text: "Keep working or checking emails", isCorrect: false }
    ],
    suggestion: "Taking time to unwind and relax is essential for managing stress and promoting well-being. Find activities that help you relax and recharge, whether it's spending time with loved ones, pursuing hobbies, or practicing relaxation techniques."
  },
  {
    question: "How do you feel about your ability to handle stressful situations?",
    options: [
      { text: "Confident, I can handle stress well", isCorrect: true },
      { text: "Sometimes unsure, but I'm learning to cope better", isCorrect: true },
      { text: "Struggle, stress often feels overwhelming", isCorrect: false },
      { text: "I avoid stressful situations altogether", isCorrect: false }
    ],
    suggestion: "Building resilience and coping skills can help you better manage stressful situations. Practice self-care, seek support when needed, and focus on developing healthy coping mechanisms to navigate stress more effectively."
  },
  ];
  
  export default stressQuizQuestions;
  