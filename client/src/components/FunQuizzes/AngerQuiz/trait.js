import '../Components/Quiz.css';
const calculateHappinessTrait = (score, totalQuestions) => {
  let traitText = '';
  if (score >= Math.ceil(totalQuestions * 0.8)) {
    traitText = (
      <div>
        <p>Congratulations! You have shown resilience and self-awareness in managing your anger. Keep up the good work!</p>
        <p>Suggestions:</p>
        <ul>
          <li>Continue practicing healthy coping mechanisms such as deep breathing, mindfulness, and assertive communication.</li>
          <li>Seek support from loved ones or a therapist if you encounter challenges in managing your anger.</li>
          <li>Explore stress management techniques to promote emotional well-being and resilience. </li>
          <li>Some Resources which can help:-
            <ul>
              <li><a href="https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/anger-management/art-20045434">Mayo Clinic:Overview of anger , its causes and healthy coping mechanism</a></li>
              <li><a href="https://www.apa.org/topics/anger/control">Control anger before it controls you</a></li>
            </ul>
          </li>
        </ul>
      </div>
    );
  } else if (score >= Math.ceil(totalQuestions * 0.6)) {
    traitText = (
      <div>
        <p>You have demonstrated some effective coping strategies, but there is room for improvement in managing your anger.</p>
        <p>Suggestions:</p>
        <ul>
          <li>Practice relaxation techniques and mindfulness to manage stress and prevent anger from escalating. </li>
          <li>Seek support from friends, family, or a therapist to explore healthy ways to express and manage your emotions.</li>
          <li>Consider joining anger management workshops or support groups to learn new strategies for coping with anger.</li>
          <li>Some Resources which can help:-
            <ul>
              <li><a href="https://www.helpguide.org/articles/mental-health/anger-management.htm">Help Guide: Anger Management</a></li>
              <li><a href="https://www.helpguide.org/articles/mental-health/emotional-intelligence-toolkit.htm">Emotional Intelligence Toolkit</a></li>

            </ul>
          </li>
        </ul>
      </div>
    );
  } else {
    traitText = (
      <div>
        <p>Your anger may be impacting your relationships and daily life. It's important to seek help and support to address this issue.</p>
        <p>Suggestions:</p>
        <ul>
          <li>Consider seeking therapy or counseling to explore the underlying causes of your anger and learn effective coping strategies.  </li>
          <li>Practice self-care and stress management techniques to improve your emotional well-being.</li>
          <li>Communicate openly with trusted individuals about your feelings and seek their support in managing your anger.</li>
          <li>Here are some resources which can help:-
                <ul>
          <li>
            <a href="https://store.samhsa.gov/sites/default/files/anger_management_manual_508_compliant.pdf">A Cognitive-Behaviour Theory Manual</a>
          </li>
          <li>
            <a href="https://yourdost.com/blog/2021/05/better-anger-management.html">5 Tips For Better Anger Management YourDOST Anger Management</a>
          </li>
          <li>
            <a href="https://www.verywellmind.com/anger-management-strategies-4178870">Verywell Mind: 11 Anger Management Strategies to Help You Calm Down</a>
          </li>
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

export default calculateHappinessTrait;
