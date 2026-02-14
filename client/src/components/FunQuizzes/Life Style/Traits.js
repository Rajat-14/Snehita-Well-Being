const calculateLifestyleTrait = (score, totalQuestions) => {
    let traitText = '';
    if (score >= Math.ceil(totalQuestions * 0.8)) {
      traitText = (
        <div>
          <p>Congratulations! You're doing great in maintaining a balanced and fulfilling lifestyle.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Continue prioritizing self-care and well-being by maintaining healthy habits and routines.</li>
            <li>Explore opportunities for personal growth and development, whether through academics, hobbies, or new experiences.</li>
            <li>Remember to nurture your relationships and social connections, as they contribute significantly to your overall happiness and well-being.</li>
            <li>Here are some resources that can help:-
              <ul>
                <li><a href="https://www.genesisrecovery.com/lifestyle-and-mental-health/">Why Is Mental Health Important to a Healthy Lifestyle</a></li>
                <li><a href="https://pennstatehealthnews.org/topics/may-2021-one-group-blog-mental-health/">Understanding the effects of a healthy lifestyle on mental health</a></li>
              </ul>
            </li>
          </ul>
        </div>
      );
    } else if (score >= Math.ceil(totalQuestions * 0.6)) {
      traitText = (
        <div>
          <p>You're making efforts to improve your lifestyle, but there's still room for growth and development.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Identify areas of your lifestyle where you'd like to see improvement, whether it's in academics, health, relationships, or personal interests.</li>
            <li>Set realistic goals and action plans to work towards achieving a more balanced and fulfilling lifestyle.</li>
            <li>Seek support from peers, mentors, or counselors if you're facing challenges or need guidance on making positive changes.</li>
            <li>Here are some resources that can help:-
              <ul>
                <li><a href="https://www.medicalnewstoday.com/articles/these-7-healthy-lifestyle-habits-can-help-prevent-depression-new-study-finds">7 healthy lifestyle habits can help prevent depression</a></li>
                <li><a href="https://www.genesisrecovery.com/lifestyle-and-mental-health/">Why Is Mental Health Important to a Healthy Lifestyle</a></li>
                <li><a href="https://pennstatehealthnews.org/topics/may-2021-one-group-blog-mental-health/">Understanding the effects of a healthy lifestyle on mental health</a></li>
              </ul>
            </li>
          </ul>
        </div>
      );
    } else {
      traitText = (
        <div>
          <p>Your lifestyle may benefit from additional attention and effort to achieve a greater sense of balance and well-being.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Take time to reflect on your current lifestyle habits and identify areas where you'd like to make positive changes.</li>
            <li>Start small by implementing small, achievable goals that align with your values and priorities.</li>
            <li>Seek support from friends, family, or professionals if you're feeling overwhelmed or unsure about how to improve your lifestyle.</li>
            <li>Here are some resources that can help:-
              <ul>
              <li><a href="https://www.medicalnewstoday.com/articles/these-7-healthy-lifestyle-habits-can-help-prevent-depression-new-study-finds">7 healthy lifestyle habits can help prevent depression</a></li>
                <li><a href="https://www.genesisrecovery.com/lifestyle-and-mental-health/">Why Is Mental Health Important to a Healthy Lifestyle</a></li>
                <li><a href="https://pennstatehealthnews.org/topics/may-2021-one-group-blog-mental-health/">Understanding the effects of a healthy lifestyle on mental health</a></li>
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
  
  export default calculateLifestyleTrait;
  