window.addEventListener("DOMContentLoaded", function () {
  // Carregar scripts Firebase corretamente
  function loadScript(src, callback) {
    const s = document.createElement('script');
    s.src = src;
    s.onload = callback;
    s.onerror = () => console.error(`Erro ao carregar ${src}`);
    document.head.appendChild(s);
  }

  loadScript('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js', () => {
    loadScript('https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js', () => {
      initFirebase();
    });
  });

  function initFirebase() {
    const firebaseConfig = {
      apiKey: "AIzaSyANpc4sfF14XeHjUPqQu5XGePiOHbe5TM4",
      authDomain: "balls-stats.firebaseapp.com",
      projectId: "balls-stats",
      storageBucket: "balls-stats.firebasestorage.app",
      messagingSenderId: "174517867925",
      appId: "1:174517867925:web:5b6bb0238d8f24490d929c",
      measurementId: "G-QLNXEGVHR4"
    };
    firebase.initializeApp(firebaseConfig);
    window.db = firebase.firestore();

    // Registar visita
    window.db.collection('visits').add({
      timestamp: new Date(),
      userAgent: navigator.userAgent
    });
  }

  // Bola
  class Ball {
    constructor(x, y, radius, color, vx, vy) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.vx = vx;
      this.vy = vy;
      this.active = true;
    }

    draw(ctx) {
      if (!this.active) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      if (!this.active) return;
      this.x += this.vx;
      this.y += this.vy;
      if (this.x <= this.radius || this.x >= canvas.width - this.radius) this.vx *= -1;
      if (this.y <= this.radius || this.y >= canvas.height - this.radius) this.vy *= -1;
    }

    isPointInside(px, py) {
      const dx = this.x - px;
      const dy = this.y - py;
      return Math.sqrt(dx * dx + dy * dy) <= this.radius;
    }

    pop() {
      this.active = false;
    }
  }

  const canvas = document.getElementById('balls-canvas');
  const ctx = canvas.getContext('2d');
  const messageDiv = document.getElementById('message');
  const messages = [
    "Tu consegues!",
    "És incrível!",
    "Nunca desistas!",
    "Confia no teu caminho!",
    "Hoje vai ser um bom dia!"
  ];

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let balls = [];
  for (let i = 0; i < 20; i++) {
    balls.push(new Ball(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      20 + Math.random() * 30,
      `hsl(${Math.random() * 360}, 70%, 60%)`,
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4
    ));
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let ball of balls) {
      ball.update();
      ball.draw(ctx);
    }
    requestAnimationFrame(animate);
  }
  animate();

  canvas.addEventListener('click', function (e) {
    if (!messageDiv.classList.contains('hidden')) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let ball of balls) {
      if (ball.active && ball.isPointInside(x, y)) {
        ball.pop();

        // Firebase: regista clique
        if (window.db) {
          let quad = 1;
          if (x > canvas.width / 2 && y <= canvas.height / 2) quad = 2;
          else if (x <= canvas.width / 2 && y > canvas.height / 2) quad = 3;
          else if (x > canvas.width / 2 && y > canvas.height / 2) quad = 4;

          window.db.collection('clicks').add({
            timestamp: new Date(),
            color: ball.color,
            size: ball.radius,
            x: Math.round(ball.x),
            y: Math.round(ball.y),
            quadrant: quad
          });
        }

        showMessage();
        break;
      }
    }
  });

  function showMessage() {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    messageDiv.textContent = msg;
    messageDiv.classList.remove('hidden');
    setTimeout(() => messageDiv.classList.add('hidden'), 3000);
  }
});
