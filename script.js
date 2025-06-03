window.addEventListener("DOMContentLoaded", function () {
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

    window.db.collection('visits').add({
      timestamp: new Date(),
      userAgent: navigator.userAgent
    });
  }

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
    "Hoje vai ser um bom dia!",
    "Respira fundo e recomeça.",
    "Cada dia é uma nova oportunidade.",
    "A tua energia é única.",
    "Mesmo devagar, estás a avançar.",
    "Estás mais perto do que pensas.",
    "Tu és suficiente.",
    "Há força em ti que ainda não viste.",
    "Sê gentil contigo.",
    "Leva o teu tempo, mas nunca te rendas.",
    "És feito de possibilidades infinitas.",
    "Mesmo nos dias nublados, brilhas.",
    "O teu esforço vai valer a pena.",
    "Não precisas ser perfeito, só presente.",
    "Há coragem nos teus silêncios.",
    "Tu és o teu maior aliado.",
    "Já superaste tanto — lembra-te disso.",
    "Cada respiração é uma hipótese nova.",
    "Caminha com o coração aberto.",
    "Tu tens valor mesmo quando duvidas.",
    "A tua verdade é o teu poder.",
    "Pequenos passos também fazem caminho.",
    "Acreditar em ti é o primeiro milagre.",
    "Estás exatamente onde precisas de estar.",
    "A tua luz incomoda quem vive na sombra — continua a brilhar.",
    "Não deixes que o medo te pare.",
    "Só tu podes escrever a tua história.",
    "O teu recomeço começa agora.",
    "Há força nas tuas cicatrizes.",
    "O que hoje parece difícil, amanhã será conquista.",
    "O teu ritmo é o certo.",
    "Tens tudo o que precisas dentro de ti.",
    "A tua existência já é um feito.",
    "Sorrir hoje é um acto de coragem.",
    "Não subestimes o teu impacto.",
    "És a resposta a muitos 'impossíveis'.",
    "Ainda bem que não desististe ontem.",
    "Cada escolha consciente é um passo na direção certa.",
    "Tu sabes mais do que pensas.",
    "Ser verdadeiro é revolucionário.",
    "Estás a construir algo bonito, mesmo que não vejas ainda.",
    "Confia no teu instinto.",
    "Nada em ti é um erro.",
    "A tua autenticidade é um presente para o mundo.",
    "Não precisas de comparação — só de presença.",
    "Fica. Sente. Cresce.",
    "És digno do melhor que a vida tem.",
    "Quando te ouves, o mundo escuta.",
    "A tua coragem é contagiante.",
    "Estás a florescer, mesmo nos dias cinzentos.",
    "Já és tudo o que procuras ser.",
    "És feito de sol e resistência.",
    "És prova de que é possível continuar.",
    "O teu cansaço também é sagrado.",
    "Hoje é um bom dia para acreditares em ti.",
    "A tua sensibilidade é força, não fraqueza.",
    "Nunca subestimes o poder de um passo pequeno.",
    "O mundo precisa da tua versão mais honesta.",
    "És a esperança vestida de gente.",
    "Tudo começa com um passo.",
    "Errar é parte do caminho.",
    "Mantém o foco no que importa.",
    "És mais forte do que pareces.",
    "Há beleza na imperfeição.",
    "A luz que procuras está em ti.",
    "Não pares antes do milagre.",
    "Confia no processo.",
    "Tu inspiras mais do que sabes.",
    "Cada pequena vitória conta.",
    "A tua presença já é um impacto.",
    "Hoje é o teu momento. Aproveita-o!"
  ];

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let balls = [];
  let poppedCount = 0;

  function createBalls(count = 10) {
    for (let i = 0; i < count; i++) {
      balls.push(new Ball(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        20 + Math.random() * 30,
        `hsl(${Math.random() * 360}, 70%, 60%)`,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      ));
    }
  }

  createBalls(20); // inicia com 20 bolas

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
        poppedCount++;

      if (poppedCount >= 10) {
        poppedCount = 0;
        // Limpa bolas rebentadas do array
        balls = balls.filter(ball => ball.active);
        createBalls(10);
      }

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

 let lastMessageIndex = -1;

function showMessage() {
  let index;
  do {
    index = Math.floor(Math.random() * messages.length);
  } while (index === lastMessageIndex && messages.length > 1);
  lastMessageIndex = index;

  const msg = messages[index];
  messageDiv.textContent = msg;
  messageDiv.classList.remove('hidden');
  setTimeout(() => messageDiv.classList.add('hidden'), 3000);
}
});
