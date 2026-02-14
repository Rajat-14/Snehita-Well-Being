const socialRelationshipQuizQuestions = [
    {
      question: "How do you feel about the quality of your romantic relationships?",
      options: [
        { text: "I communicate openly and honestly with my partner, and we support each other's growth and happiness", isCorrect: true },
        { text: "I often feel misunderstood or unfulfilled in my romantic relationships, and communication is a challenge", isCorrect: false },
        { text: "I'm currently not in a romantic relationship, but I feel content and open to the possibility of finding love", isCorrect: true },
        { text: "I struggle with trust issues or conflicts in my romantic relationships, leading to feelings of insecurity", isCorrect: false }
      ],
      suggestion: "Healthy romantic relationships thrive on open communication, trust, and mutual support. Take time to reflect on your needs and communicate them effectively with your partner."
    },
    {
      question: "How do you feel about the balance between your personal time and time spent with friends?",
      options: [
        { text: "I prioritize quality time with friends while also maintaining boundaries for personal space and self-care", isCorrect: true },
        { text: "I often feel overwhelmed by social obligations and struggle to find time for myself and my own interests", isCorrect: false },
        { text: "I tend to prioritize personal time over socializing with friends, sometimes feeling disconnected from my social circle", isCorrect: false },
        { text: "I feel a strong sense of belonging and fulfillment when spending time with friends, but I also value solitude for self-reflection", isCorrect: true }
      ],
      suggestion: "Finding a balance between socializing with friends and enjoying personal time is essential for overall well-being. Set boundaries, communicate your needs, and make time for both social activities and self-care."
    },
    {
      question: "How do you feel about the level of trust and mutual support in your friendships?",
      options: [
        { text: "I have strong, trusting friendships where we support each other through both good times and challenges", isCorrect: true },
        { text: "I often struggle with trust issues or feel unsupported by my friends, leading to feelings of loneliness or isolation", isCorrect: false },
        { text: "I have a few close friends whom I trust deeply, but I sometimes feel disconnected from larger social circles", isCorrect: true },
        { text: "I prioritize quantity over quality in friendships, leading to superficial connections and a lack of deeper trust", isCorrect: false }
      ],
      suggestion: "Nurturing trusting, supportive friendships enriches your life and provides a strong support system. Invest time and effort in cultivating meaningful connections based on mutual respect and understanding."
    },
    {
      question: "How do you feel about the boundaries you've set in your relationships?",
      options: [
        { text: "I communicate my boundaries clearly and assertively, and I respect the boundaries of others in my relationships", isCorrect: true },
        { text: "I struggle to set boundaries in my relationships, often feeling overwhelmed or taken advantage of by others", isCorrect: false },
        { text: "I tend to have rigid boundaries that make it challenging for me to connect deeply with others or be vulnerable", isCorrect: false },
        { text: "I'm still learning to establish healthy boundaries in my relationships, but I recognize their importance for mutual respect and well-being", isCorrect: true }
      ],
      suggestion: "Setting and respecting boundaries is crucial for healthy, fulfilling relationships. Practice assertiveness and communicate your needs clearly, while also respecting the boundaries of others."
    },
    {
      question: "How do you feel about the overall satisfaction and fulfillment you derive from your social relationships?",
      options: [
        { text: "I feel deeply satisfied and fulfilled by the quality of my social relationships, which bring joy and meaning to my life", isCorrect: true },
        { text: "I often feel lonely or disconnected from others, despite having social connections, and yearn for deeper, more meaningful relationships", isCorrect: false },
        { text: "I'm generally content with my social life, but I sometimes feel like I'm missing out on deeper connections or meaningful experiences", isCorrect: true },
        { text: "I prioritize quantity over quality in my social relationships, seeking validation or acceptance from others rather than genuine connection", isCorrect: false }
      ],
      suggestion: "Seeking meaningful connections and fostering fulfilling relationships enriches your life and contributes to overall well-being. Invest time and effort in nurturing deep, authentic connections with others."
    },
    // Add more questions here
    {
        question: "How do you feel about your ability to resolve conflicts in your relationships?",
        options: [
          { text: "I approach conflicts with empathy and seek mutually beneficial solutions through open communication and compromise", isCorrect: true },
          { text: "I often avoid or escalate conflicts in my relationships, leading to unresolved issues and tension", isCorrect: false },
          { text: "I tend to dominate or manipulate conflicts to get my way, rather than seeking understanding or resolution", isCorrect: false },
          { text: "I'm still learning how to navigate conflicts constructively, but I'm open to improving my conflict resolution skills", isCorrect: true }
        ],
        suggestion: "Effective conflict resolution is essential for maintaining healthy relationships. Practice active listening, empathy, and assertive communication to address conflicts constructively."
      },
      {
        question: "How do you feel about the level of communication in your friendships and romantic relationships?",
        options: [
          { text: "I prioritize open, honest communication in all my relationships, fostering trust, understanding, and connection", isCorrect: true },
          { text: "I often struggle to express my thoughts and feelings in relationships, leading to misunderstandings or conflicts", isCorrect: false },
          { text: "I tend to avoid difficult conversations or withhold my true thoughts and emotions, fearing rejection or conflict", isCorrect: false },
          { text: "I'm working on improving my communication skills to express myself more effectively and build stronger connections with others", isCorrect: true }
        ],
        suggestion: "Effective communication is the foundation of healthy relationships. Practice active listening, empathy, and expressing yourself honestly and respectfully to strengthen your connections with others."
      },
      {
        question: "How do you feel about your ability to set and respect boundaries in your romantic relationships?",
        options: [
          { text: "I establish clear boundaries in my romantic relationships and respect the boundaries set by my partner, promoting mutual respect and trust", isCorrect: true },
          { text: "I struggle to set boundaries in my romantic relationships, often sacrificing my own needs or values to please my partner", isCorrect: false },
          { text: "I tend to disregard boundaries in my romantic relationships, believing that love means sacrificing individual autonomy", isCorrect: false },
          { text: "I'm learning to set healthy boundaries in my romantic relationships, recognizing the importance of self-care and mutual respect", isCorrect: true }
        ],
        suggestion: "Setting and respecting boundaries is crucial for maintaining healthy, fulfilling romantic relationships. Prioritize self-awareness, assertiveness, and mutual respect in defining and honoring boundaries."
      },
      {
        question: "How do you feel about the balance between giving and receiving support in your friendships?",
        options: [
          { text: "I strive for a balanced exchange of support in my friendships, offering help and empathy when needed and accepting support graciously", isCorrect: true },
          { text: "I often find myself giving more support than I receive in my friendships, leading to feelings of resentment or imbalance", isCorrect: false },
          { text: "I tend to rely heavily on others for support in my friendships, sometimes neglecting to reciprocate or express gratitude", isCorrect: false },
          { text: "I'm working on establishing healthier dynamics in my friendships by cultivating mutual support and reciprocity", isCorrect: true }
        ],
        suggestion: "Healthy friendships thrive on mutual support and reciprocity. Practice giving and receiving support with empathy, gratitude, and willingness to reciprocate, fostering stronger bonds with your friends."
      },
      {
        question: "How do you feel about the influence of your social relationships on your overall well-being?",
        options: [
          { text: "I recognize the significant impact of my social relationships on my happiness and well-being, and I prioritize nurturing supportive connections", isCorrect: true },
          { text: "I often feel drained or stressed by my social relationships, and I struggle to find fulfillment or joy in my interactions with others", isCorrect: false },
          { text: "I tend to prioritize individual pursuits over social relationships, believing that self-sufficiency is more important for well-being", isCorrect: false },
          { text: "I'm working on improving the quality of my social relationships to enhance my overall well-being and sense of belonging", isCorrect: true }
        ],
        suggestion: "Cultivating healthy, supportive social relationships is essential for overall well-being and happiness. Reflect on the quality of your connections and invest time and effort in nurturing meaningful relationships."
      },
  ];
  
  export default socialRelationshipQuizQuestions;
  