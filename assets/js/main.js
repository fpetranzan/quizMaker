const jsonFileInput = document.getElementById('json-file-input');
const fileNameDisplay = document.getElementById('file-name');
const startQuizButton = document.getElementById('start-quiz-button');
const editorQuizButton = document.getElementById('editor-quiz-button');
const homeQuizButton = document.getElementById('home-quiz-button');
const heroBanner = document.getElementById('hero-banner');
const confirmQuestionButton = document.getElementById('confirm-question-button');
const configContainer = document.getElementById('config-container');
const uploadError = document.getElementById('upload-error');
const uploadContainer = document.getElementById('upload-container');
const quizContainer = document.getElementById('quiz-container');
const resultsContainer = document.getElementById('results-container');
const questionTextElement = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackTextElement = document.getElementById('feedback-text');
const explanationTextElement = document.getElementById('explanation-text');
const scoreTextElement = document.getElementById('score-text');
const progressBar = document.getElementById('progress-bar');
const questionCounterElement = document.getElementById('question-counter');
const questionCountSelector = document.getElementById('question-count-selector');
const questionCountButtons = document.getElementById('question-count-buttons');

// Pulsanti di navigazione del quiz
const backButton = document.getElementById('back-button');
const confirmButton = document.getElementById('confirm-button');
const nextQuestionButton = document.getElementById('next-question-button');

// Pulsanti dei risultati
const restartQuizButton = document.getElementById('restart-quiz-button');
const loadNewFileButton = document.getElementById('load-new-file-button');

// --- Stato del Quiz ---
let questions = []; 
let loadedQuizData = []; 
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null; // Memorizza l'elemento del DOM del pulsante dell'opzione selezionata

jsonFileInput.addEventListener('change', (event) => {
    handleFiles(event.target.files);
});

uploadContainer.addEventListener('dragover', (event) => {
    event.preventDefault(); // Necessario per permettere il drop
    uploadContainer.classList.add('drag-over');
});

// L'utente lascia l'area di trascinamento
uploadContainer.addEventListener('dragleave', () => {
    uploadContainer.classList.remove('drag-over');
});

// L'utente rilascia il file
uploadContainer.addEventListener('drop', (event) => {
    event.preventDefault();
    uploadContainer.classList.remove('drag-over');
    handleFiles(event.dataTransfer.files);
});

// --- Gestione Caricamento File ---
async function handleFiles(files) {
    if (!files || !files.length) {
        resetUploadUI();
        return;
    }

    const fileNames = Array.from(files).map(f => f.name).join(', ');
    fileNameDisplay.textContent = `${files.length} file selezionato/i: ${fileNames}`;
    startQuizButton.disabled = true;
    questionCountSelector.classList.add('hidden');
    uploadError.textContent = 'Caricamento e validazione in corso...';
    uploadError.classList.remove('text-red-500', 'text-green-500');

    const fileReadPromises = Array.from(files).map(file => {
        return new Promise((resolve, reject) => {
            if (file.type !== "application/json") {
                return reject(new Error(`Il file '${file.name}' non è un JSON.`));
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const parsedData = JSON.parse(e.target.result);
                    const questionsFromFile = parsedData.questions || (Array.isArray(parsedData) ? parsedData : null);
                    if (!questionsFromFile) throw new Error("Formato JSON non riconosciuto.");
                    if (questionsFromFile.length > 0) validateQuestions(questionsFromFile);
                    resolve(questionsFromFile);
                } catch (error) {
                    reject(new Error(`Errore nel file '${file.name}': ${error.message}`));
                }
            };
            reader.onerror = () => reject(new Error(`Impossibile leggere il file '${file.name}'.`));
            reader.readAsText(file);
        });
    });
    
    try {
        const results = await Promise.all(fileReadPromises);
        loadedQuizData = results.flat(); 
        if (loadedQuizData.length === 0) throw new Error("Nessuna domanda valida trovata nei file selezionati.");
        
        uploadError.textContent = `Caricate con successo ${loadedQuizData.length} domande.`;
        uploadError.classList.add('text-green-500');
        updateQuestionCountOptions();
        questionCountSelector.classList.remove('hidden');
        startQuizButton.disabled = false;
    } catch (error) {
        console.error("Errore durante il caricamento:", error);
        uploadError.textContent = error.message;
        uploadError.classList.add('text-red-500');
        resetUploadUI();
    }
}

function validateQuestions(qs) {
    qs.forEach((q, index) => {
        if (!q.question_text || !q.options || !Array.isArray(q.options) || !q.options.length || q.correct_option_id === undefined || !q.explanation) {
            throw new Error(`La domanda ${index + 1} ha una struttura non valida.`);
        }
        q.options.forEach(opt => {
            if (opt.id === undefined || opt.text === undefined) throw new Error(`Un'opzione nella domanda ${index + 1} non ha id o testo.`);
        });
    });
}

function updateQuestionCountOptions() {
    questionCountButtons.innerHTML = '';
    const totalQuestions = loadedQuizData.length;
    const options = [5, 10, 15, 20];

    const createButton = (value, text) => {
        const button = document.createElement('button');
        button.dataset.value = value;
        button.textContent = text;
        button.className = 'count-button px-4 py-2 border border-slate-300 rounded-md text-sm font-medium bg-white';
        questionCountButtons.appendChild(button);
    };

    options.forEach(num => {
        if (totalQuestions >= num) {
            createButton(num, `${num}`);
        }
    });

    createButton('all', `Tutte (${totalQuestions})`);

    // Seleziona "Tutte" di default
    questionCountButtons.querySelector('[data-value="all"]').classList.add('selected');
}

questionCountButtons.addEventListener('click', (event) => {
    const target = event.target.closest('.count-button');
    if (!target) return;

    // Rimuove la selezione da tutti i pulsanti
    questionCountButtons.querySelectorAll('.count-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Aggiunge la selezione al pulsante cliccato
    target.classList.add('selected');
});

function shuffleArray(array) {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function setupAndStartQuiz() {
    if (loadedQuizData.length === 0) {
            uploadError.textContent = "Nessuna domanda caricata. Seleziona dei file JSON validi.";
            return;
    }

    editorQuizButton.classList.add('hidden');
    homeQuizButton.classList.remove('hidden');
    heroBanner.classList.add('hidden');

    const selectedButton = questionCountButtons.querySelector('.selected');
    const desiredCountValue = selectedButton ? selectedButton.dataset.value : 'all';
    
    const desiredCount = desiredCountValue === 'all' 
        ? loadedQuizData.length 
        : parseInt(desiredCountValue, 10);
    
    const shuffledQuestions = shuffleArray([...loadedQuizData]);
    questions = shuffledQuestions.slice(0, Math.min(desiredCount, loadedQuizData.length));

    currentQuestionIndex = 0;
    score = 0;
    configContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    resultsContainer.classList.add('hidden');
    displayQuestion();
}

startQuizButton.addEventListener('click', setupAndStartQuiz);

function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    selectedOption = null; // Resetta l'opzione selezionata
    const currentQuestion = questions[currentQuestionIndex];
    questionTextElement.innerHTML = currentQuestion.question_text;
    optionsContainer.innerHTML = '';
    
    // Aggiorna la barra di progresso e il contatore
    const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    questionCounterElement.textContent = `Domanda ${currentQuestionIndex + 1} di ${questions.length}`;

    const shuffledOptions = shuffleArray([...currentQuestion.options]);
    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.innerHTML = option.text; // Usiamo innerHTML per supportare eventuale markup
        button.className = 'option-button w-full bg-white hover:bg-sky-100 text-slate-700 font-medium py-3 px-4 border border-slate-300 rounded-lg shadow-sm text-left';
        button.dataset.optionId = option.id;
        button.addEventListener('click', handleOptionSelect);
        optionsContainer.appendChild(button);
    });

    // Gestione visibilità pulsanti
    feedbackContainer.classList.add('hidden');
    nextQuestionButton.classList.add('hidden');
    confirmButton.classList.remove('hidden');
    confirmButton.disabled = true;

    if (currentQuestionIndex > 0) {
        backButton.classList.remove('hidden');
    } else {
        backButton.classList.add('hidden');
    }
}

function handleOptionSelect(event) {
    // Rimuove la selezione dall'opzione precedente, se esiste
    if (selectedOption) {
        selectedOption.classList.remove('selected');
    }
    // Imposta la nuova opzione selezionata
    selectedOption = event.currentTarget;
    selectedOption.classList.add('selected');
    
    // Abilita il pulsante di conferma
    confirmButton.disabled = false;
}

confirmButton.addEventListener('click', () => {
    if (!selectedOption) return;

    const selectedOptionId = selectedOption.dataset.optionId.toString();
    const currentQuestion = questions[currentQuestionIndex];
    const correctOptionId = currentQuestion.correct_option_id.toString();

    // Disabilita tutti i pulsanti delle opzioni
    Array.from(optionsContainer.children).forEach(btn => {
        btn.disabled = true;
        btn.classList.add('disabled-option');
        btn.removeEventListener('click', handleOptionSelect);
    });

    // Controlla la risposta e aggiorna lo score
    if (selectedOptionId === correctOptionId) {
        score++;
        currentQuestion.wasAnsweredCorrectly = true;
        feedbackTextElement.textContent = "Risposta Corretta!";
        feedbackTextElement.className = 'text-lg font-medium mb-2 text-green-600';
        selectedOption.classList.add('correct');
    } else {
        currentQuestion.wasAnsweredCorrectly = false;
        feedbackTextElement.textContent = "Risposta Sbagliata!";
        feedbackTextElement.className = 'text-lg font-medium mb-2 text-red-600';
        selectedOption.classList.add('incorrect');
        // Evidenzia la risposta corretta
        const correctButton = optionsContainer.querySelector(`[data-option-id="${correctOptionId}"]`);
        if (correctButton) {
            correctButton.classList.add('correct');
        }
    }
    
    // Mostra spiegazione e feedback
    explanationTextElement.innerHTML = currentQuestion.explanation;
    feedbackContainer.classList.remove('hidden');
    feedbackContainer.className = 'p-4 rounded-lg mb-6 bg-slate-50 border border-slate-200 text-slate-700';

    // Aggiorna la visibilità dei pulsanti di navigazione
    confirmButton.classList.add('hidden');
    backButton.classList.add('hidden');
    nextQuestionButton.classList.remove('hidden');
    nextQuestionButton.textContent = (currentQuestionIndex < questions.length - 1) ? "Domanda Successiva" : "Mostra Risultati";
});

nextQuestionButton.addEventListener('click', () => {
    currentQuestionIndex++;
    displayQuestion();
});

backButton.addEventListener('click', () => {
    if (currentQuestionIndex === 0) return;

    // Se la domanda a cui si sta tornando era stata risposta correttamente, decrementa lo score
    const previousQuestion = questions[currentQuestionIndex - 1];
    if (previousQuestion.wasAnsweredCorrectly === true) {
        score--;
    }
    // Resetta lo stato della risposta per permettere di rispondere di nuovo
    previousQuestion.wasAnsweredCorrectly = null;

    currentQuestionIndex--;
    displayQuestion();
});

function showResults() {
    quizContainer.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    homeQuizButton.classList.add('hidden');
    scoreTextElement.textContent = `${score} / ${questions.length}`;
}

restartQuizButton.addEventListener('click', () => {
        resultsContainer.classList.add('hidden');
        configContainer.classList.remove('hidden');
        questionCountSelector.classList.remove('hidden');
        heroBanner.classList.remove('hidden');
        startQuizButton.disabled = false;
});

function resetUploadUI() {
    jsonFileInput.value = '';
    fileNameDisplay.textContent = "Nessun file selezionato.";
    startQuizButton.disabled = true;
    questionCountSelector.classList.add('hidden');
    uploadError.textContent = '';
}

loadNewFileButton.addEventListener('click', () => {
    resultsContainer.classList.add('hidden');
    configContainer.classList.remove('hidden');
    heroBanner.classList.remove('hidden');
    resetUploadUI();
    questions = [];
    loadedQuizData = [];
    currentQuestionIndex = 0;
    score = 0;
});