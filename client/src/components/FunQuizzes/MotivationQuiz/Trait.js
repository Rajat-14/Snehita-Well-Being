const calculateFinalMotivation = (score, totalQuestions) => {
  let traitText = '';

  if (score >= Math.ceil(totalQuestions * 0.8)) {
    traitText = (
      <div>
        <p>You are highly motivated and driven to achieve your goals. Keep up the excellent work!</p>
        <p>Suggestions:</p>
        <ul>
          <li>
            Explore resources to set even more ambitious goals and develop strategies to achieve them.
             </li>
          <li>
            Connect with like-minded individuals who share your drive and can offer support and inspiration.
            </li>
          <li>
          <p>For further reading on goal setting and finding motivation communities, you might find these resources helpful:</p>
          <ul>
            <li><a href="https://www.dummies.com/article/business-careers-money/careers/general-careers/goal-setting-categorize-and-prioritize-your-life-goals-262814/">Goal Setting: Categorize and Prioritize Your Life Goals</a> by S. J. Scott</li>
            <li><a href="https://hbr.org/2022/08/5-ways-to-set-more-achievable-goals">5 Ways to Set More Achievable Goals</a> by Michael Bungay Stanier</li>
            <li><a href="https://www.smartsheet.com/blog/essential-guide-writing-smart-goals">Essential Guide to Writing SMART Goals</a> by SMART Technologies</li>
            <li><a href="https://www.youtube.com/watch?v=mgLafQZ3LDA">Derek Sivers TED Talk: Keep Your Goals to Yourself</a></li>
            <li><a href="https://www.meetup.com/topics/meet-like-minded-people-meet-like-minded-friends/">Meetup: Meet Like-Minded People</a></li>
            <li><a href="https://www.reddit.com/r/getdisciplined/comments/4p9mqk/method_the_ultimate_guide_to_goal_setting_and/">Subreddits like r/GetMotivated, r/productivity: The Ultimate Guide to Goal Setting and Motivation</a></li>
          </ul>
          </li>
        </ul>
      </div>
    );
  } else if (score >= Math.ceil(totalQuestions * 0.6)) {
    traitText = (
      <div>
        <p>You demonstrate good motivation and determination. Keep setting goals and working towards them!</p>
        <p>Suggestions:</p>
        <ul>
          <li>
            Break down large goals into smaller, achievable steps to maintain momentum and motivation.
             </li>
          <li>
            Reward yourself for achieving milestones to celebrate progress and stay motivated.
          </li>
        </ul>
        <h3>Additional Resources:</h3>
  <ul>
    <li>Goal Setting:
      <ul>
        <li><a href="https://www.forbes.com/sites/forbescoachescouncil/2022/11/18/mastering-the-art-of-goal-setting/">Mastering the Art of Goal Setting (Forbes)</a></li>
        <li><a href="https://www.wikihow.com/Set-Goals">How to Set Goals (wikiHow)</a></li>
      </ul>
    </li>
    <li>Motivation:
      <ul>
        <li><a href="https://www.psychologytoday.com/us/blog/understand-other-people/201603/5-foolproof-ways-stay-motivated">5 Foolproof Ways to Stay Motivated (Psychology Today)</a></li>
        <li><a href="https://greatergood.berkeley.edu/">Greater Good Science Center at UC Berkeley</a></li>
      </ul>
    </li>
    <li>Goal Breakdown Techniques:
      <ul>
        <li><a href="https://www.wikihow.com/Achieve-a-Big-Goal-by-Breaking-It-Into-Smaller-Ones">How to Achieve a Big Goal by Breaking It Into Smaller Ones (wikiHow)</a></li>
        <li><a href="https://jamesclear.com/wp-content/uploads/2016/08/ABriefGuidetoGoalSetting-2.pdf">A Brief Guide to Goal Setting by James Clear</a></li>
      </ul>
    </li>
  </ul>
      </div>
    );
  } else if (score >= Math.ceil(totalQuestions * 0.4)) {
    traitText = (
      <div>
  <p>You have some motivation, but there's room for improvement. Identify your passions and goals, and work towards them!</p>
  <p>Suggestions:</p>
  <ul>
    <li>
      Explore your interests and discover what truly excites and motivates you.
      <br></br>
      Recommended Articles:
      <ul>
        <li>
          <a href="https://www.psychologytoday.com/us/basics/motivation">Psychology Today: Motivation</a> - This article dives into the different types of motivation and how they can help you identify what truly excites you. 
        </li>
        <li>
          <a href="https://www.forbes.com/sites/julesschroeder/2017/06/15/how-to-find-your-passion-7-steps-you-can-take-today/">Forbes: How to Find Your Passion: 7 Steps You Can Take Today</a> - This Forbes article offers practical tips on how to explore your interests and uncover your passions.
        </li>
      </ul>
    </li>
    <li>
      Set clear and specific goals that align with your passions to create a sense of purpose.
      <br></br>
      Recommended Resources:
      <ul>
        <li>
          <a href="https://hbr.org/2022/08/5-ways-to-set-more-achievable-goals">Harvard Business Review: The Neuroscience of Setting Goals</a> - This article explores the science behind goal setting and how to set goals that are achievable and motivating.
        </li>
        <li>
          <a href="https://www.mindtools.com/as56y8x/how-to-set-smart-goals-video">SMART Goals: A Powerful Tool for Achieving Success</a> - This website provides a clear explanation of the SMART goal framework (Specific, Measurable, Achievable, Relevant, and Time-bound) and how to use it to set effective goals.
        </li>
      </ul>
    </li>
  </ul>
</div>

    );
  } else {
    traitText = (
      <div>
  <p>Motivation is key to success. Reflect on your goals and find what truly inspires and drives you.</p>
  <p>Suggestions:</p>
  <ul>
    <li>
      Consider taking motivational workshops or courses to develop a growth mindset and boost motivation.
      <br></br>
      Articles:
      <ul>
        <li>
          <a href="https://www.forbes.com/sites/jackkelly/2022/05/16/how-to-get-motivated-and-achieve-your-goals/">How to Find Motivation and Achieve Your Goals</a> (Forbes) - This article discusses the importance of setting SMART goals and developing a positive mindset.
        </li>
        <li>
          <a href="https://www.melrobbins.com/podcasts/episode-137">The Power of Motivation</a> (Mel Robbins) - Mel Robbins, a motivational speaker and author, shares her tips on how to overcome procrastination and get started on your goals.
        </li>
        <li>
          <a href="https://www.business.com/articles/how-to-stay-motivated-to-start-a-business/">How to Stay Motivated When You Want to Quit</a> (Entrepreneur) - This article offers advice on how to stay motivated when you're feeling discouraged, such as setting small milestones and rewarding yourself for completing them.
        </li>
      </ul>
    </li>
    <li>
      Read inspiring stories and biographies of successful people to find motivation and learn from their experiences.
      <br></br>
      Blogs:
      <ul>
        <li>
          <a href="https://tinybuddha.com/">Tiny Buddha</a> - This blog focuses on mindfulness and personal growth. They often publish articles on motivation, inspiration, and goal setting.
        </li>
        <li>
          <a href="https://zenhabits.net/">Zen Habits</a> - This blog offers practical advice on living a happy and fulfilling life. They have a number of articles on motivation and productivity.
        </li>
        <li>
          <a href="https://jamesclear.com/">James Clear</a> - James Clear is a writer and speaker who specializes in habit formation and behavior change. His blog offers science-backed tips on how to develop and stick to good habits.
        </li>
      </ul>
    </li>
  </ul>
</div>

    );
  }

  return traitText;
};

export default calculateFinalMotivation;

// This function simulates opening a link in a new tab/window (replace with actual implementation)
const openLink = (searchTerm) => {
  window.open(`https://www.google.com/search?q=${searchTerm}`); // Simulate opening link in new tab
};
