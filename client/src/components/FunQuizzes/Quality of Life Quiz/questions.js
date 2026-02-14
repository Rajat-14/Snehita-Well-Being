const qualityOfLifeQuizQuestions = [
    {
      question: "How do you feel about your level of physical health?",
      options: [
        { text: "I prioritize physical activity, nutrition, and regular check-ups to maintain my health", isCorrect: true },
        { text: "I neglect my physical health and often engage in unhealthy habits", isCorrect: false },
        { text: "I'm content with my physical health and don't feel the need to make any changes", isCorrect: true },
        { text: "I struggle with health issues and find it challenging to prioritize my well-being", isCorrect: false }
      ],
      suggestion: "Taking care of your physical health is essential for overall well-being. Make sure to prioritize exercise, healthy eating, and regular health check-ups."
    },
    {
      question: "How do you feel about your level of mental and emotional well-being?",
      options: [
        { text: "I prioritize activities that promote mental and emotional well-being, such as mindfulness and self-reflection", isCorrect: true },
        { text: "I often feel overwhelmed by stress and struggle to cope with my emotions", isCorrect: false },
        { text: "I rarely pay attention to my mental and emotional health, assuming everything will work out on its own", isCorrect: false },
        { text: "I'm generally happy and emotionally stable, but I could use some improvement in managing stress", isCorrect: true }
      ],
      suggestion: "Prioritizing your mental and emotional well-being is crucial for overall happiness and resilience. Practice self-care, seek support when needed, and cultivate healthy coping strategies."
    },
    {
      question: "How do you feel about your level of financial stability?",
      options: [
        { text: "I manage my finances responsibly and feel secure about my financial future", isCorrect: true },
        { text: "I often struggle to make ends meet and worry about financial stability", isCorrect: false },
        { text: "I don't pay much attention to my finances and live paycheck to paycheck", isCorrect: false },
        { text: "I'm financially comfortable but could use some improvement in budgeting and saving", isCorrect: true }
      ],
      suggestion: "Achieving financial stability requires careful planning and budgeting. Consider seeking financial advice and creating a budget to help you reach your financial goals."
    },
    {
      question: "How do you feel about your sense of purpose and fulfillment in life?",
      options: [
        { text: "I have a clear sense of purpose and feel fulfilled by my work, relationships, and personal growth", isCorrect: true },
        { text: "I often feel lost or unfulfilled, unsure of what I want to achieve in life", isCorrect: false },
        { text: "I find fulfillment in certain areas of my life, but I struggle to maintain a sense of purpose overall", isCorrect: true },
        { text: "I don't think about my sense of purpose or fulfillment, focusing instead on day-to-day tasks", isCorrect: false }
      ],
      suggestion: "Having a sense of purpose and fulfillment in life contributes to overall happiness and well-being. Reflect on your values and passions to identify meaningful goals and pursuits."
    },
    {
      question: "How do you feel about your level of social connectedness and community involvement?",
      options: [
        { text: "I actively participate in social activities and contribute to my community, feeling connected to others", isCorrect: true },
        { text: "I often feel isolated and disconnected from others, lacking a sense of belonging", isCorrect: false },
        { text: "I have a few close relationships but don't engage much in community activities", isCorrect: true },
        { text: "I prioritize my social life over other aspects of my life, sometimes neglecting responsibilities", isCorrect: false }
      ],
      suggestion: "Building meaningful connections and contributing to your community can enhance your sense of belonging and well-being. Consider volunteering or joining social groups to foster connections."
    },
    {
        question: "How do you feel about your work-life harmony?",
        options: [
          { text: "I have a healthy balance between my professional and personal life, allowing time for both work and leisure activities", isCorrect: true },
          { text: "I often feel overwhelmed by work demands, struggling to find time for personal interests and relaxation", isCorrect: false },
          { text: "I prioritize my personal life over work, sometimes neglecting my professional responsibilities", isCorrect: false },
          { text: "I focus solely on work and neglect my personal life, leading to feelings of burnout and dissatisfaction", isCorrect: false }
        ],
        suggestion: "Achieving harmony between work and personal life is essential for overall well-being. Set boundaries, prioritize self-care, and allocate time for activities outside of work."
      },
      {
        question: "How do you feel about your level of creativity and self-expression?",
        options: [
          { text: "I regularly engage in creative pursuits and express myself through various forms of art, finding fulfillment in self-expression", isCorrect: true },
          { text: "I rarely make time for creative activities and feel stifled in expressing myself authentically", isCorrect: false },
          { text: "I enjoy creative endeavors but struggle to find inspiration or motivation to pursue them consistently", isCorrect: true },
          { text: "I don't prioritize creativity or self-expression in my life, focusing instead on practical tasks and responsibilities", isCorrect: false }
        ],
        suggestion: "Nurturing your creativity and self-expression can enhance your overall well-being and satisfaction with life. Make time for creative pursuits and explore new ways to express yourself."
      },
      {
        question: "How do you feel about your sense of gratitude and appreciation?",
        options: [
          { text: "I regularly practice gratitude and appreciate the blessings in my life, fostering a positive outlook and sense of contentment", isCorrect: true },
          { text: "I often dwell on negative aspects of life and struggle to find things to be grateful for, leading to feelings of discontentment", isCorrect: false },
          { text: "I acknowledge the importance of gratitude but find it challenging to cultivate a grateful mindset consistently", isCorrect: true },
          { text: "I rarely think about gratitude and take the good things in my life for granted, focusing instead on what I lack", isCorrect: false }
        ],
        suggestion: "Cultivating gratitude can enhance your overall well-being and outlook on life. Take time each day to reflect on what you're thankful for and appreciate the positive aspects of your life."
      },

    // Add more questions here
  ];
  
  export default qualityOfLifeQuizQuestions;
