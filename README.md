# Quiz Maker

lang [EN]: [en](https://github.com/fpetranzan/quizMaker/blob/master/README.md) | [it](https://github.com/fpetranzan/quizMaker/blob/master/README_it.md)

A simple web app to create custom quizzes from a user-supplied JSON file. Perfect for reviewing concepts or testing your knowledge quickly and interactively.

## 🚀 Features
The application is divided into two main sections:

**1\. Quiz Player (index.html)**

* **Multiple File Upload**: Load one or more JSON files to merge questions into a single quiz.  
* **Question Selection**: Choose how many questions to include in the test (5, 10, 20, or all).  
* **Randomization**: Both the questions and the order of the answers are shuffled in each session for a new experience every time.  
* **Instant Feedback**: Receive immediate feedback after each answer, complete with a detailed explanation.

**2\. Quiz Editor (editor.html)**

* **Create from Scratch**: Use a dedicated form to create new questions, defining the text, four answer options, the correct answer, and an explanation.  
* **Edit Existing Quizzes**: Upload your JSON files to edit, correct, or delete existing questions.  
* **Search and Filter**: Quickly find the questions you need by searching for keywords or filtering by the correct answer (A, B, C, D).  
* **Intuitive Interface**: Expand each question to view its details (answers and explanation) in a clear and readable format.  
* **Custom Download**: Download the complete set of questions as a single JSON file, with the option to give the file a custom name.

## 📁 JSON File Format

The JSON file must contain a list of questions in the following structure:

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

> 🔹 `id`: id of the question to ask \
> 🔹 `question_text`: the question to ask \
> 🔹 `options`: the four answer options \
> 🔹 `correct_option_id`: id of the correct answer option \
> 🔹 `explanation`: short explanation of the correct answer

## 🧑‍💻 How to Use

1. Clone or download the project:

   ```bash
   git clone https://github.com/your-username/project-name.git
   ```

2. Open index.html in your browser to take a quiz, or editor.html to create or edit one.

**To Take a Quiz:**

1. On the main page, click Scegli file JSON (Choose JSON files) to upload one or more files.  
2. Select the desired number of questions.  
3. Click Inizia Quiz (Start Quiz) to begin.

**To Create or Edit a Quiz:**

1. Navigate to the Editor page.  
2. To create a new question, click \+ Aggiungi Domanda (+ Add Question) and fill out the form.  
3. To edit, upload one or more JSON files. The questions will appear in the list.  
4. Use the search bar or the dropdown menu to filter the questions.  
5. Click on a question to see its details, or use the buttons to edit or delete it.  
6. Enter a filename (optional) and click Scarica JSON (Download JSON) to save your work.

## 🛠️ Technologies Used

* **HTML5**
* **CSS**
* **Vanilla JavaScript**

## 📌 Notes

* The maximum number of quiz questions depends on how many are in your JSON file.
* Answer choices are shuffled on each quiz start.
