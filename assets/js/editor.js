document.addEventListener('DOMContentLoaded', () => {
    // --- STATE ---
    let quizQuestions = [];
    let editingQuestionId = null;

    // --- DOM ELEMENTS ---
    const fileInput = document.getElementById('json-file-input-editor');
    const fileNamesDisplay = document.getElementById('file-names-editor');
    const downloadButton = document.getElementById('download-json-button');
    const errorDisplay = document.getElementById('editor-error');
    const quizFilenameInput = document.getElementById('quiz-filename-input');
    
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

    /**
     * Filters and renders the list of questions based on current search and filter values.
     */
    const renderQuestionsList = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filterValue = filterSelect.value;

        const filteredQuestions = quizQuestions.filter(q => {
            const searchMatch = q.question_text.toLowerCase().includes(searchTerm) ||
                                q.explanation.toLowerCase().includes(searchTerm) ||
                                q.options.some(opt => opt.text.toLowerCase().includes(searchTerm));
            
            const filterMatch = filterValue === 'all' || q.correct_option_id.toString() === filterValue;

            return searchMatch && filterMatch;
        });

        questionsListContainer.innerHTML = ''; // Clear current list

        if (quizQuestions.length === 0) {
            questionsListContainer.innerHTML = '<p class="text-slate-500">Nessuna domanda ancora. Aggiungine una o carica un file JSON.</p>';
            downloadButton.disabled = true;
            return;
        }
        
        if (filteredQuestions.length === 0) {
            questionsListContainer.innerHTML = '<p class="text-slate-500">Nessuna domanda corrisponde ai criteri di ricerca.</p>';
        }

        downloadButton.disabled = quizQuestions.length === 0;

        filteredQuestions.forEach(question => {
            const questionElement = document.createElement('div');
            questionElement.className = 'question-item p-4 border border-slate-200 rounded-lg';
            questionElement.dataset.id = question.id;

            const header = document.createElement('div');
            header.className = 'flex justify-between items-start cursor-pointer';
            
            const questionText = document.createElement('p');
            questionText.className = 'font-semibold text-slate-800 flex-grow';
            questionText.textContent = question.question_text;
            header.appendChild(questionText);
            
            const buttons = document.createElement('div');
            buttons.className = 'flex gap-2 ml-4 flex-shrink-0';
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
            
            header.onclick = () => {
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
        const question = quizQuestions.find(q => q.id.toString() === id.toString());
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
            quizQuestions = quizQuestions.filter(q => q.id.toString() !== id.toString());
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

    fileInput.addEventListener('change', async (event) => {
        const files = event.target.files;
        if (!files.length) return;
        fileNamesDisplay.textContent = `${files.length} file selezionati.`;
        errorDisplay.textContent = 'Caricamento...';
        try {
            const readPromises = Array.from(files).map(file => {
                return new Promise((resolve, reject) => {
                    if (file.type !== 'application/json') return reject(new Error(`'${file.name}' non è JSON.`));
                    const reader = new FileReader();
                    reader.onload = e => {
                        try {
                            const data = JSON.parse(e.target.result);
                            const questions = data.questions || (Array.isArray(data) ? data : null);
                            if (!questions) throw new Error("Formato JSON non valido.");
                            questions.forEach(validateQuestion);
                            resolve(questions);
                        } catch (err) {
                            reject(new Error(`Errore in '${file.name}': ${err.message}`));
                        }
                    };
                    reader.onerror = () => reject(new Error(`Impossibile leggere '${file.name}'.`));
                    reader.readAsText(file);
                });
            });
            const results = await Promise.all(readPromises);
            const loadedQuestions = results.flat();
            const existingTexts = new Set(quizQuestions.map(q => q.question_text));
            const newQuestions = loadedQuestions.filter(q => !existingTexts.has(q.question_text));
            quizQuestions.push(...newQuestions.map(q => ({...q, id: q.id || Date.now() + Math.random() })));
            
            if (files.length === 1) {
                const singleFilename = files[0].name.replace(/\.json$/i, '');
                quizFilenameInput.value = singleFilename;
            }

            errorDisplay.textContent = `Caricate ${loadedQuestions.length} domande. ${newQuestions.length} nuove aggiunte.`;
            renderQuestionsList();
        } catch (error) {
            errorDisplay.textContent = error.message;
        } finally {
            fileInput.value = '';
        }
    });

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
            const index = quizQuestions.findIndex(q => q.id.toString() === editingQuestionId.toString());
            if (index !== -1) quizQuestions[index] = questionData;
        } else {
            quizQuestions.push(questionData);
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
        if (quizQuestions.length === 0) return;

        let filename = quizFilenameInput.value.trim();
        if (!filename) {
            filename = 'quiz_personalizzato';
        }
        if (!filename.toLowerCase().endsWith('.json')) {
            filename += '.json';
        }

        const dataToDownload = { questions: quizQuestions };
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
