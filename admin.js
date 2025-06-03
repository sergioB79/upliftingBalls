// Estatísticas do painel de administração
function updateStats() {
  // Visitas
  db.collection('visits').get().then(snap => {
    document.getElementById('visit-count').textContent = snap.size;
  });
  // Cliques
  db.collection('clicks').get().then(snap => {
    document.getElementById('click-count').textContent = snap.size;
    const quadrantStats = {};
    const colorStats = {};
    const sizeStats = {};
    snap.forEach(doc => {
      const d = doc.data();
      // Quadrante
      quadrantStats[d.quadrant] = (quadrantStats[d.quadrant] || 0) + 1;
      // Cor
      colorStats[d.color] = (colorStats[d.color] || 0) + 1;
      // Tamanho
      const size = Math.round(d.size);
      sizeStats[size] = (sizeStats[size] || 0) + 1;
    });
    // Quadrantes
    const quadTable = document.getElementById('quadrant-table');
    quadTable.innerHTML = '';
    Object.entries(quadrantStats).forEach(([q, n]) => {
      quadTable.innerHTML += `<tr><td>${q}</td><td>${n}</td></tr>`;
    });
    // Cores
    const colorTable = document.getElementById('color-table');
    colorTable.innerHTML = '';
    Object.entries(colorStats).forEach(([c, n]) => {
      colorTable.innerHTML += `<tr><td><span style='display:inline-block;width:24px;height:24px;background:${c};border-radius:50%;border:1px solid #ccc;'></span> ${c}</td><td>${n}</td></tr>`;
    });
    // Tamanhos
    const sizeTable = document.getElementById('size-table');
    sizeTable.innerHTML = '';
    Object.entries(sizeStats).sort((a,b)=>a[0]-b[0]).forEach(([s, n]) => {
      sizeTable.innerHTML += `<tr><td>${s}px</td><td>${n}</td></tr>`;
    });
  });
}

updateStats();
setInterval(updateStats, 5000); // Atualiza a cada 5s
