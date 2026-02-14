const bodyImageQuizQuestions = [
    {
      question: "How do you feel about your physical appearance?",
      options: [
        { text: "I am comfortable and accepting of my physical appearance, recognizing that beauty comes in many forms", isCorrect: true },
        { text: "I often feel dissatisfied with my physical appearance and focus on perceived flaws", isCorrect: false },
        { text: "I feel neutral about my physical appearance, neither overly positive nor negative", isCorrect: true },
        { text: "I constantly compare myself to others and feel inadequate as a result", isCorrect: false }
      ],
      suggestion: "Remember that everyone has unique features that make them beautiful. Focus on embracing your individuality rather than comparing yourself to others."
    },
    {
      question: "How do you perceive societal standards of beauty?",
      options: [
        { text: "I recognize that societal standards of beauty are unrealistic and strive to challenge these ideals", isCorrect: true },
        { text: "I often feel pressured to conform to societal beauty standards and struggle with feelings of inadequacy", isCorrect: false },
        { text: "I don't pay much attention to societal beauty standards, focusing instead on my own definition of beauty", isCorrect: true },
        { text: "I feel overwhelmed by societal beauty standards and constantly seek validation from others", isCorrect: false }
      ],
      suggestion: "It's important to recognize that societal beauty standards are often unattainable and unrealistic. Focus on embracing your unique beauty and challenging narrow beauty ideals."
    },
    {
      question: "How do you feel about your body's capabilities and functionality?",
      options: [
        { text: "I appreciate my body for its strength and functionality, focusing on what it can do rather than how it looks", isCorrect: true },
        { text: "I often criticize my body for its perceived limitations and shortcomings", isCorrect: false },
        { text: "I feel indifferent towards my body's capabilities, taking them for granted", isCorrect: false },
        { text: "I strive to improve my body's capabilities through healthy habits and self-care", isCorrect: true }
      ],
      suggestion: "Shift your focus from appearance to functionality by appreciating your body for its abilities and taking steps to support its health and well-being."
    },
    {
      question: "How do you react to comments or criticisms about your appearance?",
      options: [
        { text: "I take comments about my appearance with a grain of salt, recognizing that beauty is subjective", isCorrect: true },
        { text: "I feel deeply affected by criticisms about my appearance and may engage in negative self-talk as a result", isCorrect: false },
        { text: "I brush off comments about my appearance, believing that they don't impact my self-esteem", isCorrect: false },
        { text: "I often seek validation from others and feel hurt by negative comments about my appearance", isCorrect: false }
      ],
      suggestion: "Remember that other people's opinions about your appearance don't define your worth. Focus on cultivating self-confidence and self-acceptance independent of external validation."
    },
    
    {
      question: "How do you feel about seeking support for body image concerns?",
      options: [
        { text: "I am open to seeking support from friends, family, or professionals if I'm struggling with body image issues", isCorrect: true },
        { text: "I feel ashamed or embarrassed to talk about my body image concerns and prefer to keep them to myself", isCorrect: false },
        { text: "I don't see the need to seek support for body image concerns, believing that I should be able to handle them on my own", isCorrect: false },
        { text: "I fear being judged or misunderstood if I were to seek support for body image concerns", isCorrect: false }
      ],
      suggestion: "It's important to remember that seeking support is a sign of strength, not weakness. Reach out to trusted individuals or professionals if you're struggling with body image issues."
    },
    // Add more questions here
    {
        question: "How do you feel about the influence of peer or family attitudes on your body image?",
        options: [
          { text: "I surround myself with supportive individuals who celebrate body diversity and promote self-acceptance", isCorrect: true },
          { text: "I feel pressured to conform to the body ideals upheld by peers or family members, even if it conflicts with my own values or preferences", isCorrect: false },
          { text: "I don't feel influenced by peer or family attitudes on body image, confident in my own sense of self-worth", isCorrect: true },
          { text: "I struggle with negative comments or comparisons from peers or family members, which impact my body image and self-esteem", isCorrect: false }
        ],
        suggestion: "Surround yourself with supportive individuals who celebrate and accept you for who you are, regardless of your appearance. Set boundaries with negative influences and prioritize your well-being."
      },
      {
        question: "How do you feel about media portrayals of beauty and body image?",
        options: [
          { text: "I recognize that media portrayals often perpetuate unrealistic beauty standards and strive to consume media mindfully", isCorrect: true },
          { text: "I feel pressured to conform to media-defined beauty ideals and may experience negative emotions as a result", isCorrect: false },
          { text: "I don't pay much attention to media portrayals of beauty and body image, focusing instead on other aspects of my life", isCorrect: true },
          { text: "I actively seek validation from media representations of beauty and feel inadequate if I don't measure up", isCorrect: false }
        ],
        suggestion: "Be mindful of the media you consume and its impact on your perceptions of beauty. Remember that media portrayals often don't reflect reality, and beauty comes in diverse forms."
      },
      {
        question: "How do you feel about the impact of body image on your overall self-esteem?",
        options: [
          { text: "I recognize that body image is just one aspect of my identity and prioritize other factors in building my self-esteem", isCorrect: true },
          { text: "I often equate my self-worth with my appearance and may experience fluctuations in self-esteem based on how I perceive my body", isCorrect: false },
          { text: "I feel confident in myself regardless of my body image, recognizing that true self-esteem comes from within", isCorrect: true },
          { text: "I struggle with low self-esteem and attribute much of it to dissatisfaction with my body image", isCorrect: false }
        ],
        suggestion: "Remember that your worth extends far beyond your physical appearance. Focus on cultivating self-esteem based on your values, strengths, and accomplishments."
      }
  ];
  
  export default bodyImageQuizQuestions;
  