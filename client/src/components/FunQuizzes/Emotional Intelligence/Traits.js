const calculateEmotionalIntelligenceTrait = (score, totalQuestions) => {
    let traitText = '';
    if (score >= Math.ceil(totalQuestions * 0.8)) {
      traitText = (
        <div>
          <p>Congratulations! You demonstrate strong emotional intelligence and are adept at understanding and managing your emotions.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Continue practicing self-awareness and mindfulness to further enhance your emotional intelligence skills.</li>
            <li>Offer support and empathy to those around you, fostering positive relationships and a supportive environment.</li>
            <li>Explore advanced techniques such as emotional regulation and conflict resolution to deepen your emotional intelligence.</li>
            <li>Here are some resources which can help:-
              <ul>
                <li><a href="https://www.psychologytoday.com/us/basics/emotional-intelligence">Emotional Intelligence</a></li>
                <li><a href="https://eqedge.com/">The EQ Edge</a></li>
              </ul>
            </li>
          </ul>
        </div>
      );
    } else if (score >= Math.ceil(totalQuestions * 0.6)) {
      traitText = (
        <div>
          <p>You're making progress in developing your emotional intelligence, but there's still room for improvement.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Reflect on situations where you can practice empathy and perspective-taking to better understand others' emotions.</li>
            <li>Work on enhancing your communication skills to express your emotions and needs effectively.</li>
            <li>Seek feedback from trusted individuals to gain insights into areas for growth and development. </li>
            <li>Here are some resources which can help:-
              <ul>
                <li><a href="https://www.6seconds.org/">Emotional Intelligence is being smarter with feelings.</a></li>
                <li><a href="https://www.psychologytoday.com/us/basics/emotional-intelligence">Emotional Intelligence</a></li>
                <li><a href="https://eqedge.com/">The EQ Edge</a></li>
              
              </ul>
            </li>
          </ul>
        </div>
      );
    } else {
      traitText = (
        <div>
          <p>There is an opportunity to enhance your emotional intelligence for better understanding and managing emotions.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Practice active listening and empathy in your interactions with others to better understand their perspectives and emotions.</li>
            <li>Seek out resources such as books, workshops, or online courses to learn more about emotional intelligence and its components.</li>
            <li>Engage in self-reflection to identify patterns in your emotional responses and areas for improvement.</li>
            <li>Here are some resources which can help:-
              <ul>
              <li><a href="https://www.6seconds.org/">Emotional Intelligence is being smarter with feelings.</a></li>
                <li><a href="https://www.psychologytoday.com/us/basics/emotional-intelligence">Emotional Intelligence</a></li>
                <li><a href="https://eqedge.com/">The EQ Edge</a></li>
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
  
  export default calculateEmotionalIntelligenceTrait;
