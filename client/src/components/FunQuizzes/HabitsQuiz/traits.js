const calculateHabitProgress = (score, totalQuestions) => {
    let traitText = '';
  
    if (score >= Math.ceil(totalQuestions * 0.8)) {
      traitText = (
        <div>
          <p>Congratulations! You're demonstrating strong self-awareness and progress in forming positive habits.</p>
          <p>Suggestions:</p>
          <ul>
            <li>
              Continue practicing your chosen strategies consistently. Repetition is key to solidifying new habits.
            </li>
            <li>
              Challenge yourself with slightly more ambitious goals as your confidence grows. Celebrate your achievements!
            </li>
            <li>
              Consider exploring new habit-building techniques or apps to further optimize your approach.
              </li>
            <p>For further reading on habit formation, you might find these articles helpful:</p>
            <ul>
              <li><a href="https://www.psychologytoday.com/us/basics/habit-formation">Psychology Today: Habit Formation</a></li>
              <li><a href="https://cultivate.ngo/blog/how-to-build-lasting-habits">Cultivate: How to Build Lasting Habits</a></li>
            </ul>
          </ul>
        </div>
      );
    } else if (score >= Math.ceil(totalQuestions * 0.5)) {
      traitText = (
        <div>
          <p>You're on the right track! You've made significant progress, but there's always room for refinement.</p>
          <p>Suggestions:</p>
          <ul>
            <li>
              Identify areas where you might be facing challenges and develop targeted strategies to overcome them.
             
            </li>
            <li>
              Review your goals regularly and adjust them as needed to maintain motivation and focus.
            </li>
            <li>
              Seek inspiration from success stories or find a supportive habit-building community for encouragement.
             
            </li>
            <p>For further reading on challenges of habit formation and its solution, you might find these articles helpful:</p>
            <ul>
              <li><a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8829329/">Strategies on overcoming challenges in habit formation</a></li>
              <li><a href="https://jamesclear.com/one-sentence-habits">Success stories on habit building</a></li>
              <li><a href="https://kajabi.com/blog/online-community-inspiration">Habit building communities</a></li>
            </ul>
          </ul>
        </div>
      );
    } else {
      traitText = (
        <div>
          <p>Developing positive habits takes time and effort. Don't be discouraged by setbacks. Keep practicing!</p>
          <p>Suggestions:</p>
          <ul>
            <li>
              Start with small, achievable goals and gradually increase the complexity as you gain confidence.
              </li>
            <li>
              Focus on building consistency and celebrate even small wins. Consistency is crucial for habit formation.
            </li>
            <li>
              Seek support from trusted friends, family, or a counsellor if you need additional guidance or motivation.
            </li>
            <p>For further reading on habit formation, you might find these articles helpful:</p>
          <ul>
            <li><a href="https://www.melyssagriffin.com/3-ways-to-set-goals-that-actually-work/">The Scientific Way to Develop Better Habits (Hint: It's Not As Hard As It Sounds) by Melissa Griffin</a></li>
            <li><a href="https://www.usemotion.com/blog/make-a-schedule-schedule-making">How to Build Good Habits (+ 20 Powerful Habits for Well-Being and Success) by Usemotion</a></li>
            <li><a href="https://zenhabits.net/">Zen Habits</a> - This popular blog focuses on minimalism and personal growth, with a strong emphasis on habit formation and behavior change.</li>
            <li><a href="https://jamesclear.com/">James Clear</a> - James Clear is a well-known author and blogger on habit formation. His website offers a wealth of articles and resources on building good habits and breaking bad ones.</li>
          </ul>

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
  
  export default calculateHabitProgress;
  