var allInputs = document.getElementsByTagName("input");
console.log(allInputs);

var answers = [
    "he",
    "maths book",
    "i",
    "maths book",
    "my",
    "mathematics",
    "mr. schmidt",
    "milk and mangoes",
    "martin and george",
    "video games",
    "his",
    "math",
    "grandparents",
    "english"
];


document.getElementById("submit").addEventListener("click", function() {
    for (i = 0; i < answers.length; i++) {
        if (allInputs[i].value.toLowerCase() == answers[i]) {
            allInputs[i].style.backgroundColor = "green";
            allInputs[i].placeholder = `You answered correctly with: ${allInputs[i].value}.`;
            allInputs[i].style.width = "500px";
            allInputs[i].value = "";
        } else {
            allInputs[i].style.backgroundColor = "red";
            if (allInputs[i].value == "") {
                allInputs[i].value = "nothing";
            }
            allInputs[i].placeholder = `You answered: ${allInputs[i].value}. Correct answer: ${answers[i]}`;
            allInputs[i].value = "";
            allInputs[i].style.width = "500px";
        }
    }
});
