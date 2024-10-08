const apiKey = '3ff6e25af7553cccadf34338'; // Dein API-Schlüssel
const apiURL = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

const vonWaehlen = document.getElementById('vonWaehlen');
const zuWaehlen = document.getElementById('zuWaehlen');
const betrag = document.getElementById('betrag');
const ergebnis = document.getElementById('ergebnis');
const umrechnenButton = document.getElementById('umrechnen');
const umkehrenButton = document.getElementById('umkehren');

// Währungsoptionen laden
fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        const waehrungen = Object.keys(data.conversion_rates);
        dropdownBefuellen(waehrungen, vonWaehlen);
        dropdownBefuellen(waehrungen, zuWaehlen);
    })
    .catch(error => {
        console.error('Fehler beim Abrufen der Währungen:', error);
        ergebnis.textContent = 'Fehler beim Laden der Währungsdaten';
    });

// Dropdown-Optionen befüllen
function dropdownBefuellen(waehrungen, dropdown) {
    waehrungen.forEach(waehrung => {
        const option = document.createElement('option');
        option.value = waehrung;
        option.text = waehrung;
        dropdown.appendChild(option);
    });
}

// Umrechnung durchführen
umrechnenButton.addEventListener('click', () => {
    const betragWert = betrag.value;
    const vonWaehlenWert = vonWaehlen.value;
    const zuWaehlenWert = zuWaehlen.value;

    if (betragWert === '' || isNaN(betragWert) || parseFloat(betragWert) <= 0) {
        alert('Bitte geben Sie einen gültigen Betrag ein');
        ergebnis.textContent = '';
        return;
    }

    // Konversionsrate abrufen
    fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${vonWaehlenWert}/${zuWaehlenWert}`)
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                const rate = data.conversion_rate;
                const umgerechneterBetrag = (betragWert * rate).toFixed(2);
                ergebnis.textContent = `${betragWert} ${vonWaehlenWert} = ${umgerechneterBetrag} ${zuWaehlenWert}`;
            } else {
                ergebnis.textContent = 'Fehler bei der Umrechnung. Versuchen Sie es später erneut.';
            }
        })
        .catch(error => {
            console.error('Fehler beim Abrufen des Wechselkurses:', error);
            ergebnis.textContent = 'Fehler beim Abrufen des Wechselkurses';
        });
});

// Währungen umkehren
umkehrenButton.addEventListener('click', () => {
    const vonWert = vonWaehlen.value;
    const zuWert = zuWaehlen.value;

    vonWaehlen.value = zuWert;
    zuWaehlen.value = vonWert;
});
