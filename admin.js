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
      // Cor - agrupar por intervalo de 60°
      const hue = parseFloat(d.color.match(/hsl\(([^,]+)/)[1]);
      const base = Math.floor(hue / 60) * 60;
      const colorKey = `${base}-${base + 59}`;
      colorStats[colorKey] = (colorStats[colorKey] || 0) + 1;

      // Tamanho - agrupar por faixas de 10px
      const size = Math.round(d.size);
      let sizeKey = '40-50';
      if (size < 30) sizeKey = '20-29';
      else if (size < 40) sizeKey = '30-39';
      sizeStats[sizeKey] = (sizeStats[sizeKey] || 0) + 1;
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
      Object.entries(colorStats)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .forEach(([c, n]) => {
          const hue = parseInt(c.split('-')[0]) + 30;
          colorTable.innerHTML += `<tr><td><span style='display:inline-block;width:24px;height:24px;background:hsl(${hue},70%,60%);border-radius:50%;border:1px solid #ccc;'></span> ${c}</td><td>${n}</td></tr>`;
        });
    // Tamanhos
      const sizeTable = document.getElementById('size-table');
      sizeTable.innerHTML = '';
      Object.entries(sizeStats)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .forEach(([s, n]) => {
          sizeTable.innerHTML += `<tr><td>${s}px</td><td>${n}</td></tr>`;
        });
  });
}

updateStats();
setInterval(updateStats, 5000); // Atualiza a cada 5s
