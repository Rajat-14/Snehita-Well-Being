const calculateStressLevel = (score, totalQuestions) => {
    let traitText = '';
  
    if (score >= Math.ceil(totalQuestions * 0.8)) {
      traitText = (
        <div>
        <p>Stress may be significantly impacting your daily life. It's important to seek professional help and support.</p>
        <p>Suggestions:</p>
        <ul>
          <li>
            Consider therapy or counseling from a licensed mental health professional to develop personalized coping strategies and address the root causes of your stress.
            </li>
          <li>
            Explore relaxation techniques and mindfulness practices to manage stress symptoms effectively.
            <ul>
              <li>
                <a href="https://www.mindful.org/">Mindful.org</a>
              </li>
              <li>
                <a href="https://greatergood.berkeley.edu/video/item/how-to-clear-your-head">Greater Good Science Center: The Relaxation Techniques You Need to Know</a>
              </li>
            </ul>
          </li>
          <li>
            Communicate openly with trusted friends and family about your stress and seek their support.
            <ul>
              <li>
                <a href="https://alchemy-of-love.com/expert-relationship-advice/how-to-communicate-relationship">Mayo Clinic: How to improve communication with your loved ones</a> 
              </li>
            </ul>
          </li>
        </ul>
      </div>
       
      );
    } else if (score >= Math.ceil(totalQuestions * 0.7)) {
      traitText = (
        <div>
          <p>You're generally coping well with stress, but there might be room for improvement.</p>
          <p>Suggestions:</p>
          <ul>
            <li>
              Identify sources of stress in your life and develop strategies to manage them.
             </li>
            <li>
              Practice relaxation and mindfulness techniques regularly to reduce stress levels and prevent escalation.
              </li>
            <li>
              Consider seeking support from trusted friends, family, or a counsellor if needed.
            </li>
            <li>
            <a href="https://www.helpguide.org/home-pages/stress-management.htm">HelpGuide: Stress Management</a>
            </li>
            <li><a href="https://www.uclahealth.org/programs/marc/free-guided-meditations/guided-meditations">Explore Guided Meditations</a>
           </li>
           <li><a href="https://hbr.org/topic/subject/stress-management">How to Identify Your Hidden Sources of Stress</a>
           </li>
          </ul>
        </div>
      );
    } else {
      traitText = (
        <div>
          <p>Congratulations! You're managing stress effectively. Keep up the good work!</p>
          <p>Suggestions:</p>
          <ul>
            <li>
              Continue practicing relaxation techniques like deep breathing and mindfulness to maintain calmness.
            </li>
            <li>
              Maintain a healthy lifestyle with regular exercise, balanced diet, and enough sleep to support stress resilience.
            </li>
            <li>
              Explore additional stress management strategies to further enhance your well-being.
               </li>
            <li>
            <a href="https://www.headspace.com/mindfulness">Maintaining Relaxation Techniques</a>
            </li>
            <li><a href="https://www.cdc.gov/sleep/about_sleep/index.html">Healthy Lifestyle for Stress Resilience</a></li>
            <li><a href="https://connect.mayoclinic.org/blog/cancer-education-center/newsfeed-post/benefits-of-yoga/">Advanced Stress Management Techniques</a></li>

          </ul>
        </div>
        
      );
    }
  
    return traitText;
  };
  
  // This function simulates opening a link in a new tab/window (replace with actual implementation)
  const openLink = (searchTerm) => {
    window.open(`https://www.google.com/search?q=${searchTerm}`); // Simulate opening link in new tab
  };
  
  export default calculateStressLevel;
  