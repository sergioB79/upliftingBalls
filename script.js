// ... existing code ...
// Firebase CDN
// Adiciona Firebase ao site
(function() {
  var script1 = document.createElement('script');
  script1.src = 'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js';
  document.head.appendChild(script1);
  var script2 = document.createElement('script');
  script2.src = 'https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js';
  document.head.appendChild(script2);
})();

// Espera Firebase carregar
function waitForFirebase(cb) {
  if (window.firebase && window.firebase.firestore) {
    cb();
  } else {
    setTimeout(() => waitForFirebase(cb), 100);
  }
}

waitForFirebase(() => {
  // Configuração Firebase
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
  // Regista visita
  window.db.collection('visits').add({
    timestamp: new Date(),
    userAgent: navigator.userAgent
  });
});

// ... existing code ...
canvas.addEventListener('click', function(e) {
  if (!messageDiv.classList.contains('hidden')) return; // Only one message at a time
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  for (let ball of balls) {
    if (ball.isPointInside(x, y)) {
      ball.pop();
      // Firebase: regista clique
      if (window.db) {
        // Quadrantes: 1=top-left, 2=top-right, 3=bottom-left, 4=bottom-right
        let quad = 1;
        if (x > canvas.width/2 && y <= canvas.height/2) quad = 2;
        else if (x <= canvas.width/2 && y > canvas.height/2) quad = 3;
        else if (x > canvas.width/2 && y > canvas.height/2) quad = 4;
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
// ... existing code ...
