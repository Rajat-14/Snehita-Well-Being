const calculateSocialRelationshipTrait = (score, totalQuestions) => {
    let traitText = '';
    if (score >= Math.ceil(totalQuestions * 0.8)) {
      traitText = (
        <div>
          <p>Congratulations! You're doing great in nurturing your social relationships and connections.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Continue investing time and effort in maintaining strong, supportive relationships with friends and loved ones.</li>
            <li>Practice active listening and empathy to deepen your connections and understanding with others.</li>
            <li>Explore new social activities or group events to expand your social circle and meet new people.</li>
            <li>Here are some resources which can help:-
              <ul>
                <li><a href="https://www.nm.org/healthbeat/healthy-tips/5-benefits-of-healthy-relationships">Strong relationships, strong health</a></li>
                <li><a href="https://www.cdc.gov/emotional-wellbeing/social-connectedness/affect-health.htm#:~:text=When%20people%20are%20socially%20connected,stress%2C%20anxiety%2C%20and%20depression.">How Does Social Connectedness Affect Health?</a></li>
              </ul>
            </li>
          </ul>
        </div>
      );
    } else if (score >= Math.ceil(totalQuestions * 0.6)) {
      traitText = (
        <div>
          <p>You're making efforts to improve your social relationships, but there's still room for growth and development.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Reflect on your communication and interpersonal skills, and identify areas for improvement.</li>
            <li>Seek opportunities to connect with others and participate in social activities or group settings.</li>
            <li>Consider joining clubs, organizations, or support groups that align with your interests and values.</li>
            <li>Here are some resources which can help:-
              <ul>
                <li><a href="https://www.betterhealth.vic.gov.au/health/healthyliving/Strong-relationships-strong-health">Strong relationships, strong health</a></li>
                <li><a href="https://www.verywellmind.com/social-support-for-psychological-health-4119970">How Social Support Contributes to Psychological Health</a></li>
              </ul>
            </li>
          </ul>
        </div>
      );
    } else {
      traitText = (
        <div>
          <p>Your social relationships may benefit from additional attention and effort to strengthen connections and foster a sense of belonging.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Take time to reach out to friends and loved ones, and prioritize spending quality time together.</li>
            <li>Practice active listening and empathy in your interactions to deepen connections and understanding with others.</li>
            <li>Consider seeking support from a therapist or counselor to address any underlying issues impacting your relationships.</li>
            <li>Here are some resources which can help:-
              <ul>
              <li><a href="https://www.betterhealth.vic.gov.au/health/healthyliving/Strong-relationships-strong-health">Strong relationships, strong health</a></li>
                <li><a href="https://www.verywellmind.com/social-support-for-psychological-health-4119970">How Social Support Contributes to Psychological Health</a></li>
                <li><a href="https://www.cdc.gov/emotional-wellbeing/social-connectedness/affect-health.htm#:~:text=When%20people%20are%20socially%20connected,stress%2C%20anxiety%2C%20and%20depression.">How Does Social Connectedness Affect Health?</a></li>
              
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
  
  export default calculateSocialRelationshipTrait;
  