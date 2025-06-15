# Quiz Maker

lang [IT]: [en](https://github.com/fpetranzan/quizMaker/blob/master/README.md) | [it](https://github.com/fpetranzan/quizMaker/blob/master/README_it.md)

Una semplice web app per creare quiz personalizzati a partire da file JSON forniti dall'utente. Perfetta per ripassare concetti o testare le proprie conoscenze in modo rapido e interattivo.

## 🚀 Funzionalità

* Caricamento di domande tramite file JSON
* Selezione del numero di domande per quiz
* Scelta casuale delle domande dal file caricato
* Randomizzazione delle risposte multiple
* Interfaccia semplice e immediata

## 📁 Formato del file JSON

Il file JSON deve contenere una lista di domande con la seguente struttura:

```json
{
    "questions": [
        {
            "id": 1,
            "question_text": "Damanda1",
            "options": [
                {
                    "id": "A",
                    "text": "Opzione1"
                },
                {
                    "id": "B",
                    "text": "Opzione2"
                },
                {
                    "id": "C",
                    "text": "Opzione3"
                },
                {
                    "id": "D",
                    "text": "Opzione4"
                }
            ],
            "correct_option_id": "Id opzione corretta",
            "explanation": "Breve spiegazione della risposta corretta"
        },
        {
            "id": 1,
            "question_text": "Damanda2",
            "options": [
                {
                    "id": "A",
                    "text": "Opzione1"
                },
                {
                    "id": "B",
                    "text": "Opzione2"
                },
                {
                    "id": "C",
                    "text": "Opzione3"
                },
                {
                    "id": "D",
                    "text": "Opzione4"
                }
            ],
            "correct_option_id": "Id opzione corretta",
            "explanation": "Breve spiegazione della risposta corretta"
        }
    ]
}
```

> 🔹 `id`: id della domanda da porre
> 🔹 `question_text`: la domanda da porre
> 🔹 `options`: le quattro opzioni di risposta
> 🔹 `correct_option_id`: id dell'opzione di risposta corretta
> 🔹 `explanation`: breve spiegazione della risposta corretta

## 🧑‍💻 Come usare l'app

1. Clona o scarica il progetto:

   ```bash
   git clone https://github.com/tuo-username/nome-del-progetto.git
   ```

2. Apri `index.html` in un browser moderno.

3. Carica il tuo file JSON con le domande.

4. Seleziona il numero di domande desiderate per il quiz.

5. Clicca su "Avvia Quiz" per iniziare!

## 🛠 Tecnologie utilizzate

* **HTML5**
* **CSS3**
* **JavaScript Vanilla**

## 📌 Note

* Il numero massimo di domande selezionabili dipende dalla quantità di domande presenti nel file JSON.
* Le opzioni di risposta vengono mischiate ad ogni avvio del quiz.