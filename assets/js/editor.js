document.addEventListener('DOMContentLoaded', () => {
    // --- STATE ---
    let editingQuestionId = null;
    let uploadedFiles = [];
    let loadedQuizData = [];  

    // --- DOM ELEMENTS ---
    const fileInput = document.getElementById('json-file-input-editor');
    const uploadContainer = document.getElementById('upload-container');
    const fileNamesDisplay = document.getElementById('file-names-editor');
    const downloadButton = document.getElementById('download-json-button');
    const errorDisplay = document.getElementById('editor-error');
    const quizFilenameInput = document.getElementById('quiz-filename-input');
    const uploadedFilesList = document.getElementById('uploaded-files-list');
    
    const toggleFormButton = document.getElementById('toggle-form-button');
    const formContainer = document.getElementById('editor-form-container');
    const form = document.getElementById('question-form');
    const formTitle = document.getElementById('form-title');
    const editingQuestionIdInput = document.getElementById('editing-question-id');
    const questionTextInput = document.getElementById('question-text-input');
    const optionInputs = {
        A: document.getElementById('option-a-input'),
        B: document.getElementById('option-b-input'),
        C: document.getElementById('option-c-input'),
        D: document.getElementById('option-d-input'),
    };
    const explanationInput = document.getElementById('explanation-input');
    const saveButton = document.getElementById('save-question-button');
    const cancelEditButton = document.getElementById('cancel-edit-button');

    const questionsListContainer = document.getElementById('questions-list');
    const searchInput = document.getElementById('search-input');
    const filterSelect = document.getElementById('filter-select');

    // --- FUNCTIONS ---

    fileInput.addEventListener('change', (event) => {
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

    /**
     * Filters and renders the list of questions based on current search and filter values.
     */
    const renderQuestionsList = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filterValue = filterSelect.value;

        const filteredQuestions = loadedQuizData.filter(q => {
            const searchMatch = q.question_text.toLowerCase().includes(searchTerm) ||
                                q.explanation.toLowerCase().includes(searchTerm) ||
                                q.options.some(opt => opt.text.toLowerCase().includes(searchTerm));
            
            const filterMatch = filterValue === 'all' || q.correct_option_id.toString() === filterValue;

            return searchMatch && filterMatch;
        });

        questionsListContainer.innerHTML = ''; // Clear current list

        if (loadedQuizData.length === 0) {
            questionsListContainer.innerHTML = '<p class="text-slate-500">Nessuna domanda ancora. Aggiungine una o carica un file JSON.</p>';
            downloadButton.disabled = true;
            return;
        }
        
        if (filteredQuestions.length === 0) {
            questionsListContainer.innerHTML = '<p class="text-slate-500">Nessuna domanda corrisponde ai criteri di ricerca.</p>';
        }

        downloadButton.disabled = loadedQuizData.length === 0;

        filteredQuestions.forEach(question => {
            const questionElement = document.createElement('div');
            questionElement.className = 'question-item p-4 border border-slate-200 rounded-lg cursor-pointer';
            questionElement.dataset.id = question.id;

            const header = document.createElement('div');
            header.className = 'flex justify-between items-start max-sm:flex-col';
            
            const questionText = document.createElement('p');
            questionText.className = 'font-semibold text-slate-800 flex-grow';
            questionText.textContent = question.question_text;
            header.appendChild(questionText);
            
            const buttons = document.createElement('div');
            buttons.className = 'flex gap-2 ml-4 flex-shrink-0 max-sm:ml-0 max-sm:mt-2';
            const editButton = document.createElement('button');
            editButton.textContent = 'Modifica';
            editButton.className = 'edit-btn bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-1 px-3 rounded';
            editButton.onclick = (e) => { e.stopPropagation(); handleEdit(question.id); };
            buttons.appendChild(editButton);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Elimina';
            deleteButton.className = 'delete-btn bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1 px-3 rounded';
            deleteButton.onclick = (e) => { e.stopPropagation(); handleDelete(question.id); };
            buttons.appendChild(deleteButton);
            header.appendChild(buttons);

            const detailsContent = document.createElement('div');
            detailsContent.className = 'details-content hidden mt-4';
            detailsContent.innerHTML = `
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    ${question.options.map(opt => `
                        <div class="p-3 border rounded-md ${opt.id.toString() === question.correct_option_id.toString() ? 'details-correct-option' : 'bg-slate-50'}">
                            <strong class="mr-1">${opt.id}:</strong> ${opt.text}
                        </div>
                    `).join('')}
                </div>
                <div class="mt-3 p-3 bg-sky-50 border border-sky-200 rounded-md text-sm">
                    <strong>Spiegazione:</strong> ${question.explanation}
                </div>
            `;
            
            questionElement.appendChild(header);
            questionElement.appendChild(detailsContent);
            
            questionElement.onclick = () => {
                detailsContent.classList.toggle('hidden');
            };

            questionsListContainer.appendChild(questionElement);
        });
    };

    /**
     * Resets the form to its initial state.
     */
    const resetForm = () => {
        form.reset();
        editingQuestionId = null;
        editingQuestionIdInput.value = '';
        formTitle.textContent = 'Aggiungi una Nuova Domanda';
        saveButton.textContent = 'Salva Domanda';
        cancelEditButton.classList.add('hidden');
    };

    /**
     * Populates the form to edit a specific question.
     */
    const handleEdit = (id) => {
        const question = loadedQuizData.find(q => q.id.toString() === id.toString());
        if (!question) return;

        editingQuestionId = id;
        editingQuestionIdInput.value = id;
        
        questionTextInput.value = question.question_text;
        explanationInput.value = question.explanation;

        question.options.forEach(opt => {
            if (optionInputs[opt.id]) {
                optionInputs[opt.id].value = opt.text;
            }
        });

        const correctRadio = document.querySelector(`input[name="correct-answer"][value="${question.correct_option_id}"]`);
        if (correctRadio) correctRadio.checked = true;

        formTitle.textContent = 'Modifica Domanda';
        saveButton.textContent = 'Aggiorna Domanda';
        cancelEditButton.classList.remove('hidden');
        
        formContainer.classList.remove('hidden');
        toggleFormButton.textContent = '- Nascondi Form';
        window.scrollTo({ top: formContainer.offsetTop - 20, behavior: 'smooth' });
    };

    /**
     * Deletes a question from the list.
     */
    const handleDelete = (id) => {
        if (confirm('Sei sicuro di voler eliminare questa domanda?')) {
            loadedQuizData = loadedQuizData.filter(q => q.id.toString() !== id.toString());
            if (editingQuestionId && editingQuestionId.toString() === id.toString()) {
                resetForm();
            }
            renderQuestionsList();
        }
    };
    
    /**
     * Validates a question object structure.
     */
    const validateQuestion = (q, index) => {
         if (!q.question_text || !q.options || !Array.isArray(q.options) || q.options.length === 0 || q.correct_option_id === undefined || !q.explanation) {
            throw new Error(`La domanda ${index + 1} ha una struttura non valida.`);
        }
    };

    // --- EVENT LISTENERS ---

    toggleFormButton.addEventListener('click', () => {
        const isHidden = formContainer.classList.toggle('hidden');
        toggleFormButton.textContent = isHidden ? '+ Aggiungi Domanda' : '- Nascondi Form';
        if (isHidden) {
            resetForm(); // Reset form when hiding
        }
    });

    async function handleFiles(files) {
        if (!files.length) return;

        errorDisplay.textContent = 'Caricamento e validazione in corso...';
        errorDisplay.classList.remove('text-red-500', 'text-green-500');

        const newFilesToProcess = Array.from(files).filter(file => 
            !uploadedFiles.some(uploadedFile => uploadedFile.name === file.name && uploadedFile.size === file.size)
        );

        if (newFilesToProcess.length === 0) {
            errorDisplay.textContent = 'I file selezionati sono già stati caricati.';
            errorDisplay.classList.add('text-red-500');
            return;
        }

        const fileReadPromises = newFilesToProcess.map(file => {
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
                    resolve({ name: file.name, data: questionsFromFile, rawContent: e.target.result });
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
            
            results.forEach(fileResult => {
                uploadedFiles.push({ name: fileResult.name, content: fileResult.rawContent });
                loadedQuizData.push(...fileResult.data);
            });

            if (loadedQuizData.length === 0) throw new Error("Nessuna domanda valida trovata nei file selezionati.");
            
            errorDisplay.textContent = `Caricate con successo ${loadedQuizData.length} domande da ${uploadedFiles.length} file.`;
            errorDisplay.classList.add('text-green-500');
            updateUploadedFilesList(); // Aggiorna la lista visibile dei file
            renderQuestionsList();
        } catch (error) {
            console.error("Errore durante il caricamento:", error);
            errorDisplay.textContent = error.message;
            errorDisplay.classList.add('text-red-500');
        } finally {
            fileInput.value = '';
        }
    };

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

    function updateUploadedFilesList() {
        uploadedFilesList.innerHTML = ''; // Pulisce la lista esistente
        if (uploadedFiles.length === 0) {
            fileNamesDisplay.textContent = "Nessun file selezionato.";
            return;
        }

        uploadedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'uploaded-file-item';
            fileItem.innerHTML = `
                <span>${file.name}</span>
                <button class="remove-file-button" data-index="${index}">&times;</button>
            `;
            uploadedFilesList.appendChild(fileItem);
        });

        // Aggiungi listener per i pulsanti di rimozione
        uploadedFilesList.querySelectorAll('.remove-file-button').forEach(button => {
            button.addEventListener('click', removeFile);
        });
    }

    function removeFile(event) {
        const indexToRemove = parseInt(event.target.dataset.index, 10);
        
        // Rimuovi il file dall'array uploadedFiles
        const removedFile = uploadedFiles.splice(indexToRemove, 1)[0];

        // Ricostruisci loadedQuizData dai file rimanenti
        loadedQuizData = [];
        uploadedFiles.forEach(file => {
            try {
                const parsedData = JSON.parse(file.content);
                const questionsFromFile = parsedData.questions || (Array.isArray(parsedData) ? parsedData : null);
                if (questionsFromFile) {
                    loadedQuizData.push(...questionsFromFile);
                }
            } catch (e) {
                console.error(`Errore nel ri-parsing del file ${file.name} dopo la rimozione:`, e);
                // Questo caso dovrebbe essere raro se la validazione iniziale ha funzionato
            }
        });

        updateUploadedFilesList(); // Aggiorna la UI

        if (loadedQuizData.length === 0) {
            errorDisplay.textContent = "Tutti i file sono stati rimossi. Carica nuovi file JSON.";
            errorDisplay.classList.remove('text-green-500');
            errorDisplay.classList.add('text-red-500');
        } else {
            errorDisplay.textContent = `File '${removedFile.name}' rimosso. ${loadedQuizData.length} domande rimanenti.`;
            errorDisplay.classList.add('text-green-500');
        }
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const correctOptionId = form.querySelector('input[name="correct-answer"]:checked')?.value;
        if (!correctOptionId) {
            alert('Per favore, seleziona una risposta corretta.');
            return;
        }
        const questionData = {
            id: editingQuestionId || Date.now(),
            question_text: questionTextInput.value.trim(),
            options: [
                { id: 'A', text: optionInputs.A.value.trim() },
                { id: 'B', text: optionInputs.B.value.trim() },
                { id: 'C', text: optionInputs.C.value.trim() },
                { id: 'D', text: optionInputs.D.value.trim() },
            ],
            correct_option_id: correctOptionId,
            explanation: explanationInput.value.trim(),
        };
        if (editingQuestionId) {
            const index = loadedQuizData.findIndex(q => q.id.toString() === editingQuestionId.toString());
            if (index !== -1) loadedQuizData[index] = questionData;
        } else {
            loadedQuizData.push(questionData);
        }
        resetForm();
        renderQuestionsList();
        formContainer.classList.add('hidden');
        toggleFormButton.textContent = '+ Aggiungi Domanda';
    });

    cancelEditButton.addEventListener('click', () => {
        resetForm();
        formContainer.classList.add('hidden');
        toggleFormButton.textContent = '+ Aggiungi Domanda';
    });

    downloadButton.addEventListener('click', () => {
        if (loadedQuizData.length === 0) return;

        let filename = quizFilenameInput.value.trim();
        if (!filename) {
            filename = 'quiz_personalizzato';
        }
        if (!filename.toLowerCase().endsWith('.json')) {
            filename += '.json';
        }

        const dataToDownload = { questions: loadedQuizData };
        const jsonString = JSON.stringify(dataToDownload, null, 4);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    searchInput.addEventListener('input', renderQuestionsList);
    filterSelect.addEventListener('change', renderQuestionsList);

    // --- INITIAL RENDER ---
    renderQuestionsList();
});
