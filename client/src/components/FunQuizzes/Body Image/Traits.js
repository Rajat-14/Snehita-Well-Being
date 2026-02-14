const calculateBodyImageTrait = (score, totalQuestions) => {
    let traitText = '';
    if (score >= Math.ceil(totalQuestions * 0.8)) {
      traitText = (
        <div>
          <p>Congratulations! You're doing great in nurturing a positive body image and self-esteem.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Continue embracing and celebrating your unique body and appearance.</li>
            <li>Challenge societal beauty standards and promote body positivity in your interactions and community.</li>
            <li>Practice self-compassion and gratitude for your body's strength and resilience.</li>
            <li>Explore resources and communities that promote body acceptance and diversity. </li>
            <li>Some Resources which can help:-
              <ul>
                <li><a href="https://www.medicalnewstoday.com/articles/249190">What is Body Image?</a></li>
                <li><a href="https://dormusleep.com/blogs/articles/what-is-the-relationship-between-body-image-and-sleep">Relationship between sleep and body image</a></li>
              </ul>
            </li>
          </ul>
        </div>
      );
    } else if (score >= Math.ceil(totalQuestions * 0.6)) {
      traitText = (
        <div>
          <p>You're making efforts to improve your body image, but there's still room for growth.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Challenge negative thoughts and beliefs about your body, replacing them with self-affirming statements.</li>
            <li>Surround yourself with supportive individuals who celebrate body diversity and acceptance.</li>
            <li>Engage in activities that promote self-care and boost your confidence and self-esteem.</li>
            <li>Some Resources which can help:-
              <ul>
                <li><a href="https://www.moneycontrol.com/news/health-and-fitness/world-mental-health-day-2023-the-impact-of-negative-body-image-on-your-well-being-11491701.html">The impact of negative body image on your well-being</a></li>
               
                <li><a href="https://www.medicalnewstoday.com/articles/249190">What is Body Image?</a></li>
            
              </ul>
            </li>
          </ul>
        </div>
      );
    } else {
      traitText = (
        <div>
          <p>Your body image may be influenced by various factors, and it's important to address them for your overall well-being.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Practice self-compassion and kindness towards your body, acknowledging its unique strengths and abilities.</li>
            <li>Challenge unrealistic beauty standards and media portrayals that contribute to negative body image.</li>
            <li>Seek support from friends, family, or professionals if you're struggling with body image concerns. </li>
            <li>Some Resources which can help:-
              <ul>
                <li><a href="https://www.apa.org/news/press/releases/2023/02/social-media-body-image">Social Media effects on Body Image</a></li>
                <li><a href="https://www.medicalnewstoday.com/articles/249190">What is Body Image?</a></li>
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
  
  export default calculateBodyImageTrait;
  