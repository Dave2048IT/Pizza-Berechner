  // Funktion zur Berechnung der Preis pro Fläche für eine Pizza-Option
  function calculatePricePerArea(priceInputId, sizeInputId1, sizeInputId2) {
    const price = parseFloat(document.getElementById(priceInputId).value);
    let area;
  
    if (sizeInputId2) {
      // Eckige Pizza: Breite und Höhe werden verwendet
      const width = parseFloat(document.getElementById(sizeInputId1).value);
      const height = parseFloat(document.getElementById(sizeInputId2).value);
      area = width * height;
    } else {
      // Runde Pizza: Durchmesser wird verwendet
      const diameter = parseFloat(document.getElementById(sizeInputId1).value);
      const radius = diameter / 2;
      area = Math.PI * Math.pow(radius, 2);
    }
  
    return price / area * 10000;
  }
  
  // Ranks für die verschiedenen Pizzen berechnen
  function calculateRanks() {
    const ranks = [];
  
    // Runde Pizzen
    for (let i = 1; i <= 4; i++) {
      const sizeInputId = `roundSize${i}`;
      const priceInputId = `roundPrice${i}`;
      const area = Math.PI * Math.pow(document.getElementById(sizeInputId).value / 2, 2);
      if (!area)
        continue;

      const type = `Rund ${document.getElementById(sizeInputId).value} cm`;
      const pricePerArea = calculatePricePerArea(priceInputId, sizeInputId);
      ranks.push({ type, pricePerArea, area });
    }
  
    // Eckige Pizzen
    for (let i = 1; i <= 2; i++) {
      const widthInputId = `squareWidth${i}`;
      const heightInputId = `squareHeight${i}`;
      const priceInputId = `squarePrice${i}`;
      const area = document.getElementById(widthInputId).value * document.getElementById(heightInputId).value;
      if (!area)
        continue;
      
      const type = `Eckig ${document.getElementById(widthInputId).value} x ${document.getElementById(heightInputId).value} cm`;
      const pricePerArea = calculatePricePerArea(priceInputId, widthInputId, heightInputId);
      ranks.push({ type, pricePerArea, area });
    }
  
    return ranks;
  }
  
  // Funktion zum Berechnen und Anzeigen der Ergebnisse
  function calculatePrice() {
    const ranks = calculateRanks();
    let totalArea = 0;
    let totalPrice = 0;
    
    for (const rank of ranks) {
      if (rank.area > 0 && rank.pricePerArea > 0) {
        totalArea += rank.area;
        totalPrice += rank.pricePerArea * rank.area / 10000;
      }
    }
    
    const pricePerArea = totalPrice && totalArea ? (totalPrice / totalArea * 10000) : 0;
    displayResult(totalPrice, pricePerArea);
    updateRanking(ranks);
    visualizePizzas();
  }
  
  // Funktion zur Anzeige des Ergebnisses
  function displayResult(totalPrice, pricePerArea) {
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `
      Gesamtpreis für die ausgewählten Pizzen: ${totalPrice.toFixed(2)} €.<br>
      Effektivität: ${(pricePerArea).toFixed(1)} ct / dm².
    `;

    const portions = document.getElementById("portions").valueAsNumber;
    const roundSize = document.getElementById("roundSizeAll").valueAsNumber;

    if (isNaN(portions) || isNaN(roundSize)) {
      alert("Bitte geben Sie gültige Werte für Portionen und Größe ein.");
      return;
    }

    const area = Math.PI * portions * Math.pow(roundSize / 2, 2);
    const diameter = 2 * Math.sqrt(area / Math.PI).toFixed(1);
    const height = Math.sqrt(area * 2/3).toFixed(0);

    document.getElementById("areaForAll").innerText =
      `Fläche für alle Beteiligten: ${(area).toFixed(1)} cm²`;
    
    document.getElementById("recommendedPizzas").innerHTML =
      `Empfohlene Größe für Alle: <ul>
        <li> rund: <b>${diameter}</b> cm Ø </li>
        <li> oder eckig: <b>${height} x ${height * 1.5}</b> cm ▭ </li>
      </ul>`;
  }
  
  // Funktion zur Aktualisierung der Effektivitätsrangliste
  function updateRanking(ranks) {
    // Sortieren nach Effektivität
    ranks.sort((a, b) => a.pricePerArea - b.pricePerArea);

    const tbody = document.getElementById('rankedPizzas');
    tbody.innerHTML = ranks.map((pizza, idx) => `
      <tr>
          <td>${idx + 1}: ${pizza.type}</td>
          <td>${(pizza.pricePerArea * pizza.area / 10000).toFixed(2)}</td>
          <td>${pizza.area.toFixed(1)}</td>
          <td>${pizza.pricePerArea.toFixed(1)}</td>
      </tr>
    `).join('');
  }
  
  // Funktion zur Visualisierung der Pizzen mit Krusten
  function visualizePizzas() {
    const visualizationElement = document.getElementById('visualization');
    visualizationElement.innerHTML = '';
  
    // Runde Pizzen visualisieren
    for (let i = 1; i <= 4; i++) {
      const diameter = 4 * parseFloat(document.getElementById(`roundSize${i}`).value);
      if (!diameter)
        continue;

      const radius = diameter / 2;
      const crustWidth = 5; // Breite der Kruste
      const slices = portions.value; // Anzahl der Stücke, in die die Pizza geschnitten wird
      
      let sliceLines = '';
      for (let j = 0; j < slices; j++) {
        const angle = (j * 360 / slices) * (Math.PI / 180); // Winkel in Bogenmaß umrechnen
        const x1 = radius + crustWidth;
        const y1 = radius + crustWidth;
        const x2 = x1 + radius * Math.sin(angle);
        const y2 = y1 - radius * Math.cos(angle);
        sliceLines += `<line x1="${x1}" y1="${y1}" x2="${x2.toFixed(0)}" y2="${y2.toFixed(0)}" stroke="black" stroke-dasharray="5, 5" />`;
      }

      const svg = `
        <svg class="pizza-svg" width="${diameter + crustWidth * 2}" height="${diameter + crustWidth * 2}">
          <circle cx="${radius + crustWidth}" cy="${radius + crustWidth}" r="${radius}" fill="gold" />
          <circle cx="${radius + crustWidth}" cy="${radius + crustWidth}" r="${radius - crustWidth}" fill="tomato" />
          ${sliceLines}
          <text x="50%" y="50%" text-anchor="middle" dy="1.3em" fill="white" style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);">${diameter / 4} cm</text>
        </svg>
      `;
  
      visualizationElement.innerHTML += svg;
    }
  
    // Eckige Pizzen visualisieren
    for (let i = 1; i <= 2; i++) {
      const width =  4 * parseFloat(document.getElementById(`squareWidth${i}`).value);
      const height = 4 * parseFloat(document.getElementById(`squareHeight${i}`).value);
      const crustWidth = 5; // Breite der Kruste
      if (!width || !height)
        continue;

      const slicesY = Math.ceil(Math.sqrt(portions.value)); // Anzahl der horizontalen Stücke
      const slicesX = Math.ceil(portions.value / slicesY); // Anzahl der vertikalen Stücke
      let sliceLines = '';

      for (let j = 1; j < slicesX; j++) {
        const x = (width / slicesX) * j;
        sliceLines += `<line x1="${x}" y1="${crustWidth}" x2="${x}" y2="${height}" stroke="black" stroke-dasharray="5, 5" />`;
      }
      for (let j = 1; j < slicesY; j++) {
        const y = (height / slicesY) * j;
        sliceLines += `<line x1="${crustWidth}" y1="${y}" x2="${width}" y2="${y}" stroke="black" stroke-dasharray="5, 5" />`;
      }

      // Färbe spezifische Stücke blau
      const leftover_portions = slicesX * slicesY - portions.value;
      if (leftover_portions > 0) {
        const h1 = height / slicesY;
        const w1 = width / slicesX * leftover_portions;
        sliceLines += `<rect x="${width - w1}" y="${height - h1}" width="${w1}" height="${h1}" fill="blue" />`;
      }

      const svg = `
        <svg class="pizza-svg" width="${width + crustWidth * 2}" height="${height + crustWidth * 2}">
          <rect x="0" y="0" width="${width}" height="${height}" fill="gold" />
          <rect x="${crustWidth}" y="${crustWidth}"
            width="${width - crustWidth * 2}" height="${height - crustWidth * 2}" fill="tomato" />
          ${sliceLines}
          <text x="50%" y="50%" text-anchor="middle" dy="1.3em" fill="white">${width / 4} x ${height / 4} cm</text>
        </svg>
      `;
  
      visualizationElement.innerHTML += svg;
    }
  }
  