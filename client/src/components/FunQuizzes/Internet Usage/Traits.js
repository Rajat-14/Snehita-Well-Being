const calculateInternetUsageTrait = (score, totalQuestions) => {
    let traitText = '';
    if (score >= Math.ceil(totalQuestions * 0.8)) {
      traitText = (
        <div>
          <p>Congratulations! You're doing great in maintaining a healthy balance in your internet usage.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Continue setting boundaries and limiting screen time to ensure a balanced lifestyle.</li>
            <li>Engage in offline activities and hobbies to nurture real-life connections and experiences.</li>
            <li>Practice mindfulness and self-awareness to prevent internet addiction and promote well-being.</li>
            <li>Here are some resources that can help:-
              <ul>
                <li><a href="https://www.psychiatry.org/news-room/apa-blogs/tips-to-take-control-of-your-social-media-use"> Tips to control Social Media Use</a></li>
                <li><a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9883821/#:~:text=Such%20findings%20have%20heightened%20concerns,et%20al.%2C%202022).">Problematic Internet Use and Mental Health Outcomes of Students</a>:A Meta-analytic review</li>
              </ul>
            </li>
          </ul>
        </div>
      );
    } else if (score >= Math.ceil(totalQuestions * 0.6)) {
      traitText = (
        <div>
          <p>You're making efforts to maintain a healthy balance in your internet usage, but there's still room for improvement.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Evaluate your online habits and identify areas where you can reduce screen time and prioritize offline activities.</li>
            <li>Set boundaries and schedule dedicated time for technology use, ensuring it doesn't interfere with other aspects of your life.</li>
            <li>Seek support from friends, family, or professionals if you find it challenging to manage your internet usage.</li>
            <li>Here are some resources that can help:-
              <ul>
                <li><a href="https://www.psychiatry.org/news-room/apa-blogs/tips-to-take-control-of-your-social-media-use"> Tips to control Social Media Use</a></li>
                <li><a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9883821/#:~:text=Such%20findings%20have%20heightened%20concerns,et%20al.%2C%202022).">Problematic Internet Use and Mental Health Outcomes of Students</a>:A Meta-analytic review</li>
                <li><a href="https://www.unicef.org/stories/5-ways-better-mental-health-online">Ways to better mental health online</a></li>
                
              </ul>
            </li>
          </ul>
        </div>
      );
    } else {
      traitText = (
        <div>
          <p>Your internet usage may be impacting your well-being, and there's room for improvement to achieve a healthier balance.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Reflect on your online habits and assess if excessive screen time is affecting other areas of your life.</li>
            <li>Implement strategies to reduce screen time, such as setting limits on device usage and incorporating offline activities.</li>
            <li>Consider seeking professional help or joining support groups if you're struggling to manage your internet usage.</li>
            <li>Here are some resources that can help:-
              <ul>
                <li><a href="https://www.psychiatry.org/news-room/apa-blogs/tips-to-take-control-of-your-social-media-use"> Tips to control Social Media Use</a></li>
                <li><a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9883821/#:~:text=Such%20findings%20have%20heightened%20concerns,et%20al.%2C%202022).">Problematic Internet Use and Mental Health Outcomes of Students</a>:A Meta-analytic review</li>
                <li><a href="https://www.unicef.org/stories/5-ways-better-mental-health-online">Ways to better mental health online</a></li>
                
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
  
  export default calculateInternetUsageTrait;
