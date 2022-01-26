var allInputs = document.getElementsByTagName("input");
console.log(allInputs);
var section_one = [
    ["Er hat ein Buch.", "er", "buch"],
    ["Ich trinke Kaffee.", "ich", "kaffee"],
    ["Martin und Georg kaufen viele CDs.", "martin georg", "CDs"],
    ["Peter hat den Stift.", "peter", "stift"],
    ["Herr Schmidt trinkt eine Cola und ein Bier.", "herr schmidt", "cola bier"],
    ["Unsere Großeltern sprechen Deutsch.", "Großeltern", "Deutsch"]
]

var correctAnswers = [
    "er",
    "buch",
    "ich",
    "kaffee",
    "martin and georg",
    "cds",
    "peter",
    "stift",
    "herr schmidt",
    "cola and bier",
    "großeltern",
    "deutsch"
]

document.getElementById("submit").addEventListener("click", function () {
    for (i = 0; i < correctAnswers.length; i++) {
        if (allInputs[i].value.toLowerCase().replace(" ", "") == correctAnswers[i]) {
            allInputs[i].style.backgroundColor = "green";
            allInputs[i].placeholder = `You answered correctly with: ${allInputs[i].value}.`;
            allInputs[i].style.width = "500px";
            allInputs[i].value = "";
        } else {
            allInputs[i].style.backgroundColor = "red";
            if (allInputs[i].value == "") {
                allInputs[i].value = "nothing";
            }
            allInputs[i].placeholder = `You answered: ${allInputs[i].value}. Correct answer: ${correctAnswers[i]}`;
            allInputs[i].value = "";
            allInputs[i].style.width = "500px";
        }
    }
});

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display == "block") {
            setTimeout(() => {
                content.style.display = "none";
            }, 500);
            content.style.animation = "fadeout 0.5s";
        } else {
            content.style.display = "block";
            content.style.animationDirection = "normal";
            content.style.animation = "fadein 0.5s";
        }
    });
}