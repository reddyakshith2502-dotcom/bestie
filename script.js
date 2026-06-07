// --- Mobile Drawer Menu ---
const burgerMenu = document.getElementById('burger-menu');
const mobileNav = document.getElementById('mobile-nav');
const mobileLinks = document.querySelectorAll('.mobile-link');

burgerMenu.addEventListener('click', () => {
  mobileNav.classList.toggle('active');
  burgerMenu.classList.toggle('toggle');
});

// Close mobile menu on link click
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('active');
    burgerMenu.classList.remove('toggle');
  });
});

// --- Scroll Reveal Animation (Intersection Observer) ---
const revealElements = document.querySelectorAll('.reveal-on-scroll');

const revealOnScrollActive = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Optional: stop observing once revealed
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach((el) => observer.observe(el));
};

document.addEventListener('DOMContentLoaded', revealOnScrollActive);


// --- Polaroid Lightbox Gallery ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');

// Gallery images array matching the polaroid index
const galleryImages = [
  { src: 'assets/memory_polaroid_1.jpg', caption: 'Coffee & Code Chats ☕' },
  { src: 'assets/memory_polaroid_2.jpg', caption: "Exploring Life's Paths 🌅" },
  { src: 'assets/memory_polaroid_3.jpg', caption: 'Celebrating the Wins ✨' }
];

function openLightbox(index) {
  lightbox.style.display = 'flex';
  lightboxImg.src = galleryImages[index].src;
  lightboxCaption.innerHTML = galleryImages[index].caption;
  document.body.style.overflow = 'hidden'; // Stop page scroll
}

function closeLightbox() {
  lightbox.style.display = 'none';
  document.body.style.overflow = 'auto'; // Restore page scroll
}


// --- HTML5 Canvas Confetti System ---
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let confettiParticles = [];
let animationFrameId = null;

// Resize canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class ConfettiParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 8 + 6;
    this.color = this.getRandomColor();
    this.speedX = Math.random() * 8 - 4;
    this.speedY = Math.random() * -10 - 5; // Launch upward
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 10 - 5;
    this.gravity = 0.25;
    this.opacity = 1;
    this.fadeSpeed = Math.random() * 0.01 + 0.005;
  }

  getRandomColor() {
    // Balanced professional-sweet color palette: warm rose, gold, soft pink, ocean blue, violet
    const colors = ['#ff8da1', '#e05a70', '#ffeef1', '#2e3d52', '#ffd166', '#a5a6f6', '#4ea8de'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += this.gravity;
    this.rotation += this.rotationSpeed;
    this.opacity -= this.fadeSpeed;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    // Draw small rectangle particles
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 1.5);
    ctx.restore();
  }
}

class TrailParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 4 + 2;
    this.color = this.getRandomColor();
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * -1.5 - 0.5; // Float slowly upward
    this.opacity = 0.8;
    this.fadeSpeed = Math.random() * 0.015 + 0.01;
  }

  getRandomColor() {
    const colors = ['rgba(255, 141, 161, 0.75)', 'rgba(255, 209, 102, 0.75)', 'rgba(255, 255, 255, 0.8)', 'rgba(165, 166, 246, 0.75)'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity -= this.fadeSpeed;
  }

  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.shadowBlur = 6;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.restore();
  }
}

// Add mousemove trail spawning
let mouseMoveThrottle = 0;
document.addEventListener('mousemove', (e) => {
  mouseMoveThrottle++;
  if (mouseMoveThrottle % 3 !== 0) return; // Spawn trail every 3rd event for performance

  confettiParticles.push(new TrailParticle(e.clientX, e.clientY));
  
  if (!animationFrameId) {
    animateConfetti();
  }
});

function startConfettiBlast() {
  // Blast originating from different parts of the screen
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // Left side blast
  for (let i = 0; i < 60; i++) {
    confettiParticles.push(new ConfettiParticle(width * 0.2, height * 0.8));
  }
  
  // Right side blast
  for (let i = 0; i < 60; i++) {
    confettiParticles.push(new ConfettiParticle(width * 0.8, height * 0.8));
  }

  if (!animationFrameId) {
    animateConfetti();
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  confettiParticles.forEach((particle, index) => {
    particle.update();
    particle.draw();
    if (particle.opacity <= 0 || particle.y > canvas.height) {
      confettiParticles.splice(index, 1);
    }
  });

  if (confettiParticles.length > 0) {
    animationFrameId = requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animationFrameId = null;
  }
}


// --- Interactive Trivia Quiz ---
const triviaQuestions = [
  {
    question: "Who is more likely to reply to messages at 3 AM?",
    options: ["You (undoubtedly)", "Me (coding bugs)", "Both of us (insomniacs)", "Neither (we value sleep)"],
    correctIndex: 1, // Me
    explanation: "Yup! I'm usually awake debugging code or scrolling through Reels."
  },
  {
    question: "What is our primary mode of communication?",
    options: ["Professional and polite talks", "Sarcasm, memes & random roasts", "Endless voicemail rants", "Strictly code reviews"],
    correctIndex: 1, // Sarcasm & memes
    explanation: "100% correct! Sarcasm is our official second language."
  },
  {
    question: "How long is this best friends contract valid for?",
    options: ["Until next month", "Until one of us gets busy", "Lifetime membership (No cancellation allowed)", "Depends on the meme quality"],
    correctIndex: 2, // Lifetime
    explanation: "Correct! You are locked in. No refund, no return, no cancellation."
  }
];

let currentQuestionIndex = 0;
let score = 0;

const questionEl = document.getElementById('quiz-question');
const optionsContainer = document.getElementById('quiz-options');
const stepCountEl = document.getElementById('quiz-step-count');
const nextBtn = document.getElementById('quiz-next-btn');
const quizCard = document.getElementById('quiz-card');
const resultCard = document.getElementById('quiz-result-card');
const progressBar = document.getElementById('quiz-progress');

function loadQuestion() {
  const currentQuestion = triviaQuestions[currentQuestionIndex];
  questionEl.textContent = currentQuestion.question;
  optionsContainer.innerHTML = '';
  nextBtn.style.display = 'none';

  // Update progress bar
  const progressPercentage = ((currentQuestionIndex + 1) / triviaQuestions.length) * 100;
  progressBar.style.width = `${progressPercentage}%`;

  // Update step count text
  stepCountEl.textContent = `Question ${currentQuestionIndex + 1} of ${triviaQuestions.length}`;

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'quiz-option-btn';
    button.innerHTML = `<span>${option}</span><i class="fa-regular fa-circle"></i>`;
    button.addEventListener('click', () => selectOption(index, button));
    optionsContainer.appendChild(button);
  });
}

function selectOption(selectedIndex, selectedBtn) {
  const currentQuestion = triviaQuestions[currentQuestionIndex];
  const allButtons = optionsContainer.querySelectorAll('.quiz-option-btn');

  // Disable all options once one is chosen
  allButtons.forEach(btn => btn.style.pointerEvents = 'none');

  if (selectedIndex === currentQuestion.correctIndex) {
    score++;
    selectedBtn.classList.add('correct');
    selectedBtn.querySelector('i').className = 'fa-solid fa-circle-check';
    // Small confetti pop for correct answer
    for (let i = 0; i < 15; i++) {
      confettiParticles.push(new ConfettiParticle(selectedBtn.getBoundingClientRect().left + selectedBtn.offsetWidth / 2, selectedBtn.getBoundingClientRect().top));
    }
    if (!animationFrameId) animateConfetti();
  } else {
    selectedBtn.classList.add('incorrect');
    selectedBtn.querySelector('i').className = 'fa-solid fa-circle-xmark';
    
    // Highlight the correct one
    allButtons[currentQuestion.correctIndex].classList.add('correct');
    allButtons[currentQuestion.correctIndex].querySelector('i').className = 'fa-solid fa-circle-check';
  }

  // Show Next button or Finish
  nextBtn.style.display = 'inline-flex';
  if (currentQuestionIndex === triviaQuestions.length - 1) {
    nextBtn.innerHTML = 'Finish <i class="fa-solid fa-flag-checkered"></i>';
  } else {
    nextBtn.innerHTML = 'Next <i class="fa-solid fa-chevron-right"></i>';
  }
}

nextBtn.addEventListener('click', () => {
  if (currentQuestionIndex < triviaQuestions.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
  } else {
    showResults();
  }
});

function showResults() {
  quizCard.style.display = 'none';
  resultCard.style.display = 'block';
  
  // Calculate percentage (simulate always positive bestie score because it's a tribute site!)
  const scorePercent = Math.round((score / triviaQuestions.length) * 100);
  const resultPercentageEl = resultCard.querySelector('.result-percentage');
  resultPercentageEl.textContent = `Compatibility Score: 100%! (${score}/${triviaQuestions.length} Correct)`;

  // Big blast of confetti on quiz complete
  startConfettiBlast();
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  quizCard.style.display = 'block';
  resultCard.style.display = 'none';
  loadQuestion();
}

// Initial quiz load
document.addEventListener('DOMContentLoaded', loadQuestion);


// --- Interactive Envelope ---
const envelopeContainer = document.getElementById('envelope-container');

function openEnvelope() {
  if (!envelopeContainer.classList.contains('open')) {
    envelopeContainer.classList.add('open');
    // Confetti blast on opening
    setTimeout(() => {
      startConfettiBlast();
    }, 600);
  }
}


// --- Floating Music Widget & Background Player ---
const musicToggle = document.getElementById('music-toggle');
const musicPanel = document.getElementById('music-panel');
const playBtn = document.getElementById('player-play');
const audio = document.getElementById('bg-audio');

musicToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  musicPanel.classList.toggle('active');
});

// Close player panel when clicking elsewhere
document.addEventListener('click', (e) => {
  if (!musicPanel.contains(e.target) && e.target !== musicToggle) {
    musicPanel.classList.remove('active');
  }
});

let isPlaying = false;

playBtn.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause();
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    playBtn.classList.remove('pause-active');
  } else {
    // Play audio. Catch errors if browser blocks autoplay
    audio.play().then(() => {
      playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      playBtn.classList.add('pause-active');
    }).catch(err => {
      console.log("Autoplay was prevented by browser, simulating controls.", err);
      // Simulate play state anyways
      playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      playBtn.classList.add('pause-active');
    });
  }
  isPlaying = !isPlaying;
});


// --- Floating Background Elements Generator (Hero Section) ---
function createFloatingElements() {
  const hero = document.getElementById('home');
  if (!hero) return;

  const symbols = ['✨', '🌸', '⭐', '💖', '💡', '💬'];
  const numberOfElements = 12;

  for (let i = 0; i < numberOfElements; i++) {
    const el = document.createElement('span');
    el.className = 'floating-particle';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    
    // Random sizes, positions, and delays
    const size = Math.random() * 1.5 + 0.8; // rem
    const left = Math.random() * 90 + 5; // %
    const delay = Math.random() * 8; // s
    const duration = Math.random() * 10 + 10; // s

    el.style.fontSize = `${size}rem`;
    el.style.left = `${left}%`;
    el.style.animationDelay = `${delay}s`;
    el.style.animationDuration = `${duration}s`;
    
    hero.appendChild(el);
  }
}

// Add CSS rules dynamically for floating particles to keep CSS file cleaner
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  .floating-particle {
    position: absolute;
    bottom: -50px;
    opacity: 0;
    pointer-events: none;
    z-index: 1;
    animation: floatUp ease-in-out infinite;
  }
  @keyframes floatUp {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 0.6;
    }
    90% {
      opacity: 0.6;
    }
    100% {
      transform: translateY(-90vh) rotate(360deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(styleSheet);
document.addEventListener('DOMContentLoaded', createFloatingElements);
