const calculateDepressionTrait = (score, totalQuestions) => {
    let traitText = '';
    if (score <= Math.floor(totalQuestions * 0.2)) {
      traitText = (
        <div>
          <p>You demonstrate resilience and a strong ability to cope with life's challenges, showing minimal signs of depression.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Continue practicing self-care activities that promote mental well-being, such as exercise, relaxation techniques, and spending time with loved ones.</li>
            <li>Stay connected with supportive friends and family members who can offer encouragement and understanding.</li>
            <li>Consider seeking professional help if you experience persistent symptoms or feel overwhelmed by negative emotions.</li>
            <li>Here are some resources which can help:-
              <ul>
                <li><a href="https://kidshealth.org/en/teens/depression.html">Depression: What You Need to Know</a></li>
                <li><a href="https://www.healthline.com/health/depression/recognizing-symptoms">Signs of Depression</a></li>
              </ul>
            </li>
          </ul>
        </div>
      );
    } else if (score <= Math.floor(totalQuestions * 0.5)) {
      traitText = (
        <div>
          <p>You're experiencing some symptoms of depression, but there's still hope for improvement with the right support and strategies.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Reach out to trusted individuals for emotional support and guidance.</li>
            <li>Engage in activities that bring you joy and fulfillment, even in small doses.</li>
            <li>Consider seeking professional help or therapy to explore coping strategies and address underlying issues.</li>
            <li>Here are some resources which can help:-
              <ul>
                <li><a href="https://timesofindia.indiatimes.com/life-style/health-fitness/health-news/understanding-depression-are-you-really-depressed-or-just-sad/photostory/96786346.cms">Understanding depression: Are you really depressed or just sad?</a></li>
                <li><a href="https://kidshealth.org/en/teens/depression.html">Depression: What You Need to Know</a></li>
                <li><a href="https://www.healthline.com/health/depression/recognizing-symptoms">Signs of Depression</a></li>
             
              </ul>
            </li>
          </ul>
        </div>
      );
    } else {
      traitText = (
        <div>
          <p>You're exhibiting significant symptoms of depression and may benefit from professional support and treatment.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Reach out to a mental health professional for an evaluation and personalized treatment plan.</li>
            <li>Consider therapy or counseling to explore underlying issues and develop coping strategies.</li>
            <li>Stay connected with supportive individuals who can offer encouragement and understanding during this challenging time.</li>
            <li>Here are some resources which can help:-
              <ul>
              <li><a href="https://timesofindia.indiatimes.com/life-style/health-fitness/health-news/understanding-depression-are-you-really-depressed-or-just-sad/photostory/96786346.cms">Understanding depression: Are you really depressed or just sad?</a></li>
                <li><a href="https://www.medicalnewstoday.com/articles/8933">What is depression and what can I do about it?</a></li>
                <li><a href="https://www.healthline.com/health/depression/recognizing-symptoms">Signs of Depression</a></li>
             
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
  
  export default calculateDepressionTrait;
