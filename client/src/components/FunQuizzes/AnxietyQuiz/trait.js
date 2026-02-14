import '../Components/Quiz.css';

const calculateAnxietyTrait = (score, totalQuestions) => {
    let traitText = '';
    if (score >= Math.ceil(totalQuestions * 0.8)) {
      traitText = (
        <div>
          <p>Anxiety may be significantly impacting your daily life. It's important to seek professional help and support.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Consider seeking therapy or counseling from a licensed mental health professional to develop personalized coping strategies and address the root causes of your anxiety.</li>
            <li>Explore relaxation techniques and mindfulness practices to manage anxiety symptoms effectively.</li>
            <li>Communicate openly with trusted friends and family about your anxiety and seek their support.</li>
            <li> Some Useful Resources
              <ul>
                <li><a href="https://www.mayoclinichealthsystem.org/hometown-health/speaking-of-health/11-tips-for-coping-with-an-anxiety-disorder">Tips to cope with an anxiety disorder</a></li>
                <li><a href="https://adaa.org/tips">Tips and Strategies to Manage Anxiety</a></li>
                <li><a href="https://newsnetwork.mayoclinic.org/discussion/exercise-and-stress-get-moving-to-manage-stress/">Exercise to manage Anxiety</a></li>
                <li><a href="https://www.sleepfoundation.org/mental-health/anxiety-and-sleep">Sleep and Mental Health</a></li>
                </ul>
            </li>
          </ul>
        </div>
        
      );
    } else if (score >= Math.ceil(totalQuestions * 0.5)) {
      traitText = (
        <div>
          <p>You're managing your anxiety well, but there's always room for improvement. Consider additional tools.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Practice relaxation and mindfulness techniques regularly to manage stress and prevent anxiety from escalating.</li>
            <li>Explore journaling or gratitude exercises to cultivate positive self-talk and manage anxious thoughts.</li>
            <li>Consider joining support groups or online forums to connect with others who understand anxiety and share experiences.</li>
            <li> Some Useful Resources
              <ul>
                <li><a href="https://www.helpguide.org/harvard/stress-relief-guide.htm">Take the sting out of 10 common stressors</a></li>
                <li><a href="https://adaa.org/tips">Tips and Strategies to Manage Anxiety</a></li>
                <li><a href="https://www.therecoveryvillage.com/mental-health/anxiety/living-with-anxiety/">Tips to cope with anxiety</a></li>
                <li><a href="https://greatergood.berkeley.edu/">Greater Good Magazine </a></li>
              </ul>
            </li>
          </ul>
        </div>
      );
    } else
     {
      traitText = (
        <div>
          <p>Congratulations! You have shown resilience in managing your anxiety. Keep up the good work!</p>
          <p>Suggestions:</p>
          <ul>
            <li>Continue practicing relaxation techniques like deep breathing and mindfulness to maintain calmness.</li>
            <li>Maintain a healthy lifestyle with regular exercise, balanced diet, and enough sleep to support emotional well-being.</li>
            <li>Explore stress management techniques to further reduce anxiety and promote overall resilience.  </li>
            <li> Some Useful Resources
              <ul>
                <li><a href="https://www.helpguide.org/harvard/stress-relief-guide.htm">Take the sting out of 10 common stressors</a></li>
                <li><a href="https://www.webmd.com/balance/stress-management/stress-management">Ways to Manage Stress</a></li>
                <li><a href="https://www.health.harvard.edu/blog/diet-and-depression-2018022213309">Healthy Eating for Mood</a></li>
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
  
  export default calculateAnxietyTrait;
  