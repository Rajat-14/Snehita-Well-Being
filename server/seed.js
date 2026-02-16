const dotenv = require('dotenv');
dotenv.config();
const sequelize = require('./db/database');
const Blog = require('./model/blog');
const Quiz = require('./model/quiz');
const Testimonial = require('./model/testimonial');
const Achievement = require('./model/achievement');
const OrganizationInfo = require('./model/organizationInfo');
const Message = require('./model/message');
const ContactDetail = require('./model/contactDetail');
const TeamMember = require('./model/teamMember');
const User = require('./model/userSchema');
const Role = require('./model/role');
const Counselor = require('./model/counselor');
const bcrypt = require('bcrypt');

const seedData = async () => {
    try {
        await sequelize.sync({ alter: true });

        // Seed Blogs
        const blogs = [
            {
                title: "11 tips for coping with an anxiety disorder",
                link: "https://www.mayoclinichealthsystem.org/hometown-health/speaking-of-health/11-tips-for-coping-with-an-anxiety-disorder",
                type: "Anxiety",
                pic: "Anxiety/anxiety_1.jpg",
            },
            {
                title: "Tips and Strategies to Manage Anxiety and Stress",
                link: "https://adaa.org/tips",
                type: "Anxiety",
                pic: "Anxiety/anxiety_2.jpg",
            },
            {
                title: "Exercise and stress: Get moving to manage stress",
                link: "https://newsnetwork.mayoclinic.org/discussion/exercise-and-stress-get-moving-to-manage-stress",
                type: "Anxiety",
                pic: "Anxiety/anxiety_3.jpg",
            },
            {
                title: "Anxiety and Sleep",
                link: "https://www.sleepfoundation.org/mental-health/anxiety-and-sleep",
                type: "Anxiety",
                pic: "Anxiety/anxiety_4.png",
            },
            {
                title: "Living With Anxiety",
                link: "https://www.therecoveryvillage.com/mental-health/anxiety/living-with-anxiety/",
                type: "Anxiety",
                pic: "Anxiety/anxiety_5.png",
            },
            {
                title: "Keeping your temper in check can be challenging. Use simple anger management tips",
                link: "https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/anger-management/art-20045434",
                type: "Anger",
                pic: "Anger/anger_1.jpg",
            },
            {
                title: "Control anger before it controls you",
                link: "https://www.apa.org/topics/anger/control",
                type: "Anger",
                pic: "Anger/anger_2.jpg",
            },
            {
                title: "Is your temper hijacking your life? These tips and techniques can help",
                link: "https://www.helpguide.org/articles/mental-health/anger-management.htm",
                type: "Anger",
                pic: "Anger/anger_3.jpg",
            },
            {
                title: "Want to become a happier, healthier you? ",
                link: "https://www.helpguide.org/articles/mental-health/emotional-intelligence-toolkit.htm",
                type: "Anger",
                pic: "Anger/anger_4.jpg",
            },
            {
                title: "5 Tips For Better Anger Management",
                link: "https://yourdost.com/blog/2021/05/better-anger-management.html",
                type: "Anger",
                pic: "Anger/anger_5.jpg",
            },
            {
                title: "Managing anger can help your body and brain respond to stress in healthy ways",
                link: "https://www.verywellmind.com/anger-management-strategies-4178870",
                type: "Anger",
                pic: "Anger/anger_6.jpg",
            },
            {
                title: "Habit Formation",
                link: "https://www.psychologytoday.com/us/basics/habit-formation",
                type: "Habit",
                pic: "habit/habit_1.png",
            },
            {
                title: "Strategies on overcoming challenges in habit formation",
                link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8829329/",
                type: "Habit",
                pic: "habit/habit_2.png",
            },
            {
                title: "Success stories on habit building",
                link: "https://jamesclear.com/one-sentence-habits",
                type: "Habit",
                pic: "habit/habit_3.png",
            },
            {
                title: "Habit building communities",
                link: "https://kajabi.com/blog/online-community-inspiration",
                type: "Habit",
                pic: "habit/habit_4.png",
            },
            {
                title: "The Scientific Way to Develop Better Habits",
                link: "https://www.melyssagriffin.com/3-ways-to-set-goals-that-actually-work/",
                type: "Habit",
                pic: "habit/habit_5.png",
            },
            {
                title: "How to Build Good Habits for Well-Being and Success",
                link: "https://www.usemotion.com/blog/make-a-schedule-schedule-making",
                type: "Habit",
                pic: "habit/habit_6.png",
            },
            {
                title: "How To Break Dependence On Phone",
                link: "https://zenhabits.net/",
                type: "Habit",
                pic: "habit/habit_8.jpg",
            },
            {
                title: "Goal Setting: Categorize and Prioritize Your Life Goals",
                link: "https://www.dummies.com/article/business-careers-money/careers/general-careers/goal-setting-categorize-and-prioritize-your-life-goals-262814/",
                type: "Goals Setting",
                pic: "motivation/motivation_1.jpg",
            },
            {
                title: "5 Ways to Set More Achievable Goals",
                link: "https://hbr.org/2022/08/5-ways-to-set-more-achievable-goals",
                type: "Goals Setting",
                pic: "motivation/motivation_2.jpg",
            },
            {
                title: "Essential Guide to Writing SMART Goals",
                link: "https://www.smartsheet.com/blog/essential-guide-writing-smart-goals",
                type: "Goals Setting",
                pic: "motivation/motivation_3.jpg",
            },
            {
                title: "Mastering the Art of Goal Setting",
                link: "https://www.forbes.com/sites/forbescoachescouncil/2022/11/18/mastering-the-art-of-goal-setting/",
                type: "Goals Setting",
                pic: "motivation/motivation_4.jpg",
            },
            {
                title: "How to Set Goals",
                link: "https://www.wikihow.com/Set-Goals",
                type: "Goals Setting",
                pic: "motivation/motivation_5.jpg",
            },
            {
                title: " 5 Foolproof Ways to Stay Motivated",
                link: "https://www.psychologytoday.com/us/blog/understand-other-people/201603/5-foolproof-ways-stay-motivated",
                type: "Goals Setting",
                pic: "motivation/motivation_6.jpg",
            },
            {
                title: "How to Achieve a Big Goal by Breaking It Into Smaller Ones",
                link: "https://www.wikihow.com/Achieve-a-Big-Goal-by-Breaking-It-Into-Smaller-Ones",
                type: "Goals Setting",
                pic: "motivation/motivation_7.jpg",
            },
            {
                title: "Motivation is the desire to act in service of a goal.",
                link: "https://www.psychologytoday.com/us/basics/motivation",
                type: "Goals Setting",
                pic: "motivation/motivation_8.jpg",
            },
            {
                title: "How to Find Your Passion: 7 Steps You Can Take Today",
                link: "https://www.forbes.com/sites/julesschroeder/2017/06/15/how-to-find-your-passion-7-steps-you-can-take-today/",
                type: "Goals Setting",
                pic: "motivation/motivation_9.jpg",
            },
            {
                title: "Meditation is not about feeling a certain way. It's about feeling the way you feel.",
                link: "https://www.uclahealth.org/programs/marc/free-guided-meditations/guided-meditations",
                type: "Stress",
                pic: "stress/stress_1.jpg",
            },
            {
                title: "How to Stop Dwelling on Your Stress",
                link: "https://hbr.org/2024/01/how-to-stop-dwelling-on-your-stress",
                type: "Stress",
                pic: "stress/stress_2.jpg",
            },
            {
                title: "How to Reduce and Relieve Stress",
                link: "https://www.helpguide.org/articles/stress/stress-management.htm",
                type: "Stress",
                pic: "stress/stress_3.jpg",
            },
            {
                title: "Yoga: Fight stress and find serenity",
                link: "https://connect.mayoclinic.org/blog/cancer-education-center/newsfeed-post/benefits-of-yoga/",
                type: "Stress",
                pic: "stress/stress_4.jpg",
            },
            {
                title: "Stress Relief Guide",
                link: "https://www.helpguide.org/harvard/stress-relief-guide.htm",
                type: "Stress",
                pic: "stress/stress_5.jpg",
            },
            {
                title: "Ways to Reduce Stress with Music",
                link: "https://www.helpguide.org/articles/stress/12-ways-to-reduce-stress-with-music.htm",
                type: "Stress",
                pic: "stress/stress_6.jpg",
            },
            {
                title: "Social Support for Stress Relief",
                link: "https://www.helpguide.org/articles/stress/social-support-for-stress-relief.htm",
                type: "Stress",
                pic: "stress/stress_7.jpg",
            },
            {
                title: "9 depression symptoms to look out for",
                link: "https://www.healthline.com/health/depression/recognizing-symptoms",
                type: "Depression",
                pic: "depression/depression_1.jpg",
            },
            {
                title: "What is depression and what can I do about it?",
                link: "https://www.medicalnewstoday.com/articles/8933",
                type: "Depression",
                pic: "depression/depression_2.jpg",
            },
            {
                title: "Depression: What You Need to Know",
                link: "https://kidshealth.org/en/teens/depression.html",
                type: "Depression",
                pic: "depression/depression_3.jpg",
            },
            {
                title: "What Is Depression? Symptoms, Causes, Diagnosis, Treatment, and Prevention",
                link: "https://www.everydayhealth.com/depression/guide/",
                type: "Depression",
                pic: "depression/depression_4.jpg",
            },
            {
                title: "Understanding depression: Are you really depressed or just sad?",
                link: "https://timesofindia.indiatimes.com/life-style/health-fitness/health-news/understanding-depression-are-you-really-depressed-or-just-sad/photostory/96786346.cms",
                type: "Depression",
                pic: "depression/depression_5.jpg",
            },
            {
                title: "Associations Between Problematic Internet Use and Mental Health Outcomes of Students",
                link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9883821/#:~:text=Such%20findings%20have%20heightened%20concerns,et%20al.%2C%202022",
                type: "Internet Usage",
                pic: "internetUsage/internet_1.png",
            },
            {
                title: "6 Tips to Help Take Control of Your Social Media Use and Improve Well-being",
                link: "https://www.psychiatry.org/news-room/apa-blogs/tips-to-take-control-of-your-social-media-use",
                type: "Internet Usage",
                pic: "internetUsage/internet_2.png",
            },
            {
                title: "5 ways to better mental health online",
                link: "https://www.unicef.org/stories/5-ways-better-mental-health-online",
                type: "Internet Usage",
                pic: "internetUsage/internet_3.png",
            },
            {
                title: "Time Management: A Realistic Approach",
                link: "https://www.jacr.org/article/S1546-1440(08)00581-4/fulltext",
                type: "Time-Management",
                pic: "timeManagement/time_1.png",
            },
            {
                title: "Top 16 Time Management Skills to Help You Become a Success",
                link: "https://www.simplilearn.com/time-management-skills-article",
                type: "Time-Management",
                pic: "timeManagement/time_2.jpeg",
            },
            {
                title: "18 Effective Time Management Strategies and Techniques",
                link: "https://www.upwork.com/resources/time-management-strategies",
                type: "Time-Management",
                pic: "timeManagement/time_3.jpeg",
            },
            {
                title: "Effects of time management interventions on mental health and wellbeing factors",
                link: "https://www.medrxiv.org/content/10.1101/2023.07.07.23292349v1.full",
                type: "Time-Management",
                pic: "timeManagement/time_4.jpg",
            },
            {
                title: "How Are Time Management and Mental Health Related?",
                link: "https://www.calendar.com/blog/how-are-time-management-and-mental-health-related/",
                type: "Time-Management",
                pic: "timeManagement/time_5.png",
            },
            {
                title: "The effects of sleep on body image",
                link: "https://www.tandfonline.com/doi/abs/10.1080/07448481.2023.2186153",
                type: "Sleep and Body Image",
                pic: "sleep/sleep_1.png",
            },
            {
                title: "What is the Relationship Between Body Image and Sleep?",
                link: "https://dormusleep.com/blogs/articles/what-is-the-relationship-between-body-image-and-sleep",
                type: "Sleep and Body Image",
                pic: "sleep/sleep_2.jpg",
            },
            {
                title: "What is body image?",
                link: "https://www.medicalnewstoday.com/articles/249190",
                type: "Sleep and Body Image",
                pic: "sleep/sleep_3.jpeg",
            },
            {
                title: "Sleep Disorders",
                link: "https://my.clevelandclinic.org/health/diseases/11429-sleep-disorders",
                type: "Sleep and Body Image",
                pic: "sleep/sleep_4.jpg",
            },
            {
                title: "How Sleep Affects Your Health",
                link: "https://www.nhlbi.nih.gov/health/sleep-deprivation/health-effects#:~:text=If%20you're%20sleep%20deficient,%2C%20and%20risk%2Dtaking%20behavior",
                type: "Sleep and Body Image",
                pic: "sleep/sleep_5.jpg",
            },
        ];

        if ((await Blog.count()) === 0) {
            await Blog.bulkCreate(blogs);
            console.log('Blogs seeded');
        }

        // Seed Quizzes
        const quizzes = [
            {
                imageUrl: "anger.webp",
                heading: 'AngerQuiz',
                link: '/AngerQuiz'
            },
            {
                imageUrl: "anxiety.avif",
                heading: 'AnxietyQuiz',
                link: '/AnxietyQuiz'
            },
            {
                imageUrl: "bodyImage.jpg",
                heading: 'Body Image Self Analysis Test',
                link: '/BodyImageQuiz'
            },
            {
                imageUrl: "DEPRESSION.jpeg",
                heading: 'Depression Self Analysis Test',
                link: '/DepressionTest'
            },
            {
                imageUrl: "EI.jpeg",
                heading: 'Emotional Intelligence',
                link: '/EmotionalIntelligenceQuiz'
            },
            {
                imageUrl: "habit.jpeg",
                heading: 'HabitQuiz',
                link: '/HabitQuiz'
            },
            {
                imageUrl: "happiness.png",
                heading: 'Happiness Quiz',
                link: '/HappinessQuiz'
            },
            {
                imageUrl: "internet.jpg",
                heading: 'Internet Usage Quiz',
                link: '/InternetUsageQuiz'
            },
            {
                imageUrl: "lifestyle.jpg",
                heading: 'Life Style',
                link: '/LifestyleQuiz'
            },
            {
                imageUrl: "motivation.avif",
                heading: 'MotivationQuiz',
                link: '/MotivationQuiz'
            },
            {
                imageUrl: "QOL.jpg",
                heading: 'Quality of Life',
                link: '/QualityOfLifeQuiz'
            },
            {
                imageUrl: "sleep.jpg",
                heading: 'Sleepometer',
                link: '/SleepQuiz'
            },
            {
                imageUrl: "social.jpg",
                heading: 'Social Relationship',
                link: '/SocialRelationshipQuiz'
            }
        ];

        if ((await Quiz.count()) === 0) {
            await Quiz.bulkCreate(quizzes);
            console.log('Quizzes seeded');
        }

        // Seed Testimonials
        const testimonials = [
            {
                testimony: "I had been pretty dissatisfied with myself, and there was a lot I wanted to change, but it all felt pretty overwhelming. That's when I decided to seek counseling. Although I was a bit reluctant in the beginning, Deepak Sir assured me that absolute privacy would be maintained. He helped me to become a better version of myself. It's not like it was a one-fix solution; it took many sessions and effort from both sides. But I can say that his help was crucial. I am pretty thankful to Deepak Sir and the whole Snehita Well-Being Team.",
                pic: "manav.jpg",
                name: "Manav Chauhan",
            },
            {
                testimony: " I recently had a session with my counselor, during which she addressed the root causes of my confusion. Her adept assistance enabled me to gain clarity and insight into the underlying issues that were bothering me. Through our discussion, I was able to untangle my thoughts and understand the factors troubling me.  I left the session feeling more grounded and empowered to address my challenges effectively.",
            },
            {
                testimony: "There was a time when I was dealing with a lot of things that were overwhelming, even in a supportive environment. That made me talk to Deepak Sir, a counsellor at Snehita Well Being (SBC), IIT Ropar. His nonjudgmental listening and insightful advice guided me through my emotional turmoil. I greatly appreciate his expertise, which gave me clarity and resilience.I encourage those who are hesitant to seek counsel not to be afraid. Genuine support is available, and seeking guidance from a therapist, friends, or family is completely normal. Let us normalize seeking help, and prioritizing our own well-being over the opinions of others is essential for living a fulfilled life.",
                pic: "katyayni.jpg",
                name: "Katyayni ",
            },
            {
                testimony: "I wanted to express my heartfelt gratitude for your incredible support during our counseling sessions. Your kindness, patience, and attentive listening have had a profound impact on my mental health. From the very first session, I felt a sense of relief and comfort in your presence. Your non-judgmental attitude and clear solutions have helped me overcome tough challenges. Thanks to you, I've experienced significant improvements in my well-being. Thank you for everything.",
            },
            {
                testimony: "When I joined college, there were a lot of changes going on in my life. A few things did not work out as planned for me, and this made me feel very helpless and hopeless. I thought that the situation wouldn't change. At that time, I did not believe in counseling and was doubtful about how a stranger could fix my problems. Despite this, I decided to give it a try. I was even hesitant to openly share my problems. Deepak sir understood this and gave me my space, and everything worked out for the best. I am really thankful to SWBC for helping me find a new outlook on my life.",
                pic: "mrinal.jpg",
                name: "Mrinal ",
            },
            {
                testimony: "I have been meeting Gargi mam for counselling sessions and she has been a great help to me. She listened to my problems and understood the underlying issues. Based on them she gave me the best possible advice and tips to tackle my feelings and situation and bring my life back onto track. My journey was full of ups and downs but I would remember the words said by her which would help me get out of my anxiety and get clarity of mind. She has been a great help in bringing my life back to normal, even though sometimes when I feel confused I still meet her for her valuable advice. I am very thankful to her.",
            }
        ];

        if ((await Testimonial.count()) === 0) {
            await Testimonial.bulkCreate(testimonials);
            console.log('Testimonials seeded');
        }

        // Seed Achievements
        const achievements = [
            {
                title: "Counselled 600+ students",
                description: "Snehita at IIT Ropar has offered counseling to over 600 students, playing a vital role in supporting their mental health, fostering a healthier campus environment.",
                image: "Counselling.jpg",
                order: 1,
                isActive: true
            },
            {
                title: "Solved 1000+ cases",
                description: "Snehita at IIT Ropar has made a positive impact on more than 1000 cases, nurturing a supportive environment and advancing overall well-being within the campus community.",
                image: "SolvedCases.jpg",
                order: 2,
                isActive: true
            },
            {
                title: "150+ Red Flagged cases",
                description: "Addressed and resolved over 150 red-flagged cases, showcasing Snehita's commitment to promoting a secure and thriving campus environment at IIT Ropar.",
                image: "RedFlagCases.jpg",
                order: 3,
                isActive: true
            }
        ];

        if ((await Achievement.count()) === 0) {
            await Achievement.bulkCreate(achievements);
            console.log('Achievements seeded');
        }

        // Seed Organization Info
        const organizationInfo = [
            {
                title: "About Snehita",
                description: "has been set up with the objective of providing assistance to the IIT Ropar fraternity for overall psychological well being, with a major focus to cater the mental health care and counselling needs of our individuals. With the intent to address and to help with resolving emotional and psychological issues of the individuals is the core aim of this cell. This cell encourages our students to understand themselves better and to enable them in solving their personal, emotional as well as psychological problems and also to facilitate positive changes in their overall growth and behaviour.\n\nWellbeing and Counselling services at IIT Ropar are a part of Student Support Service which comes under Student Affairs Section. The cell has been providing services like individual counselling on various psychological issues like academic anxiety, adjustment problems, depressive reactions, sleep difficulties, relationship concerns, confidence building, problem solving, decision making, unhealthy internet use, etc. We have a group of Student Volunteers known as our Snehita Buddies who are actively engaged in helping us in reaching out to the unreached and in conducting various promotional/educational activities on mental health. With the mix of reactive and proactive approach, Snehita Wellbeing Cell has proactively taken up the initiative of promoting the information & knowledge within the students, staff and faculty on various healthy issues in the form of online/offline talks, poster competitions, etc.\n\nEvery year Snehita-Well Being Cell conducts Induction/Orientation program for the fresher's both UG and PG students just to orient the new students about various challenges during the time of transitions from school to college and help them enable in how to deal with those challenges effectively. Also, this cell conducts various informative seminars and activities (online/offline) regularly with the help of prominent experts/consultants/faculties from medical colleges and academic institutes on Wellbeing, Quality of Life, and related to General Mental Health issues with the purpose of creating awareness among the Institute population.",
                type: "aboutSnehita"
            },
            {
                title: "Instagram",
                description: "https://www.instagram.com",
                type: "social_media"
            },
            {
                title: "Facebook",
                description: "https://www.facebook.com",
                type: "social_media"
            },
            {
                title: "LinkedIn",
                description: "https://www.linkedin.com",
                type: "social_media"
            }
        ];

        for (const info of organizationInfo) {
            const [record, created] = await OrganizationInfo.findOrCreate({
                where: { title: info.title },
                defaults: info
            });
            if (created) {
                console.log(`Seeded OrganizationInfo: ${info.title}`);
            }
        }

        // Seed Messages
        const messages = [
            {
                name: "Proff. Rajeev Ahuja",
                designation: "Director, IIT Ropar",
                image: "director.jpeg",
                messageContent: "Dear Students,\nAs we navigate through your academic journey together, it's important to remember that your wellness, both mental and physical, is paramount to us. Your well-being is not just a priority, but a cornerstone of our institute. We understand that the pressures of academic life, coupled with personal challenges, can sometimes feel overwhelming. That's why Snehita Wellbeing Cell is committed to providing you with the support and resources you need to thrive, both inside and outside the classroom.\nRemember, it's perfectly alright to ask for help. Whether you're feeling stressed, anxious, or simply need someone to talk to, know that there are caring individuals and services available to assist you. Reach out to our counselors, mentors, or any trusted faculty member. Your well-being matters to us, and as a team we are here to support you at every step of your academic journey.\nAdditionally, take time for self-care. Engage in activities that bring you joy and relaxation. Whether it's practicing mindfulness, exercising, or spending time with loved ones, nurturing your well-being is essential for your overall success and happiness. Prioritize your wellness and support one another in creating a positive and nurturing community at IIT Ropar.",
                emailId: "Take care of yourselves, and remember that you are not alone !",
                telephoneNo: "",
                type: "director",
                order: 1
            },
            {
                name: "Dr. Arun Kumar",
                designation: "Dean, Students Affairs",
                image: "arun.jpeg",
                messageContent: "प्रिय छात्रो,\nआप सभी की शैक्षेणिक यात्रा में, आपके संपूर्ण विकास और समृद्धि के लिए हमारा विभाग पर्तिबद्ध है। आपका मानसिक, शारीरिक और आत्मिक स्वास्थ्य हमारे लिए उतना ही महत्वपूर्ण है जितना कि शैक्षिक प्रदर्शन। हम समझते हैं कि छात्र जीवन में विभिन्न चुनौतियाँ और तनाव हो सकते हैं, और इसलिए हम सभी आपके समर्थन में पूरी तरह से समर्पित हैं। यदि आप किसी भी प्रकार की मदद या सहायता की जरूरत महसूस कर रहे हैं, तो कृपया हमसे संपर्क करें। हमारे काउंसलर, मेंटर्स और उपलब्ध संसाधनों से सहायता लें।\nइसके अलावा, स्वास्थ्य के लिए समय निकालें। मनोविश्राम, योग, ध्यान या किसी भी ऐसी गतिविधि में शामिल हों जो आपको सुख और संतुलन में रखती है। हम आपके साथ हैं, हमेशा।",
                emailId: "धूप में निकलो घटाओं में नहा कर देखो।",
                telephoneNo: "ज़िंदगी क्या है कुछ देर इंटरनेट और मोबाइल को हटा कर देखो।।",
                type: "dean",
                order: 1
            },
            {
                name: "Deepak Phogat",
                designation: "Counsellor",
                image: "deepak.jpg",
                messageContent: "We know that Campus life can be exhilarating, but it can also be overwhelming at times. Balancing coursework, extracurricular activities, social life, and personal responsibilities can put a strain on your mental health. That's why it's crucial to prioritize self-care and seek support when needed. Although after COVID, the attitude of individuals in society towards mental health is gradually changing positively. I feel as we navigate the challenges and responsibilities of academic life, it's essential to pause and reflect on our mental health and wellbeing. Your overall wellness is not just important; it's imperative for your success and happiness during your college journey.\n\nRemember that seeking help is a sign of strength, not weakness. Your mental health matters, and there's no shame in asking for support when you need it. Acknowledge your accomplishments, no matter how small, and forgive yourself for mistakes or setbacks. As your Institute Counsellor, my door is always open to you. Please don't hesitate to reach out if you need assistance or simply someone to talk to. Your wellbeing is our top priority, and we're here to support you every step of the way.",
                emailId: "deepak.phogat@iitrpr.ac.in",
                telephoneNo: "01881 23 5113",
                type: "counsellor",
                order: 1
            },
            {
                name: "Gargi Tiwary",
                designation: "Counsellor",
                image: "gargi.jpg",
                messageContent: "In light of the ongoing challenges we face, it is crucial now more than ever to prioritize your psychological wellbeing. Your mental health is just as important as your physical health, and we are here to support you every step of the way. If you're feeling overwhelmed, anxious, or stressed, please know that help is available. Reach out to our counselling services or mental health resources for guidance and support.\n\nTake care of yourself by practicing self-care routines, connecting with friends and family for emotional support, and engaging in activities that bring you joy and peace of mind. We are all in this together, and your mental health matters. Don't hesitate to seek help when needed - we are here for you. When Mind controls the body, It should matter!!!",
                emailId: "Gargi.tiwary@iitrpr.ac.in",
                telephoneNo: "01881 23 6855",
                type: "counsellor",
                order: 2
            }
        ];

        if ((await Message.count()) === 0) {
            await Message.bulkCreate(messages);
            console.log('Messages seeded');
        }

        // Seed Contact Details
        const contactDetails = [
            {
                location: "Snehita Well Being Cell",
                addressLine1: "Medical Centre",
                addressLine2: "Utility Block, Main Campus",
                addressLine3: "Indian Institute of Technology Ropar",
                city: "Rupnagar",
                state: "Punjab",
                country: "INDIA",
                postalCode: "140001",
                email: "snehita@iitrpr.ac.in",
                mapsLink: "https://www.google.com/maps/place/Medical+Center+-+IIT+Ropar/@30.9675395,76.4508513,15z/data=!4m10!1m2!2m1!1ssnehita+well+being+iit+ropar!3m6!1s0x3905542ff7523359:0x9550be661c7b2a95!8m2!3d30.9675395!4d76.4699057!15sChxzbmVoaXRhIHdlbGwgYmVpbmcgaWl0IHJvcGFykgEObWVkaWNhbF9jZW50ZXLgAQA!16s%2Fg%2F11fx_0kwpp?entry=ttu",
                isActive: true
            }
        ];

        if ((await ContactDetail.count()) === 0) {
            await ContactDetail.bulkCreate(contactDetails);
            console.log('Contact Details seeded');
        }

        // Seed Team Members
        const teamMembers = [
            // Dean
            {
                name: "Dr. Arun Kumar",
                designation: "Dean, Student Affairs",
                type: "dean",
                email: "arun.kumar@iitrpr.ac.in",
                telephoneNo: "01881 23 1066",
                image: "/uploads/team/arun.jpg",
                experience: "Dr. Arun Kumar received his PhD degree in Mathematics from IIT Bombay in 2012. He also holds a Master degree in Industrial Mathematics from IIT Roorkee. His PhD work is related to Subordinated Stochastic Processes that have applications in finance, fractional partial differential equations and statistical physics. During his stint in financial industry as a research analyst, he worked on all the major asset classes i.e. Fixed Income, Equity, Currency, and Commodity. Further, he possess a good experience in pricing and analysis of Bonds, Swaps, Total Return Swaps, Swap Curve Construction, Bonds Portfolio, Interest Rate Swaps Portfolio, Bond Futures, Cheapest to Deliver Calculations.",
                order: 1,
                isActive: true
            },
            // Faculty Advisors
            {
                name: "Dr. Satyam Agarwal",
                designation: "Faculty Advisor",
                type: "faculty_advisor",
                email: "satyam@iitrpr.ac.in",
                telephoneNo: "01881 23 22373",
                image: "/uploads/messages/satyam.jpg",
                academicDesignation: "Assistant Professor, Electrical Engineering",
                experience: "Dr. Satyam Agarwal, Assistant Professor at IIT Ropar's Department of Electrical Engineering, boasts a Ph.D. from IIT Delhi and extensive experience at IIT Guwahati and Politecnico di Torino. His research focuses on wireless communication networks, earning him accolades and research grants. As Faculty Advisor at Snehita Well-Being Cell, Dr. Agarwal prioritizes students' mental health. He supports organizing workshops, seminars, and counseling sessions to foster a supportive environment, encouraging open dialogue. His dedication ensures the Snehita Well-Being Cell remains a safe haven for IIT Ropar's student community.",
                message: [
                    "Snehita Wellbeing Cell aims to foster holistic mental wellbeing within the IIT Ropar community. Through various initiatives, we strive to raise awareness about mental health and empower students to prioritize their well-being. Our programs and sessions cater to this goal, including a yoga initiative launched last year to promote internal focus and physical wellness. Ultimately, our objective is to see students lead fulfilling lives. With the support of our counselors and Snehita buddies, we actively engage in raising awareness and promoting mental wellbeing throughout the community.",
                    "The mind governs our entire being, and its turmoil affects physical health. Strong bonds with friends, family, and mentors provide vital support for mental wellbeing. In today's digital age, fostering real-world connections is essential for happiness. Students are encouraged to step out of their comfort zones and engage with others. At Snehita Wellbeing Cell, we educate students on mental wellbeing and empower them to lead fulfilling lives. I invite everyone to join us in this exciting journey toward happiness and prosperity.",
                    "Thank You",
                    "Dr. Satyam Agarwal"
                ],
                order: 1,
                isActive: true
            },
            {
                name: "Dr. Parwinder Singh",
                designation: "Faculty Advisor",
                type: "faculty_advisor",
                email: "singh_parwinder@iitrpr.ac.in",
                telephoneNo: "01881 24 2275",
                image: "/uploads/messages/parwinder.jpg",
                academicDesignation: "Assistant Professor, Psychology",
                experience: "Dr. Parwinder Singh is a Counselling Psychologist specializing in mental health and well-being promotion. With a background including a PhD in Counselling Psychology, a PG Diploma in Counselling Psychology, and a Master's in Psychology, his research interest lies in promoting mental health and fostering supportive communities, aligning perfectly with the mission of the Snehita Well-Being Cell. As a member, he aims to raise awareness about the importance of sharing mental health concerns, provide effective resolutions, and cultivate an environment where seeking help is not stigmatized.",
                message: [
                    "In the pursuit of excellence, it's crucial to prioritize your mental health and well-being. Mental health matters just as much as your success in the desired domain. Please know that it's okay not to be okay. If you're struggling with stress, anxiety, depression, or any other mental health challenges, you are not alone. Reach out for support from friends, family, or mental health professionals.",
                    "Remember that seeking help is a sign of courage, not weakness. There is no shame in seeking help, and it's a sign of strength to prioritize your well-being. We all encounter challenges in life, and seeking assistance is a natural part of navigating them. We all need support and guidance to thrive. Together, let's foster a culture of understanding, compassion, and proactive care for mental health.",
                    "Thank You",
                    "Dr. Parwinder Singh"
                ],
                order: 2,
                isActive: true
            },
            // Counsellors
            {
                name: "Deepak Phogat",
                designation: "Counsellor",
                type: "counsellor",
                email: "deepak.phogat@iitrpr.ac.in",
                telephoneNo: "01881 23 5113",
                image: "/uploads/team/deepak.jpg",
                experience: "Deepak Phogat, the counselor at IIT Ropar since 2016, holds an M. Phil Clinical Psychology from PGIBAMS, Raipur, and is registered under the Rehabilitation Council of India, RCI - New Delhi, as a Clinical Psychologist. Alongside his M. Phil, Deepak has completed short-term certificate courses in Child Therapy, Adolescent Therapy, and Family Therapy from NIMHANS, Bangalore. With almost 8 years of experience, Deepak serves, facilitates, and encourages the young talented students at IIT Ropar, aiding them in solving their routine life challenges during their academic journey.",
                message: [
                    "We know that Campus life can be exhilarating, but it can also be overwhelming at times. Balancing coursework, extracurricular activities, social life, and personal responsibilities can put a strain on your mental health. That's why it's crucial to prioritize self-care and seek support when needed. Although after COVID, the attitude of individuals in society towards mental health is gradually changing positively. I feel as we navigate the challenges and responsibilities of academic life, it's essential to pause and reflect on our mental health and wellbeing. Your overall wellness is not just important; it's imperative for your success and happiness during your college journey.",
                    "Remember that seeking help is a sign of strength, not weakness. Your mental health matters, and there's no shame in asking for support when you need it. Acknowledge your accomplishments, no matter how small, and forgive yourself for mistakes or setbacks. As your Institute Counsellor, my door is always open to you. Please don't hesitate to reach out if you need assistance or simply someone to talk to. Your wellbeing is our top priority, and we're here to support you every step of the way.",
                    "Thank You",
                    "Deepak Phogat"
                ],
                order: 1,
                isActive: true
            },
            {
                name: "Gargi Tiwary",
                designation: "Counsellor",
                type: "counsellor",
                email: "Gargi.tiwary@iitrpr.ac.in",
                telephoneNo: "01881 23 6855",
                image: "/uploads/team/gargi.jpg",
                experience: "Gargi Tiwary holds an M.Sc. in Counseling Psychology from Christ University, Bangalore, and boasts rich experience working with individuals of all ages. With a focus on fostering psychological well-being and personal growth, she has conducted tailored workshops for diverse audiences including teachers, corporate professionals, and students. At IIT Bhilai, Gargi dedicated three years to community initiatives, engaging in various projects aimed at supporting students and staff. Now, at IIT Ropar, Gargi focuses on establishing meaningful connections with students. Through proactive measures like workshops and activities, she seeks insights into their concerns and needs, always aiming for solution-oriented approaches.",
                message: [
                    "In light of the ongoing challenges we face, it is crucial now more than ever to prioritize your psychological wellbeing. Your mental health is just as important as your physical health, and we are here to support you every step of the way. If you're feeling overwhelmed, anxious, or stressed, please know that help is available. Reach out to our counselling services or mental health resources for guidance and support.",
                    "Take care of yourself by practicing self-care routines, connecting with friends and family for emotional support, and engaging in activities that bring you joy and peace of mind. We are all in this together, and your mental health matters. Don't hesitate to seek help when needed - we are here for you. When Mind controls the body, It should matter!!!",
                    "Thank You",
                    "Gargi Tiwary"
                ],
                order: 2,
                isActive: true
            },
            // Snehita Buddies
            {
                name: "Krishna Kumar",
                designation: "Snehita Buddy",
                type: "buddy",
                email: "2021eeb1183@iitrpr.ac.in",
                telephoneNo: "7061614428",
                image: "/uploads/team/buddies/KRISHNAKUMAR.jpg",
                course: "B.Tech EE",
                order: 1,
                isActive: true
            },
            {
                name: "Katyayni Tiwari",
                designation: "Snehita Buddy",
                type: "buddy",
                email: "katyayni.20phz0008@iitrpr.ac.in",
                telephoneNo: "8076896179",
                image: "/uploads/team/buddies/KATYAYNITIWARI.jpg",
                course: "Ph.D. Physics",
                instaId: "https://www.instagram.com/tkatyayni/",
                order: 2,
                isActive: true
            },
            {
                name: "Aswathi Prakash",
                designation: "Snehita Buddy",
                type: "buddy",
                email: "aswathi.19hsz0013@iitrpr.ac.in",
                telephoneNo: "8187029090",
                image: "/uploads/team/buddies/AswathiPrakash.jpg",
                course: "Ph.D",
                instaId: "https://www.instagram.com/aswathiprakash161/",
                order: 3,
                isActive: true
            },
            {
                name: "Arnav Kharbanda",
                designation: "Snehita Buddy",
                type: "buddy",
                email: "2021csb1072@iitrpr.ac.in",
                telephoneNo: "7011195216",
                image: "/uploads/team/buddies/ARNAVKHARBANDA.jpg",
                course: "B.Tech CSE",
                order: 4,
                isActive: true
            },
            {
                name: "Nishant Yadav",
                designation: "Snehita Buddy",
                type: "buddy",
                email: "2023cem1026@iitrpr.ac.in",
                telephoneNo: "8209905879",
                image: "/uploads/team/buddies/NishantYadav.jpg",
                course: "M.Tech Civil",
                order: 5,
                isActive: true
            },
            {
                name: "Vijay K Vaishampayan",
                designation: "Snehita Buddy",
                type: "buddy",
                email: "vijay.21chz0008@iitrpr.ac.in",
                telephoneNo: "9834491331",
                image: "/uploads/team/buddies/VijayVaishampayan.jpg",
                course: "PhD Chemical",
                instaId: "https://www.instagram.com/vijayvaishampayan/",
                order: 6,
                isActive: true
            },
            {
                name: "Bhushan Vanjiwale",
                designation: "Snehita Buddy",
                type: "buddy",
                email: "2023dss1011@iitrpr.ac.in",
                telephoneNo: "7506262213",
                image: "/uploads/team/buddies/BhushanVanjiwale.jpg",
                course: "M.Sc DS And Manag.",
                order: 7,
                isActive: true
            },
            {
                name: "Manav Chauhan",
                designation: "Snehita Buddy",
                type: "buddy",
                email: "2021csb1108@iitrpr.ac.in",
                telephoneNo: "7877072667",
                image: "/uploads/team/buddies/MANAVCHAUHAN.jpg",
                course: "B.Tech CSE",
                order: 8,
                isActive: true
            },
            {
                name: "Sneha Shah",
                designation: "Snehita Buddy",
                type: "buddy",
                email: "2021mcb1368@iitrpr.ac.in",
                telephoneNo: "8868070206",
                image: "/uploads/team/buddies/SnehaShah.jpg",
                course: "B.Tech MnC",
                instaId: "https://www.instagram.com/happyfeet.iitropar/",
                order: 9,
                isActive: true
            },
            {
                name: "Aditya Badoni",
                designation: "Snehita Buddy",
                type: "buddy",
                email: "2022cem1001@iitrpr.ac.in",
                telephoneNo: "7302476127",
                image: "/uploads/team/buddies/AdityaBadoni.jpg",
                course: "M.tech Civil",
                order: 10,
                isActive: true
            },
            {
                name: "Shivam Kainth",
                designation: "Snehita Buddy",
                type: "buddy",
                email: "shivam.20csz0006@iitrpr.ac.in",
                telephoneNo: "7650024500",
                image: "/uploads/team/buddies/ShivamKainth.jpg",
                course: "Ph.D. CSE",
                instaId: "https://www.instagram.com/real.shivamk/",
                order: 11,
                isActive: true
            },
            {
                name: "Shyam Patil",
                designation: "Snehita Buddy",
                type: "buddy",
                email: "patilshyam079@gmail.com",
                telephoneNo: "7769005407",
                image: "/uploads/team/buddies/ShyamPatil.jpg",
                course: "B.Tech",
                order: 12,
                isActive: true
            },
            {
                name: "Ankush",
                designation: "Snehita Buddy",
                type: "buddy",
                email: "ankush.21eez0009@iitrpr.ac.in",
                telephoneNo: "7018545213",
                image: "/uploads/team/buddies/Ankush.jpg",
                course: "PhD EE",
                instaId: "https://www.instagram.com/edmaholic/",
                order: 13,
                isActive: true
            },
            {
                name: "Mayank Kumar",
                designation: "Snehita Buddy",
                type: "buddy",
                email: "2020chb1045@iitrpr.ac.in",
                telephoneNo: "7479825017",
                image: "/uploads/team/buddies/MAYANKKUMAR.jpg",
                course: "B.Teh Chemical",
                order: 14,
                isActive: true
            },
            {
                name: "Piyush Kumar",
                designation: "Snehita Buddy",
                type: "buddy",
                email: "2021csb1123@iitrpr.ac.in",
                telephoneNo: "8960104181",
                image: "/uploads/team/buddies/PiyushKumar.jpg",
                course: "B.Tech CSE",
                order: 15,
                isActive: true
            },
            {
                name: "Shrenik Nandre",
                designation: "Snehita Buddy",
                type: "buddy",
                email: "2023dss1032@iitrpr.ac.in",
                telephoneNo: "9980333631",
                image: "/uploads/team/buddies/ShrenikNandre.jpg",
                course: "M.Sc DS and Manag.",
                order: 16,
                isActive: true
            },
            {
                name: "Mrinal Maurya",
                designation: "Snehita Buddy",
                type: "buddy",
                email: "2022mmb1386@iitrpr.ac.in",
                telephoneNo: "8409344447",
                image: "/uploads/team/buddies/MrinalMaurya.jpg",
                course: "B.Tech MME",
                order: 17,
                isActive: true
            }
        ];

        if ((await TeamMember.count()) === 0) {
            // Ensure message arrays are stored as JSON strings (TEXT column)
            const prepared = teamMembers.map(tm => {
                const copy = { ...tm };
                if (copy.message && typeof copy.message !== 'string') {
                    try { copy.message = JSON.stringify(copy.message); } catch (e) { copy.message = null; }
                }
                return copy;
            });
            await TeamMember.bulkCreate(prepared);
            console.log('Team Members seeded');
        }

        // Seed Counselors - User/Role/Counselor with encrypted password
        const counselorTargets = [
            { name: "Deepak Phogat", email: "deepak.phogat@iitrpr.ac.in" },
            { name: "Gargi Tiwary", email: "Gargi.tiwary@iitrpr.ac.in" }
        ];

        for (const t of counselorTargets) {
            // 1. Ensure User
            let user = await User.findOne({ where: { email: t.email } });
            if (!user) {
                // Determine password - default or specific? Using Snehita@123 as default
                const passwordHash = await bcrypt.hash("Snehita@123", 10);
                await User.create({
                    person_name: t.name,
                    email: t.email,
                    password: passwordHash
                }, { hooks: false }); // Bypass hook to avoid double hashing if it were to run
                console.log(`Seeded User: ${t.name}`);
            }

            // 2. Ensure Role
            let role = await Role.findOne({ where: { email: t.email } });
            if (!role) {
                await Role.create({
                    email: t.email,
                    role: 'counselor'
                });
                console.log(`Seeded Role for: ${t.name}`);
            }

            // 3. Ensure Counselor
            let counselor = await Counselor.findOne({ where: { email: t.email } });
            if (!counselor) {
                await Counselor.create({
                    name: t.name,
                    email: t.email
                });
                console.log(`Seeded Counselor Config for: ${t.name}`);
            }
        }

        console.log('Seeding complete');

        // Close database connection
        await sequelize.close();
    } catch (error) {
        console.error('Seeding failed:', error);
        // Close connection even on error
        try {
            await sequelize.close();
        } catch (closeError) {
            console.error('Error closing database:', closeError);
        }
        throw error;
    }
};

module.exports = seedData; // Exporting, or can run directly if called as a script
// If running standalone, uncomment below and ensure check db connection
if (require.main === module) {
    seedData()
        .then(() => {
            console.log('Seed script completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Seed script failed:', error);
            process.exit(1);
        });
}
