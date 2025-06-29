Quiz Maker & EditorUn'applicazione web per creare, modificare e svolgere quiz personalizzati. Carica le tue domande da un file JSON, creane di nuove da zero tramite un'interfaccia intuitiva e metti alla prova le tue conoscenze.Lingua / LanguageItalianoEnglish🚀 Quiz Maker & Editor (Italiano)Funzionalità PrincipaliL'applicazione è divisa in due sezioni principali:1. Player del Quiz (index.html)Caricamento Multiplo: Carica uno o più file JSON per unire le domande in un unico quiz.Selezione Domande: Scegli quante domande includere nel test (5, 10, 20, o tutte).Randomizzazione: Sia le domande che l'ordine delle risposte vengono mescolati a ogni partita per un'esperienza sempre nuova.Feedback Immediato: Ricevi un riscontro istantaneo dopo ogni risposta, con una spiegazione dettagliata.2. Editor di Quiz (editor.html)Creazione da Zero: Utilizza un form dedicato per creare nuove domande, definendo testo, quattro opzioni di risposta, la risposta corretta e una spiegazione.Modifica Esistente: Carica i tuoi file JSON per modificare, correggere o eliminare domande esistenti.Ricerca e Filtro: Trova rapidamente le domande che ti interessano cercando per parola chiave o filtrando per risposta corretta (A, B, C, D).Interfaccia Intuitiva: Espandi ogni domanda per vederne i dettagli (risposte e spiegazione) in un formato chiaro e leggibile.Download Personalizzato: Scarica il set completo di domande in un singolo file JSON, con la possibilità di assegnare un nome personalizzato al file.📁 Formato del File JSONIl file JSON deve contenere una lista di domande con la seguente struttura:{
    "questions": [
        {
            "id": 1,
            "question_text": "Testo della domanda...",
            "options": [
                { "id": "A", "text": "Opzione A" },
                { "id": "B", "text": "Opzione B" },
                { "id": "C", "text": "Opzione C" },
                { "id": "D", "text": "Opzione D" }
            ],
            "correct_option_id": "C",
            "explanation": "Breve spiegazione della risposta corretta."
        }
    ]
}
🧑‍💻 Come UsareClona o scarica il progetto.Apri index.html nel browser per svolgere un quiz, oppure editor.html per crearne o modificarne uno.Per Svolgere un Quiz:Nella pagina principale, clicca su Scegli file JSON per caricare uno o più file.Seleziona il numero di domande desiderato.Clicca su Inizia Quiz per cominciare.Per Creare o Modificare un Quiz:Vai alla pagina Editor.Per creare una nuova domanda, clicca su + Aggiungi Domanda e compila il form.Per modificare, carica uno o più file JSON. Le domande appariranno nella lista.Usa la barra di ricerca o il menu a tendina per filtrare le domande.Clicca su una domanda per vederne i dettagli, o usa i pulsanti per modificarla o eliminarla.Inserisci un nome per il file (opzionale) e clicca su Scarica JSON per salvare il tuo lavoro.🛠️ Tecnologie UtilizzateHTML5Tailwind CSSVanilla JavaScript (Nessuna dipendenza esterna)🚀 Quiz Maker & Editor (English)A web application to create, edit, and take custom quizzes. Load your questions from a JSON file, create new ones from scratch through a user-friendly interface, and test your knowledge.Main FeaturesThe application is divided into two main sections:1. Quiz Player (index.html)Multiple File Upload: Load one or more JSON files to merge questions into a single quiz.Question Selection: Choose how many questions to include in the test (5, 10, 20, or all).Randomization: Both the questions and the order of the answers are shuffled in each session for a new experience every time.Instant Feedback: Receive immediate feedback after each answer, complete with a detailed explanation.2. Quiz Editor (editor.html)Create from Scratch: Use a dedicated form to create new questions, defining the text, four answer options, the correct answer, and an explanation.Edit Existing Quizzes: Upload your JSON files to edit, correct, or delete existing questions.Search and Filter: Quickly find the questions you need by searching for keywords or filtering by the correct answer (A, B, C, D).Intuitive Interface: Expand each question to view its details (answers and explanation) in a clear and readable format.Custom Download: Download the complete set of questions as a single JSON file, with the option to give the file a custom name.📁 JSON File FormatThe JSON file must contain a list of questions with the following structure:{
    "questions": [
        {
            "id": 1,
            "question_text": "Question text goes here...",
            "options": [
                { "id": "A", "text": "Option A" },
                { "id": "B", "text": "Option B" },
                { "id": "C", "text": "Option C" },
                { "id": "D", "text": "Option D" }
            ],
            "correct_option_id": "C",
            "explanation": "A brief explanation of the correct answer."
        }
    ]
}
🧑‍💻 How to UseClone or download the project.Open index.html in your browser to take a quiz, or editor.html to create or edit one.To Take a Quiz:On the main page, click Scegli file JSON (Choose JSON files) to upload one or more files.Select the desired number of questions.Click Inizia Quiz (Start Quiz) to begin.To Create or Edit a Quiz:Navigate to the Editor page.To create a new question, click + Aggiungi Domanda (+ Add Question) and fill out the form.To edit, upload one or more JSON files. The questions will appear in the list.Use the search bar or the dropdown menu to filter the questions.Click on a question to see its details, or use the buttons to edit or delete it.Enter a filename (optional) and click Scarica JSON (Download JSON) to save your work.🛠️ Technologies UsedHTML5Tailwind CSSVanilla JavaScript (No external dependencies)