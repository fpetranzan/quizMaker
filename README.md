# Quiz Maker

lang [EN]: [en](https://github.com/fpetranzan/quizMaker/blob/master/README.md) | [it](https://github.com/fpetranzan/quizMaker/blob/master/README_it.md)

A simple web app to create custom quizzes from a user-supplied JSON file. Perfect for reviewing concepts or testing your knowledge quickly and interactively.

## 🚀 Features

* Upload questions via JSON file
* Select the number of questions for the quiz
* Random selection of questions from the uploaded file
* Random order of multiple-choice answers
* Simple and intuitive interface

## 📁 JSON File Format

The JSON file must contain a list of questions in the following structure:

```json
{
    "questions": [
        {
            "id": 1,
            "question_text": "Question1",
            "options": [
                {
                    "id": "A",
                    "text": "Option1"
                },
                {
                    "id": "B",
                    "text": "Option2"
                },
                {
                    "id": "C",
                    "text": "Option3"
                },
                {
                    "id": "D",
                    "text": "Option4"
                }
            ],
            "correct_option_id": "Correct option id",
            "explanation": "Short explanation of the correct answer"
        },
        {
            "id": 1,
            "question_text": "Question2",
            "options": [
                {
                    "id": "A",
                    "text": "Option1"
                },
                {
                    "id": "B",
                    "text": "Option2"
                },
                {
                    "id": "C",
                    "text": "Option3"
                },
                {
                    "id": "D",
                    "text": "Option4"
                }
            ],
            "correct_option_id": "Correct option id",
            "explanation": "Short explanation of the correct answer"
        }
    ]
}
```

> 🔹 `id`: id of the question to ask
> 🔹 `question_text`: the question to ask
> 🔹 `options`: the four answer options
> 🔹 `correct_option_id`: id of the correct answer option
> 🔹 `explanation`: short explanation of the correct answer

## 🧑‍💻 How to Use

1. Clone or download the project:

   ```bash
   git clone https://github.com/your-username/project-name.git
   ```

2. Open `index.html` in a modern web browser.

3. Upload your JSON file containing the questions.

4. Select the number of questions you want in the quiz.

5. Click "Start Quiz" to begin!

## 🛠 Technologies Used

* **HTML5**
* **CSS3**
* **Vanilla JavaScript**

## 📌 Notes

* The maximum number of quiz questions depends on how many are in your JSON file.
* Answer choices are shuffled on each quiz start.
