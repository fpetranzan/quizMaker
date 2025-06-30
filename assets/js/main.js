const jsonFileInput = document.getElementById('json-file-input');
const fileNameDisplay = document.getElementById('file-name');
const startQuizButton = document.getElementById('start-quiz-button');
const uploadError = document.getElementById('upload-error');
const uploadContainer = document.getElementById('upload-container');
const quizContainer = document.getElementById('quiz-container');
const resultsContainer = document.getElementById('results-container');
const questionTextElement = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackTextElement = document.getElementById('feedback-text');
const explanationTextElement = document.getElementById('explanation-text');
const nextQuestionButton = document.getElementById('next-question-button');
const restartQuizButton = document.getElementById('restart-quiz-button');
const loadNewFileButton = document.getElementById('load-new-file-button');
const scoreTextElement = document.getElementById('score-text');
const progressBar = document.getElementById('progress-bar');
const questionCounterElement = document.getElementById('question-counter');
const questionCountSelector = document.getElementById('question-count-selector');
const questionCountButtons = document.getElementById('question-count-buttons');

// --- Stato del Quiz ---
let questions = []; 
let loadedQuizData = []; 
let currentQuestionIndex = 0;
let score = 0;

// --- Gestione Caricamento File ---
jsonFileInput.addEventListener('change', async (event) => {
    const files = event.target.files;
    if (!files.length) {
        resetUploadUI();
        return;
    }

    const fileNames = Array.from(files).map(f => f.name).join(', ');
    fileNameDisplay.textContent = `${files.length} file selezionato/i: ${fileNames}`;
    startQuizButton.disabled = true;
    questionCountSelector.classList.add('hidden');
    uploadError.textContent = 'Caricamento e validazione in corso...';
    
    const fileReadPromises = Array.from(files).map(file => {
        return new Promise((resolve, reject) => {
            if (file.type !== "application/json") {
                return reject(new Error(`Il file '${file.name}' non è un JSON.`));
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const parsedData = JSON.parse(e.target.result);
                    let questionsFromFile = parsedData.questions || (Array.isArray(parsedData) ? parsedData : null);
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
        updateQuestionCountOptions();
        questionCountSelector.classList.remove('hidden');
        startQuizButton.disabled = false;
    } catch (error) {
        console.error("Errore durante il caricamento:", error);
        uploadError.textContent = error.message;
        resetUploadUI();
    }
});

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

    const selectedButton = questionCountButtons.querySelector('.selected');
    const desiredCountValue = selectedButton ? selectedButton.dataset.value : 'all';
    
    const desiredCount = desiredCountValue === 'all' 
        ? loadedQuizData.length 
        : parseInt(desiredCountValue, 10);
    
    const shuffledQuestions = shuffleArray([...loadedQuizData]);
    questions = shuffledQuestions.slice(0, Math.min(desiredCount, loadedQuizData.length));

    currentQuestionIndex = 0;
    score = 0;
    uploadContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    resultsContainer.classList.add('hidden');
    displayQuestion();
}

startQuizButton.addEventListener('click', setupAndStartQuiz);

function displayQuestion() {
    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        questionTextElement.innerHTML = currentQuestion.question_text;
        optionsContainer.innerHTML = '';

        const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        questionCounterElement.textContent = `Domanda ${currentQuestionIndex + 1} di ${questions.length}`;

        // --- MODIFICA CHIAVE: Mescola le opzioni ---
        const shuffledOptions = shuffleArray([...currentQuestion.options]);

        shuffledOptions.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.text;
            button.classList.add('option-button', 'w-full', 'bg-white', 'hover:bg-sky-100', 'text-slate-700', 'font-medium', 'py-3', 'px-4', 'border', 'border-slate-300', 'rounded-lg', 'shadow-sm', 'text-left');
            button.dataset.optionId = option.id;
            button.addEventListener('click', handleOptionClick);
            optionsContainer.appendChild(button);
        });

        feedbackContainer.classList.add('hidden');
        nextQuestionButton.classList.add('hidden');
    } else {
        showResults();
    }
}

function handleOptionClick(event) {
    const selectedOptionId = event.target.dataset.optionId.toString();
    const currentQuestion = questions[currentQuestionIndex];
    const correctOptionId = currentQuestion.correct_option_id.toString();

    Array.from(optionsContainer.children).forEach(btn => {
        btn.disabled = true;
        btn.classList.add('disabled-option');
        btn.classList.remove('hover:bg-sky-100');
    });

    event.target.classList.add('selected');

    if (selectedOptionId === correctOptionId) {
        score++;
        feedbackTextElement.textContent = "Risposta Corretta!";
        feedbackTextElement.className = 'text-lg font-medium mb-2 text-green-600';
        event.target.classList.add('correct');
    } else {
        feedbackTextElement.textContent = "Risposta Sbagliata!";
        feedbackTextElement.className = 'text-lg font-medium mb-2 text-red-600';
        event.target.classList.add('incorrect');
        const correctButton = optionsContainer.querySelector(`[data-option-id="${correctOptionId}"]`);
        if (correctButton) {
            correctButton.classList.add('correct');
        }
    }
    
    explanationTextElement.innerHTML = currentQuestion.explanation;
    feedbackContainer.classList.remove('hidden');
    feedbackContainer.className = 'p-4 rounded-lg mb-6 bg-slate-50 border border-slate-200 text-slate-700';

    nextQuestionButton.classList.remove('hidden');
    nextQuestionButton.textContent = (currentQuestionIndex < questions.length - 1) ? "Domanda Successiva" : "Mostra Risultati";
}

nextQuestionButton.addEventListener('click', () => {
    currentQuestionIndex++;
    displayQuestion();
});

function showResults() {
    quizContainer.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    scoreTextElement.textContent = `${score} / ${questions.length}`;
}

restartQuizButton.addEventListener('click', () => {
        resultsContainer.classList.add('hidden');
        uploadContainer.classList.remove('hidden');
        questionCountSelector.classList.remove('hidden');
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
    uploadContainer.classList.remove('hidden');
    resetUploadUI();
    questions = [];
    loadedQuizData = [];
    currentQuestionIndex = 0;
    score = 0;
});