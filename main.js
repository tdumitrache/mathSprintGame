const questionContainer = document.querySelector('.questions');
const questions = document.querySelectorAll('.question');
const startButton = document.querySelector('#start-button');

const countdownContainer = document.querySelector('.countdown-container');
const countdown = document.querySelector('.countdown');

const itemsContainer = document.querySelector('.items-container');
const buttons = document.querySelector('.buttons');
const wrongButton = document.querySelector('.wrong');
const rightButton = document.querySelector('.right');

const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty');
const finalTimeEl = document.querySelector('.your-score');

const conclusionContainer = document.querySelector('.conclusion-container');
const playAgainButton = document.querySelector('.play-again');

const bestScoreEl = document.querySelectorAll('.best-score');

let questionAmount = 0;
let equationsArr = [];
const wrongFormat = [];
let playerGuessings = [];
let bestScoreArr = [];

let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finaltime = 0;
let finalTimeDisplay = '0.0';

function bestScoresToDOM() {
    bestScoreArr.forEach((element, index) => {
        bestScoreEl[index].innerText = `${element.bestScore}s`;
    });
}


function getSavedBestScores() {
    if (localStorage.getItem('bestScores')) {
        bestScoreArr = JSON.parse(localStorage.getItem('bestScores'));
    } else {
        bestScoreArr = [
            { questions: 10, bestScore: finalTimeDisplay },
            { questions: 25, bestScore: finalTimeDisplay },
            { questions: 50, bestScore: finalTimeDisplay },
            { questions: 99, bestScore: finalTimeDisplay },
        ];
        localStorage.setItem('bestScores', JSON.stringify(bestScoreArr));
        
    }
    bestScoresToDOM();
}



function scoresToDOM() {
    finalTimeDisplay = finalTime.toFixed(1);
    finalTimeDisplay = finalTime.toFixed(1);
    baseTime = timePlayed.toFixed(1);
    penaltyTime = penaltyTime.toFixed(1);
    baseTimeEl.textContent = `Base Time: ${baseTime}s`;
    penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`;
    finalTimeEl.textContent = `${finalTimeDisplay}s`;
    updateBestScore();
    showScorePage();
}

function updateBestScore() {
    bestScoreArr.forEach((score, index) => {
        if (questionAmount === score.questions) {
            const savedBestScore = Number(bestScoreArr[index].bestScore);
            
            if (savedBestScore === 0 || savedBestScore < finaltime) {
                bestScoreArr[index].bestScore = finalTimeDisplay;
            }
        }
        
    });

    bestScoresToDOM();
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArr));
}

function checkTime() {
    if (playerGuessings.length === questionAmount) {
        clearInterval(timer);
        
        equationsArr.forEach((equation, index) => {
            if (equation.evaluated !== playerGuessings[index]) {
                penaltyTime += 0.5;
            }
        });
        finalTime = timePlayed + penaltyTime;
        updateBestScore();
        scoresToDOM();
        showScorePage();
        removeEquations();
        playerGuessings = [];
    }
}

function addTime() {
    timePlayed += 0.1;
    checkTime();
}

function startTimer() {
    timePlayed = 0;
    penaltyTime = 0;
    finalTime = 0;

    timer = setInterval(addTime, 100);
    buttons.removeEventListener('click', startTimer);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function createEquations() {
    const correctEquations = getRandomInt(questionAmount);
    const wrongEquations = questionAmount - correctEquations;
    
    for (let i = 0 ; i < correctEquations ; i++) {
        const firstNumber = getRandomInt(9);
        const secondNumber = getRandomInt(9);
        const equationValue = firstNumber * secondNumber;
        const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
        const equationObject = {value: equation, evaluated: 'true'};
        equationsArr.push(equationObject);
    }

    for (let i = 0 ; i < wrongEquations; i++) {
        const firstNumber = getRandomInt(9);
        const secondNumber = getRandomInt(9);
        const equationValue = firstNumber * secondNumber;

        wrongFormat[0] = `${firstNumber + 7} x ${secondNumber} = ${equationValue}`;
        wrongFormat[1] = `${firstNumber} x ${secondNumber + 7} = ${equationValue}`;
        wrongFormat[2] = `${firstNumber} x ${secondNumber} = ${equationValue + 7}`;

        const index = getRandomInt(3);

        const equation = wrongFormat[index];
        const equationObject = { value: equation, evaluated: 'false'};
        equationsArr.push(equationObject);
    }
    shuffle(equationsArr);
    equationsToDOM();
}

function removeEquations() {
    itemsContainer.innerHTML = '';
}

function equationsToDOM() {
    equationsArr.forEach(equation => {
        const item = document.createElement('div');
        item.classList.add('item');
        const equationText = document.createElement('h1');
        equationText.innerText = equation.value;
        item.append(equationText);
        itemsContainer.append(item);
    });
    equationsArr = [];
    itemsContainer.children[0].classList.add('selected');
}

function threeTwoOneGo() {
    countdown.innerText = '3';

    setTimeout(() => {
        countdown.innerText = '2';
    }, 1000);

    setTimeout(() => {
        countdown.innerText = '1';
    }, 2000);

    setTimeout(() => {
        countdown.innerText = 'GO!';
    }, 3000);
}

function showScorePage() {
    itemsContainer.style.display = 'none';
    buttons.style.display = 'none';
    conclusionContainer.style.display = 'flex';
    playAgainButton.style.display = 'block';   
}

function showGamePage() {
    countdownContainer.style.display = 'none';
    startButton.style.display = 'none';
    itemsContainer.style.display = 'block';
    buttons.style.display = 'block';
}

function showCountdown() {
    questionContainer.style.display = 'none';
    countdownContainer.style.display = 'flex';
    startButton.style.display = 'none';
    threeTwoOneGo();
    createEquations();
    setTimeout(showGamePage, 4000);
}

function showQuestionsSelect() {
    conclusionContainer.style.display = 'none';
    playAgainButton.style.display = 'none';
    questionContainer.style.display = 'flex';
    startButton.style.display = 'block';
    refreshSettings();
}

questionContainer.addEventListener('click', (e) => {
    if (e.target.className === 'question') {
        questions.forEach(question => {
            question.classList.remove('checked');
        });
        e.target.classList.add('checked');
        questionAmount = Number(e.target.children[0].innerText.slice(0, 2));
    }
});

startButton.addEventListener('click', () => {
    if (questionAmount === 0) {
        alert('Please select a test!');
    } else {
        showCountdown();
    }
});

function handlePlayerResponse(response) {
    let itemsArr = document.querySelectorAll('.item');
    playerGuessings.push(response);
    itemsArr[0].remove();
    if (itemsArr[1] !== undefined) {
        itemsArr[1].classList.add('selected');
    }
    console.log(playerGuessings.length, questionAmount)
}

function refreshSettings() {
    buttons.addEventListener('click', startTimer);
    equationsArr = [];
    playerGuessings = [];
}

wrongButton.addEventListener('click', () => handlePlayerResponse('false'));
rightButton.addEventListener('click', () => handlePlayerResponse('true'));
playAgainButton.addEventListener('click', showQuestionsSelect);

buttons.addEventListener('click', startTimer);

getSavedBestScores();




