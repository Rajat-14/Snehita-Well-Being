const calculateQualityOfLifeTrait = (score, totalQuestions) => {
    let traitText = '';
    if (score >= Math.ceil(totalQuestions * 0.8)) {
      traitText = (
        <div>
          <p>Congratulations! You're doing great in prioritizing your quality of life and well-being.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Continue prioritizing self-care activities that nurture your physical, mental, and emotional well-being.</li>
            <li>Explore new hobbies or activities that bring you joy and fulfillment.</li>
            <li>Seek opportunities for personal growth and development to enhance your overall quality of life.</li>
            <li>Some Resources which can help:-
              <ul>
                <li><a href="https://www.qualityoflifeproject.org/blog/energy/465/">WHAT DOES QUALITY OF LIFE MEAN TO ME?</a></li>
                <li><a href="https://www.aha-now.com/quality-of-life/">Quality Of Life – Let’s Understand It Better</a></li>
              </ul>
            </li>
          </ul>
        </div>
      );
    } else if (score >= Math.ceil(totalQuestions * 0.6)) {
      traitText = (
        <div>
          <p>You're making efforts to improve your quality of life, but there's still room for growth.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Identify areas of your life that need attention and develop action plans to address them.</li>
            <li>Seek support from friends, family, or professionals to overcome challenges and obstacles.</li>
            <li>Consider exploring new interests or activities that contribute to your overall well-being.</li>
            <li>Some Resources which can help:-
              <ul>
                <li><a href="https://www.everydayhealth.com/emotional-health/healthy-hobbies-you-can-pick-up-in-under-a-week/">Healthy Habits</a></li>
                <li><a href="https://www.psychologytoday.com/us/blog/click-here-for-happiness/202312/how-to-improve-your-quality-of-life">How to Improve Your Quality of Life</a></li>
              </ul>
            </li>
          </ul>
        </div>
      );
    } else {
      traitText = (
        <div>
          <p>Your quality of life may be impacted by various factors, and it's essential to address them for overall well-being.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Take time to reflect on your current situation and identify areas that need improvement.</li>
            <li>Seek professional help or counseling to address any challenges or concerns affecting your quality of life.</li>
            <li>Focus on self-care activities and prioritize activities that bring you joy and fulfillment.</li>
            <li>Here are some resources which can help:-
              <ul>
              <li><a href="https://www.mayoclinic.org/healthy-lifestyle/">Mayo Clinic - Healthy Lifestyle</a></li>
              <li><a href="https://www.helpguide.org/articles/mental-health/mental-health-and-self-care.htm">HelpGuide - Mental Health and Self-Care</a></li>
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
  
  export default calculateQualityOfLifeTrait;
  