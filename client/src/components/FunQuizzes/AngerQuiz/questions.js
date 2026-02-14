const questions = [
    {
      question: "When faced with a challenging situation, how do you typically react?",
      options: [
        { text: "Get angry and lash out", isCorrect: false },
        { text: "Try to remain calm and find a solution", isCorrect: true },
        { text: "Avoid the situation altogether", isCorrect: false },
        { text: "Seek help from others", isCorrect: false }
      ],
      suggestion: "When faced with challenging situations, it's important to try to remain calm and approach the problem with a clear mind. Take deep breaths, count to ten, or remove yourself from the situation temporarily to cool down before addressing it."
    },
    {
      question: "How often do you experience physical symptoms of anger (e.g., racing heart, clenched fists, sweating)?",
      options: [
        { text: "Frequently", isCorrect: false },
        { text: "Occasionally", isCorrect: false },
        { text: "Rarely", isCorrect: false },
        { text: "Never", isCorrect: true }
      ],
      suggestion: "Frequent physical symptoms of anger can indicate that your body is under significant stress. Consider incorporating relaxation techniques such as deep breathing exercises, meditation, or progressive muscle relaxation into your daily routine to help manage these symptoms."
    },
    {
      question: "Do you often regret things you say or do when you're angry?",
      options: [
        { text: "Yes, frequently", isCorrect: true },
        { text: "Sometimes", isCorrect: false },
        { text: "Rarely", isCorrect: false },
        { text: "No, never", isCorrect: false }
      ],
      suggestion: "Feeling regret after expressing anger is common, but it's important to learn from these experiences. Take a moment to reflect on your actions and consider how you can respond more constructively in similar situations in the future. Practice empathy and active listening to improve communication and reduce conflicts."
    },
    {
      question: "How do you typically handle conflicts with others?",
      options: [
        { text: "Engage in verbal arguments or fights", isCorrect: false },
        { text: "Avoid confrontation", isCorrect: false },
        { text: "Seek compromise and resolution", isCorrect: true },
        { text: "Depend on others to resolve conflicts", isCorrect: false }
      ],
      suggestion: "Conflict is a natural part of relationships, but it's important to address disagreements in a healthy and constructive manner. Practice active listening, assertiveness, and problem-solving skills to navigate conflicts effectively. Remember that finding common ground and seeking compromise can lead to mutually beneficial solutions."
    },
    {
      question: "How do you cope with stress in your daily life?",
      options: [
        { text: "Bottle up emotions and ignore stressors", isCorrect: false },
        { text: "Engage in physical activity or hobbies", isCorrect: true },
        { text: "Seek social support from friends or family", isCorrect: true },
        { text: "Practice relaxation techniques", isCorrect: true }
      ],
      suggestion: "Engaging in physical activity or hobbies can be an effective way to manage stress and reduce feelings of anger. Find activities that you enjoy and make time for them regularly. Additionally, consider incorporating relaxation techniques such as deep breathing, meditation, or mindfulness exercises to promote emotional well-being."
    },
    {
      question: "How do you express your feelings when you're upset?",
      options: [
        { text: "Express anger openly and aggressively", isCorrect: false },
        { text: "Suppress emotions and avoid confrontation", isCorrect: false },
        { text: "Communicate assertively and respectfully", isCorrect: true },
        { text: "Depend on others to understand your feelings", isCorrect: false }
      ],
      suggestion: "Expressing your feelings assertively and respectfully can lead to more productive communication and healthier relationships. Practice active listening, use 'I' statements to express your emotions, and be open to feedback from others. Remember that effective communication involves both expressing yourself and empathetically listening to others."
    },
    {
      question: "How do you handle unexpected changes or disruptions to your plans?",
      options: [
        { text: "Get angry and frustrated", isCorrect: false },
        { text: "Adapt and find alternative solutions", isCorrect: true },
        { text: "Ignore the changes and continue as planned", isCorrect: false },
        { text: "Blame others for the disruptions", isCorrect: false }
      ],
      suggestion: "Flexibility is key when dealing with unexpected changes or disruptions. Instead of getting angry or frustrated, focus on adapting to the new situation and finding alternative solutions. Practice resilience and problem-solving skills to overcome challenges effectively. Remember that setbacks can provide opportunities for growth and learning."
    },
    {
      question: "Do you feel like your anger is negatively impacting your relationships or daily life?",
      options: [
        { text: "Yes, it's causing significant problems", isCorrect: false },
        { text: "Sometimes, but not always", isCorrect: false },
        { text: "Rarely, if ever", isCorrect: true },
        { text: "No, not at all", isCorrect: true }
      ],
      suggestion: "If you feel like your anger is negatively impacting your relationships or daily life, it may be beneficial to seek support from a therapist or counselor. Counseling can provide you with tools and strategies to manage your anger more effectively and improve your overall well-being. Remember that asking for help is a sign of strength, not weakness."
    }
  ];
  
  export default questions;
  