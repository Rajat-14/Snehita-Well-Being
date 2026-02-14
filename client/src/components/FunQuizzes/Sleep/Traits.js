const calculateSleepTrait = (score, totalQuestions) => {
    let traitText = '';
    if (score >= Math.ceil(totalQuestions * 0.8)) {
        traitText = (
            <div>
                <p>Congratulations! You're doing great in maintaining healthy sleep habits and patterns.</p>
                <p>Suggestions:</p>
                <ul>
                    <li>Continue prioritizing consistent sleep schedules to ensure restful nights.</li>
                    <li>Practice relaxation techniques before bedtime, such as deep breathing or meditation, to promote better sleep quality.</li>
                    <li>Keep your sleep environment comfortable and conducive to rest, with minimal noise and light disturbances.</li>
                    <li>Here are some resources which can help:-
                        <ul>
                            <li><a href="https://www.nhlbi.nih.gov/health/sleep-deprivation/health-effects#:~:text=If%20you're%20sleep%20deficient,%2C%20and%20risk%2Dtaking%20behavior">How Sleep Affects Your Health</a></li>
                            <li><a href="https://my.clevelandclinic.org/health/diseases/11429-sleep-disorders">Sleep disorders</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        );
    } else if (score >= Math.ceil(totalQuestions * 0.6)) {
        traitText = (
            <div>
                <p>You're making efforts to improve your sleep quality, but there's still room for growth and development.</p>
                <p>Suggestions:</p>
                <ul>
                    <li>Establish a consistent bedtime routine to signal to your body that it's time to wind down and prepare for sleep.</li>
                    <li>Avoid stimulating activities and electronics before bedtime to promote relaxation and better sleep onset.</li>
                    <li>Consider seeking professional help if you're experiencing persistent sleep disturbances or insomnia.</li>
                    <li>Here are some resources which can help:-
                        <ul>
                        <li><a href="https://www.nhlbi.nih.gov/health/sleep-deprivation/health-effects#:~:text=If%20you're%20sleep%20deficient,%2C%20and%20risk%2Dtaking%20behavior">How Sleep Affects Your Health</a></li>
                            <li><a href="https://my.clevelandclinic.org/health/diseases/11429-sleep-disorders">Sleep disorders</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        );
    } else {
        traitText = (
            <div>
                <p>Your sleep habits may benefit from additional attention and effort to improve sleep quality and overall well-being.</p>
                <p>Suggestions:</p>
                <ul>
                    <li>Establish a relaxing bedtime routine to help your body and mind unwind before sleep.</li>
                    <li>Limit caffeine and heavy meals close to bedtime, as they may interfere with your ability to fall asleep.</li>
                    <li>Practice stress-reduction techniques, such as mindfulness or journaling, to alleviate anxiety and promote better sleep.</li>
                    <li>Here are some resources which can help:-
                        <ul>
                        <li><a href="https://www.nhlbi.nih.gov/health/sleep-deprivation/health-effects#:~:text=If%20you're%20sleep%20deficient,%2C%20and%20risk%2Dtaking%20behavior">How Sleep Affects Your Health</a></li>
                            <li><a href="https://my.clevelandclinic.org/health/diseases/11429-sleep-disorders">Sleep disorders</a></li>
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

export default calculateSleepTrait;
