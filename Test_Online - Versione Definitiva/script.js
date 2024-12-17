// Variabili globali
let timer; // Variabile per il riferimento al timer dell'intervallo
const totalTestTime = 120; // Tempo totale del test in secondi (2 minuti)

// Funzione per avviare il test
function startTest() {
    if (!localStorage.getItem('startTime')) { // Controlla se l'ora di inizio non è già salvata nel localStorage
        const startTime = Date.now(); // Ottiene il timestamp corrente
        localStorage.setItem('startTime', startTime); // Salva l'ora di inizio nel localStorage
    }
    window.location.href = "open_questions.html"; // Reindirizza alla pagina delle domande aperte
}

// Funzione per calcolare il tempo rimanente
function calculateTimeLeft() {
    const startTime = parseInt(localStorage.getItem('startTime'), 10); // Recupera l'ora di inizio dal localStorage e la converte in intero
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Calcola il tempo trascorso in secondi
    return totalTestTime - elapsedTime; // Restituisce il tempo rimanente sottraendo il tempo trascorso dal tempo totale
}

// Funzione per avviare il timer
function startTimer() {
    const timerElement = document.getElementById('timer'); // Recupera l'elemento HTML con id 'timer'
    timer = setInterval(() => { // Avvia un intervallo che si ripete ogni secondo
        const timeLeft = calculateTimeLeft(); // Calcola il tempo rimanente

        if (timeLeft <= 0) { // Se il tempo è scaduto
            clearInterval(timer); // Ferma il timer
            alert('Tempo scaduto!'); // Mostra un messaggio di avviso
            saveResults({ error: "Tempo scaduto" }); // Salva un messaggio di errore nei risultati
            return;
        }

        const minutes = Math.floor(timeLeft / 60); // Calcola i minuti rimanenti
        const seconds = timeLeft % 60; // Calcola i secondi rimanenti
        timerElement.textContent = `Tempo rimanente: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`; // Aggiorna il testo dell'elemento timer
    }, 1000); // Intervallo impostato a 1 secondo
}

// Avvia il timer se l'elemento 'timer' è presente nella pagina
if (document.getElementById('timer')) startTimer(); // Controlla se l'elemento timer esiste e avvia il timer

// Funzione per salvare le risposte delle domande aperte
function submitOpenQuestions() {
    const form = document.getElementById('open-questions-form'); // Recupera il modulo HTML delle domande aperte
    const formData = new FormData(form); // Ottiene i dati dal modulo come oggetto FormData

    const results = {}; // Crea un oggetto per salvare le risposte
    formData.forEach((value, key) => { // Itera su tutte le coppie chiave-valore del FormData
        results[key] = value; // Salva ogni risposta nell'oggetto results
    });

    localStorage.setItem('openQuestions', JSON.stringify(results)); // Salva le risposte nel localStorage in formato JSON
    window.location.href = "close_questions.html"; // Reindirizza alla pagina delle domande chiuse
}

// Funzione per salvare le risposte delle domande chiuse
function submitCloseQuestions() {
    const form = document.getElementById('close-questions-form'); // Recupera il modulo HTML delle domande chiuse
    const formData = new FormData(form); // Ottiene i dati dal modulo come oggetto FormData

    const results = JSON.parse(localStorage.getItem('openQuestions')) || {}; // Recupera le risposte aperte salvate o crea un oggetto vuoto
    formData.forEach((value, key) => { // Itera su tutte le coppie chiave-valore del FormData
        results[key] = value; // Salva ogni risposta nell'oggetto results
    });

    saveResults(results); // Salva i risultati finali
}

// Funzione per salvare i risultati in un file di testo
function saveResults(results) {
    // Recupera lo storico dei quiz completati
    let allResults = JSON.parse(localStorage.getItem('allTests')) || []; // Ottiene lo storico dei test o crea un array vuoto
    allResults.push(results); // Aggiunge i risultati correnti allo storico
    localStorage.setItem('allTests', JSON.stringify(allResults)); // Salva lo storico aggiornato nel localStorage

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'text/plain' }); // Crea un oggetto Blob contenente i risultati in formato JSON
    const link = document.createElement('a'); // Crea un elemento <a> per il download
    link.href = URL.createObjectURL(blob); // Imposta l'URL del file
    link.download = 'risultati_test.txt'; // Imposta il nome del file da scaricare
    link.click(); // Simula un click sul link per avviare il download

    alert("Test completato! Risultati salvati."); // Mostra un messaggio di conferma
    // Non cancelliamo `allTests` dal localStorage
    localStorage.removeItem('startTime'); // Rimuove l'ora di inizio dal localStorage
    localStorage.removeItem('openQuestions'); // Rimuove le risposte parziali dal localStorage
    window.location.href = "index.html"; // Reindirizza alla pagina iniziale
}

// Funzione per scaricare lo storico di tutti i test
function downloadAllTests() {
    const allResults = JSON.parse(localStorage.getItem('allTests')) || []; // Ottiene lo storico dei test o crea un array vuoto
    if (allResults.length === 0) { // Controlla se non ci sono risultati salvati
        alert("Nessuno storico disponibile."); // Mostra un messaggio di avviso
        return;
    }
    const blob = new Blob([JSON.stringify(allResults, null, 2)], { type: 'text/plain' }); // Crea un oggetto Blob contenente lo storico in formato JSON
    const link = document.createElement('a'); // Crea un elemento <a> per il download
    link.href = URL.createObjectURL(blob); // Imposta l'URL del file
    link.download = 'storico_quiz.txt'; // Imposta il nome del file da scaricare
    link.click(); // Simula un click sul link per avviare il download

    alert("Storico dei quiz scaricato!"); // Mostra un messaggio di conferma
}
