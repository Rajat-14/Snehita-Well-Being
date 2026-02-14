const calculateTimeManagementTrait = (score, totalQuestions) => {
    let traitText = '';
    if (score >= Math.ceil(totalQuestions * 0.8)) {
      traitText = (
        <div>
          <p>Congratulations! You're excelling in managing your time effectively.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Continue using effective time management strategies to maintain productivity and reduce stress.</li>
            <li>Regularly review and adjust your time management techniques to optimize efficiency.</li>
            <li>Explore advanced time management tools and techniques to further enhance your skills.</li>
            <li>Some Resources which can help:-
              <ul>
              <li><a href="https://www.mcleanhospital.org/essential/do-you-manage-your-time-well#:~:text=%E2%80%9CThose%20who%20struggle%20with%20time,on%20time%20for%20your%20job.">Do you manage your time well?</a></li>
                <li><a href="https://www.calendar.com/blog/how-are-time-management-and-mental-health-related/">How are time management and mental health related?</a></li>
               </ul>
            </li>
          </ul>
        </div>
      );
    } else if (score >= Math.ceil(totalQuestions * 0.6)) {
      traitText = (
        <div>
          <p>You're making efforts to improve your time management skills, but there's still room for growth.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Identify specific areas where you can improve time management and develop strategies to address them.</li>
            <li>Seek guidance from mentors or time management experts to learn new techniques and approaches.</li>
            <li>Consistently practice time management principles to build habits that support productivity and efficiency.</li>
            <li>Some Resources which can help:-
              <ul>
              <li><a href="https://psychcentral.com/health/tips-to-improve-your-time-management-skills">7 Time Management Skills To Improve Your Mental Health</a></li>
              
              <li><a href="https://www.mcleanhospital.org/essential/do-you-manage-your-time-well#:~:text=%E2%80%9CThose%20who%20struggle%20with%20time,on%20time%20for%20your%20job.">Do you manage your time well?</a></li>
                <li><a href="https://www.calendar.com/blog/how-are-time-management-and-mental-health-related/">How are time management and mental health related?</a></li>
              </ul>
            </li>
          </ul>
        </div>
      );
    } else {
      traitText = (
        <div>
          <p>Your time management skills may need improvement to enhance productivity and reduce stress.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Take time to assess your current time management habits and identify areas for improvement.</li>
            <li>Seek out resources or courses on time management to learn new techniques and strategies.</li>
            <li>Experiment with different approaches to find what works best for you and incorporate them into your routine.</li>
            <li>Here are some resources which can help:-
              <ul>
                <li><a href="https://www.mcleanhospital.org/essential/do-you-manage-your-time-well#:~:text=%E2%80%9CThose%20who%20struggle%20with%20time,on%20time%20for%20your%20job.">Do you manage your time well?</a></li>
                <li><a href="https://www.calendar.com/blog/how-are-time-management-and-mental-health-related/">How are time management and mental health related?</a></li>
                
                <li><a href="https://health.usnews.com/wellness/mind/how-to-improve-time-management">How to Improve Your Time Management for Better Mental Health</a></li>
                
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
  
  export default calculateTimeManagementTrait;
