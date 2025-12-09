// Liste de mots
const WORDS = {
  easy: ['chat','chien','soleil','lune','pomme','arbre','bouche'],
  medium: ['ordinateur','javascript','tunisie','université','paysage','montagne'],
  hard: ['cryptographie','asynchronisme','microcontrôleur','algorithme','virtualisation']
};

const maxWrong = 6;
let secret = '';
let guessed = new Set();
let wrong = 0;

// Elements
const wordEl = document.getElementById('word');
const lettersEl = document.getElementById('letters');
const wrongCountEl = document.getElementById('wrongCount');
const messageEl = document.getElementById('message');
const scoreEl = document.getElementById('score');
const newGameBtn = document.getElementById('newGame');
const difficultySelect = document.getElementById('difficulty');
document.getElementById('maxWrong').textContent = maxWrong;

// Sons
const audioCorrect = document.getElementById('audio-correct');
const audioWrong = document.getElementById('audio-wrong');
const audioWin = document.getElementById('audio-win');
const audioLose = document.getElementById('audio-lose');

function pickWord() {
  const level = difficultySelect.value;
  const arr = WORDS[level] || WORDS.medium;
  return arr[Math.floor(Math.random() * arr.length)];
}

function drawHangman() {
  const svg = document.getElementById('hangman');
  svg.innerHTML = '';
  svg.innerHTML += `<line x1="10" y1="135" x2="110" y2="135" stroke="#9fb8ff" stroke-width="4" stroke-linecap="round"/>`;
  svg.innerHTML += `<line x1="30" y1="135" x2="30" y2="15" stroke="#9fb8ff" stroke-width="4" stroke-linecap="round"/>`;
  svg.innerHTML += `<line x1="30" y1="15" x2="80" y2="15" stroke="#9fb8ff" stroke-width="4" stroke-linecap="round"/>`;
  svg.innerHTML += `<line x1="80" y1="15" x2="80" y2="30" stroke="#9fb8ff" stroke-width="4" stroke-linecap="round"/>`;

  if(wrong>0) svg.innerHTML += `<circle cx="80" cy="40" r="10" stroke="#cfe3ff" stroke-width="3" fill="transparent"/>`;
  if(wrong>1) svg.innerHTML += `<line x1="80" y1="50" x2="80" y2="85" stroke="#cfe3ff" stroke-width="3"/>`;
  if(wrong>2) svg.innerHTML += `<line x1="80" y1="60" x2="65" y2="75" stroke="#cfe3ff" stroke-width="3"/>`;
  if(wrong>3) svg.innerHTML += `<line x1="80" y1="60" x2="95" y2="75" stroke="#cfe3ff" stroke-width="3"/>`;
  if(wrong>4) svg.innerHTML += `<line x1="80" y1="85" x2="70" y2="105" stroke="#cfe3ff" stroke-width="3"/>`;
  if(wrong>5) svg.innerHTML += `<line x1="80" y1="85" x2="90" y2="105" stroke="#cfe3ff" stroke-width="3"/>`;
}

function renderWord() {
  wordEl.innerHTML = '';
  for(const ch of secret){
    const box = document.createElement('div');
    box.className = 'letter-box';
    box.textContent = guessed.has(ch) ? ch.toUpperCase() : '';
    wordEl.appendChild(box);
  }
}

function createKeyboard() {
  lettersEl.innerHTML = '';
  const AZ = 'abcdefghijklmnopqrstuvwxyz'.split('');
  for(const l of AZ){
    const b = document.createElement('div');
    b.className = 'key';
    b.textContent = l.toUpperCase();
    b.dataset.letter = l;
    b.addEventListener('click', ()=> handleGuess(l));
    lettersEl.appendChild(b);
  }
}

function handleGuess(letter){
  if(guessed.has(letter) || wrong>=maxWrong) return;
  guessed.add(letter);
  if(secret.includes(letter)){
    audioCorrect.play();
  } else {
    wrong++;
    wrongCountEl.textContent = wrong;
    audioWrong.play();
  }
  updateKeys();
  drawHangman();
  renderWord();
  checkEnd();
}

function updateKeys(){
  for(const k of lettersEl.querySelectorAll('.key')){
    const l = k.dataset.letter;
    k.classList.toggle('disabled', guessed.has(l));
  }
}

function checkEnd(){
  const allRevealed = [...secret].every(ch => guessed.has(ch));
  let score = 0;
  if(allRevealed){
    messageEl.textContent = 'Gagné ! 🎉';
    audioWin.play();
    score = [...secret].filter(ch => guessed.has(ch)).length*10 - wrong*5;
  } else if(wrong>=maxWrong){
    messageEl.textContent = `Perdu — le mot était: ${secret.toUpperCase()}`;
    audioLose.play();
    score = 0;
  }
  scoreEl.textContent = `Score: ${score}`;
}

function newGame(){
  secret = pickWord();
  guessed = new Set();
  wrong = 0;
  wrongCountEl.textContent = wrong;
  messageEl.textContent = '';
  scoreEl.textContent = '';
  createKeyboard();
  renderWord();
  drawHangman();
}

// Keypress clavier
window.addEventListener('keydown', e=>{
  const k = e.key.toLowerCase();
  if(k.length===1 && k>='a' && k<='z') handleGuess(k);
});

newGameBtn.addEventListener('click', newGame);
difficultySelect.addEventListener('change', newGame);

// Initialisation
createKeyboard();
renderWord();
drawHangman();