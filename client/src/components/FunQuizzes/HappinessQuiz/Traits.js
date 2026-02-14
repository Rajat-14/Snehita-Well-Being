const calculateHappinessTrait = (score, totalQuestions) => {
    let traitText = '';
    if (score >= Math.ceil(totalQuestions * 0.8)) {
      traitText = (
        <div>
          <p>Congratulations! You're doing great in prioritizing your happiness and well-being.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Continue engaging in activities that bring you joy and fulfillment.</li>
            <li>Nurture meaningful relationships and connections with loved ones.</li>
            <li>Practice gratitude and mindfulness to enhance your overall happiness.</li>
            <li>Explore new hobbies or interests that contribute to your well-being.</li>
            <li>Some Resources which can help:-
              <ul>
                <li><a href="https://www.bjclearn.org/resiliency/PDFs/001102.pdf">Simple actions that bring joy</a></li>
                <li><a href="https://www.inc.com/lolly-daskal/8-simple-ways-to-boost-your-most-important-relationships.html">Simple Ways to boost your important relationships.</a></li>
              </ul>
            </li>
          </ul>
        </div>
      );
    } else if (score >= Math.ceil(totalQuestions * 0.6)) {
      traitText = (
        <div>
          <p>You're making efforts to improve your happiness, but there's still room for growth.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Identify activities or areas of your life that bring you joy and prioritize them.</li>
            <li>Practice self-compassion and forgiveness to overcome obstacles and setbacks.</li>
            <li>Seek support from friends, family, or professionals to navigate challenges and enhance your well-being.</li>
            <li>Some Resources which can help:-
              <ul>
              <li><a href="https://www.bjclearn.org/resiliency/PDFs/001102.pdf">Simple actions that bring joy</a></li>
                <li><a href="https://www.inc.com/lolly-daskal/8-simple-ways-to-boost-your-most-important-relationships.html">Simple Ways to boost your important relationships.</a></li>
              
                <li><a href="https://www.goodrx.com/health-topic/mental-health/self-care-ideas-activities">Self care ideas</a></li>
                <li><a href="https://positivepsychology.com/self-compassion-exercises-worksheets/">8 Powerful Self-Compassion Exercises & Worksheets </a></li>
              </ul>
            </li>
          </ul>
        </div>
      );
    } else {
      traitText = (
        <div>
          <p>Your happiness may be impacted by various factors, and it's essential to address them for overall well-being.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Take time to reflect on activities or relationships that may be contributing to your happiness or causing distress.</li>
            <li>Practice self-care and prioritize activities that bring you joy, even in small doses.</li>
            <li>Consider seeking professional help or counseling if you're experiencing persistent feelings of unhappiness or dissatisfaction.</li>
            <li>Here are some resources which can help:-
              <ul>
              <li><a href="https://www.inc.com/lolly-daskal/8-simple-ways-to-boost-your-most-important-relationships.html">Simple Ways to boost your important relationships.</a></li>
              
              <li><a href="https://www.goodrx.com/health-topic/mental-health/self-care-ideas-activities">Self care ideas</a></li>
              <li><a href="https://positivepsychology.com/self-compassion-exercises-worksheets/">8 Powerful Self-Compassion Exercises & Worksheets </a></li>
            
                </ul>
            </li>
          </ul>
        </div>
      );
    }
    return traitText;
  };
  
  // This function simulates opening a link in a new tab/window (replace with actual implementation)
  const openLink = (searchTerm) => {
    window.open(`https://www.google.com/search?q=${searchTerm}`); // Simulate opening link in new tab
  }
  
  export default calculateHappinessTrait;
  