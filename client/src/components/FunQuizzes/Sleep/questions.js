const sleepAwarenessQuizQuestions = [
    {
      question: "How would you describe your current sleep schedule?",
      options: [
        { text: "I maintain a consistent sleep schedule, going to bed and waking up at the same time every day", isCorrect: true },
        { text: "I often stay up late and have irregular sleep patterns, leading to inconsistent sleep quality", isCorrect: false },
        { text: "I prioritize getting enough sleep but sometimes struggle to maintain a regular sleep schedule", isCorrect: true },
        { text: "I frequently experience sleep disturbances and find it challenging to establish a healthy sleep routine", isCorrect: false }
      ],
      suggestion: "Maintaining a consistent sleep schedule is important for quality sleep. Try to establish a regular bedtime and wake-up time to improve your sleep quality."
    },
    {
      question: "How do you feel about the quality of your sleep?",
      options: [
        { text: "I usually wake up feeling refreshed and well-rested, experiencing high-quality sleep most nights", isCorrect: true },
        { text: "I often struggle with sleep disturbances, such as difficulty falling asleep or waking up frequently during the night", isCorrect: false },
        { text: "I generally get enough sleep but sometimes wake up feeling tired or unrested", isCorrect: true },
        { text: "I consistently have poor-quality sleep, feeling exhausted and fatigued throughout the day", isCorrect: false }
      ],
      suggestion: "Prioritizing good sleep hygiene can improve the quality of your sleep. Create a relaxing bedtime routine and ensure your sleep environment is conducive to rest."
    },
    {
      question: "How do you feel about your level of daytime alertness and energy?",
      options: [
        { text: "I usually feel alert and energized throughout the day, with consistent levels of energy", isCorrect: true },
        { text: "I often experience daytime sleepiness and struggle to stay awake and focused", isCorrect: false },
        { text: "I have periods of alertness and energy followed by fatigue and low energy levels", isCorrect: true },
        { text: "I consistently feel lethargic and lack energy during the day, regardless of how much sleep I get", isCorrect: false }
      ],
      suggestion: "Improving your sleep quality can enhance your daytime alertness and energy levels. Consider lifestyle changes and relaxation techniques to promote better sleep."
    },
    {
      question: "How do you feel about your bedtime habits and sleep environment?",
      options: [
        { text: "I have established bedtime rituals and maintain a comfortable sleep environment conducive to rest", isCorrect: true },
        { text: "I engage in stimulating activities before bedtime and have a sleep environment that is not conducive to restful sleep", isCorrect: false },
        { text: "I try to create a relaxing bedtime routine but sometimes struggle with distractions or discomfort in my sleep environment", isCorrect: true },
        { text: "I often go to bed stressed or anxious, which affects my ability to fall asleep and stay asleep", isCorrect: false }
      ],
      suggestion: "Creating a sleep-friendly environment and practicing relaxation techniques before bed can improve your sleep quality. Minimize screen time and create a calming bedtime routine."
    },
    {
        question: "How do you feel about the use of electronic devices before bedtime?",
        options: [
          { text: "I avoid using electronic devices before bedtime to minimize exposure to blue light and promote better sleep", isCorrect: true },
          { text: "I frequently use electronic devices before bed, which may disrupt my sleep patterns and affect my ability to fall asleep", isCorrect: false },
          { text: "I sometimes use electronic devices before bed but try to limit screen time to reduce the impact on my sleep", isCorrect: true },
          { text: "I use electronic devices extensively before bed and do not notice any negative effects on my sleep quality", isCorrect: false }
        ],
        suggestion: "Limiting screen time before bed can help improve sleep quality. Try to avoid using electronic devices at least an hour before bedtime to promote better sleep."
      },
      {
        question: "How do you feel about your caffeine intake, especially in the afternoon and evening?",
        options: [
          { text: "I limit my caffeine intake, especially in the afternoon and evening, to avoid interference with my sleep patterns", isCorrect: true },
          { text: "I consume caffeine regularly throughout the day, including in the afternoon and evening, which may impact my ability to fall asleep", isCorrect: false },
          { text: "I occasionally consume caffeine in the afternoon or evening but try to avoid it close to bedtime to minimize its effects on my sleep", isCorrect: true },
          { text: "I consume caffeine freely throughout the day and do not notice any significant impact on my sleep quality", isCorrect: false }
        ],
        suggestion: "Reducing caffeine intake, especially in the afternoon and evening, can help improve sleep quality. Consider switching to decaffeinated beverages or limiting caffeine consumption after midday."
      },
      {
        question: "How do you feel about your stress levels and their impact on your ability to fall asleep?",
        options: [
          { text: "I manage stress effectively and have strategies in place to relax before bedtime, which helps me fall asleep easily", isCorrect: true },
          { text: "I often feel stressed or anxious before bed, which interferes with my ability to fall asleep quickly", isCorrect: false },
          { text: "I experience occasional stress before bed but have coping mechanisms to help me relax and unwind before sleep", isCorrect: true },
          { text: "I rarely experience stress and do not believe it affects my ability to fall asleep", isCorrect: false }
        ],
        suggestion: "Managing stress before bedtime is essential for promoting better sleep. Practice relaxation techniques such as deep breathing, meditation, or gentle stretching to reduce stress and prepare for sleep."
      },
      {
        question: "How do you feel about your consumption of heavy meals or snacks close to bedtime?",
        options: [
          { text: "Avoid heavy meals/snacks before bed", isCorrect: true },
          { text: "Often indulge in heavy meals/snacks before bed", isCorrect: false },
          { text: "Occasionally have heavy meals/snacks before bed, but with a few hours gap", isCorrect: true },
          { text: "Don't pay attention to food intake before bed", isCorrect: false }
        ],
        suggestion: "Avoiding heavy meals or snacks close to bedtime can prevent discomfort and promote better sleep quality. Opt for lighter, easily digestible snacks if you need a bedtime snack."
      },
    // Add more questions here
  ];
  
  export default sleepAwarenessQuizQuestions;
  