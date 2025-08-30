# Quiz Maker

lang [IT]: [en](https://github.com/fpetranzan/quizMaker/blob/master/README.md) | [it](https://github.com/fpetranzan/quizMaker/blob/master/README_it.md)

Una semplice web app per creare quiz personalizzati a partire da file JSON forniti dall'utente. Perfetta per ripassare concetti o testare le proprie conoscenze in modo rapido e interattivo.

## 🚀 Funzionalità
L'applicazione è divisa in due sezioni principali:

**1\. Player del Quiz (index.html)**

* **Caricamento Multiplo**: Carica uno o più file JSON per unire le domande in un unico quiz.  
* **Selezione Domande**: Scegli quante domande includere nel test (5, 10, 20, o tutte).  
* **Randomizzazione**: Sia le domande che l'ordine delle risposte vengono mescolati a ogni partita per un'esperienza sempre nuova.  
* **Feedback Immediato**: Ricevi un riscontro istantaneo dopo ogni risposta, con una spiegazione dettagliata.

**2\. Editor di Quiz (editor.html)**

* **Creazione da Zero**: Utilizza un form dedicato per creare nuove domande, definendo testo, quattro opzioni di risposta, la risposta corretta e una spiegazione.  
* **Modifica Esistente**: Carica i tuoi file JSON per modificare, correggere o eliminare domande esistenti.  
* **Ricerca e Filtro**: Trova rapidamente le domande che ti interessano cercando per parola chiave o filtrando per risposta corretta (A, B, C, D).  
* **Interfaccia Intuitiva**: Espandi ogni domanda per vederne i dettagli (risposte e spiegazione) in un formato chiaro e leggibile.  
* **Download Personalizzato**: Scarica il set completo di domande in un singolo file JSON, con la possibilità di assegnare un nome personalizzato al file.

## 📁 Formato del file JSON

Il file JSON deve contenere una lista di domande con la seguente struttura:

```json
{  
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
```

> 🔹 `id`: id della domanda da porre \
> 🔹 `question_text`: la domanda da porre \
> 🔹 `options`: le quattro opzioni di risposta \
> 🔹 `correct_option_id`: id dell'opzione di risposta corretta \
> 🔹 `explanation`: breve spiegazione della risposta corretta

## 🧑‍💻 Come usare l'app

1. Clona o scarica il progetto:

   ```bash
   git clone https://github.com/tuo-username/nome-del-progetto.git
   ```

2. Apri index.html nel browser per svolgere un quiz, oppure editor.html per crearne o modificarne uno.

**Per Svolgere un Quiz:**

1. Nella pagina principale, clicca su Scegli file JSON per caricare uno o più file.  
2. Seleziona il numero di domande desiderato.  
3. Clicca su Inizia Quiz per cominciare.

**Per Creare o Modificare un Quiz:**

1. Vai alla pagina Editor.  
2. Per creare una nuova domanda, clicca su \+ Aggiungi Domanda e compila il form.  
3. Per modificare, carica uno o più file JSON. Le domande appariranno nella lista.  
4. Usa la barra di ricerca o il menu a tendina per filtrare le domande.  
5. Clicca su una domanda per vederne i dettagli, o usa i pulsanti per modificarla o eliminarla.  
6. Inserisci un nome per il file (opzionale) e clicca su Scarica JSON per salvare il tuo lavoro.

## 🛠️ Tecnologie Utilizzate

* **HTML5**
* **CSS**
* **JavaScript Vanilla**

## 📌 Note

* Il numero massimo di domande selezionabili dipende dalla quantità di domande presenti nel file JSON.
* Le opzioni di risposta vengono mischiate ad ogni avvio del quiz.