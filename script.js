let currentQuiz = [];
let currentQuestionIndex = 0;
let score = {};
const characterInfo = {
    "Spider-Man": {
        description: "You’re witty, kind-hearted, and always try to do the right thing — even when it’s hard.",
        image: "assets/avatars/spiderman.png"
    },
    "Iron Man": {
        description: "You’re a brilliant innovator with a sharp tongue and a heart of gold buried under your tech.",
        image: "assets/avatars/ironman.png"
    },
    "Captain America": {
        description: "You lead with honor, protect others, and never back down from what’s right.",
        image: "assets/avatars/captainamerica.png"
    },
    "Thor": {
        description: "You’re powerful, loyal, and destined for greatness — even if you joke around along the way.",
        image: "assets/avatars/thor.png"
    },
    "Black Panther": {
        description: "You’re calm, strategic, and a natural-born leader who values wisdom and tradition.",
        image: "assets/avatars/blackpanther.png"
    },
    "Doctor Strange": {
        description: "You’re intelligent, curious, and willing to break the rules to protect others.",
        image: "assets/avatars/doctorstrange.png"
    },
    "Wolverine": {
        description: "You’re intense, protective, and secretly more loyal than you let on.",
        image: "assets/avatars/wolverine.png"
    },
    "Scarlet Witch": {
        description: "You’re powerful, emotional, and driven by love — but you must keep your power in balance.",
        image: "assets/avatars/scarletwitch.png"
    },
    "Deadpool": {
        description: "You’re wild, unpredictable, and hilarious — but there’s more heart in you than people think.",
        image: "assets/avatars/deadpool.png"
    },
    "Black Widow": {
        description: "You’re quiet, brilliant, and capable of handling anything thrown your way.",
        image: "assets/avatars/blackwidow.png"
    }
};


function startQuiz() {
    currentQuiz = [
        {
            question: "How do you approach conflict",
            options: [
                { text: "With your fists", trait: ["Thor, Wolverine"] },
                { text: "With jokes", trait: ["Spider-Man, Deadpool"] },
                { text: "With calmed control", trait: ["Doctor Strange, Black Widow"] },
                { text: "With strategy", trait: ["Iron Man, Black Panther"] }
            ]
        },
        {
            question: "What scares you the most?",
            options: [
                { text: "Failing people who depend on you", trait: ["Captain America, Spider-Man"] },
                { text: "Letting down your legacy", trait: ["Iron Man, Black Panther, Thor"] },
                { text: "Losing control", trait: ["Hulk, Scarlet Witch, Wolverine"] },
                { text: "Being vulnerable or emotional", trait: ["Deadpool, Black Widow"] }
            ]
        },
        {
            question: "What’s your greatest flaw?",
            options: [
                { text: "Anger issues", trait: ["Scarlet Witch, Wolverine"] },
                { text: "Emotional detachment", trait: ["Deadpool, Black Widow"] },
                { text: "Arrogance", trait: ["Thor, Doctor Strange, Iron Man"] },
                { text: "Overthinking and guilt", trait: ["Spider-Man, Captain America"] }

            ]
        },
        {
            question: "What’s your biggest strength?",
            options: [
                { text: "Bravery & selflessness", trait: ["Captain America, Black Panther"] },
                { text: "Raw power & emotion", trait: ["Thor, Scarlet Witch, Wolverine"] },
                { text: "Intelligence & creativity ", trait: ["Doctor Strange, Iron Man"] },
                { text: "Humor & agility", trait: ["Spider-Man, Deadpool"] }

            ]
        },
        {
            question: "What’s your ideal Friday night?",
            options: [
                { text: "Patrolling the streets", trait: ["Spider-Man, Black Widow"] },
                { text: "Reading mystical books", trait: ["Doctor Strange, Scarlet Witch"] },
                { text: "Training in the wilderness ", trait: ["Wolverine, Thor"] },
                { text: "Tinkering in your lab", trait: ["Iron Man"] }

            ]
        },
        {
            question: "What kind of leader are you (or would be)?",
            options: [
                { text: "Quiet, leading by example", trait: ["Black Widow, Thor"] },
                { text: "Rebellious but effective", trait: ["Deadpool, Wolverine"] },
                { text: "Logical and assertive ", trait: ["Iron Man, Doctor Strange"] },
                { text: "Tactical and commanding", trait: ["Captain America, Black Panther"] }

            ]
        },
        {
            question: "What is your weapon of choice?:",
            options: [
                { text: "Stealth and agility", trait: ["Black Widow, Spider-Man"] },
                { text: "High-tech gear", trait: ["Iron Man, Black Panther"] },
                { text: "Pure strength and instinct", trait: ["Wolverine, Thor"] },
                { text: "Magic and spells", trait: ["Doctor Strange, Scarlet Witch"] }

            ]
        }

        

    ];

    currentQuestionIndex = 0;
    score = {};

    document.getElementById('quiz-selection').style.display = 'none';

    showNextQuestion();
}

function showNextQuestion() {
    const quizSection = document.getElementById('quiz-selection');
    quizSection.innerHTML = '';

    if (currentQuestionIndex >= currentQuiz.length) {
        return showResult();
    }

    const q = currentQuiz[currentQuestionIndex];

    const questionEl = document.createElement('h2');
    questionEl.textContent = q.question;
    quizSection.appendChild(questionEl);

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt.text;
        btn.onclick = () => {
            opt.trait.split(",").forEach(trait => {
                const trimmedTrait = trait.trim();
                score[trimmedTrait] = (score[trimmedTrait] || 0) + 1;
            });
            currentQuestionIndex++;
            showNextQuestion();
        };
        quizSection.appendChild(btn);
    });

    quizSection.style.display = 'block';
}

function showResult() {
    const quizSection = document.getElementById('quiz-selection');
    quizSection.innerHTML = '';

    const highest = Object.entries(score).reduce((a, b) => (b[1] > a[1] ? b : a))[0];

    const info = characterInfo[highest];

    quizSection.innerHTML = `
        <h2>You are most like: ${highest}!</h2>
        <img src="${info.image}" alt="${highest}" style="width:200px;height:auto;">
        <p>${info.description}</p>
    `;

    document.getElementById('game-preview').style.display = 'block';
}

function startGame() {
    alert("The game will now begin using your avatar traits!");
}