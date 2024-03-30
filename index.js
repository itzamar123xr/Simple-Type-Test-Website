// Common variables and constants
const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

// Function to render a new quote
const renderNewQuote = async () => {
    const response = await fetch(quoteApiUrl);
    const data = await response.json();
    quote = data.content;

    const arr = quote.split("").map((value) => {
        return "<span class='quote-chars'>" + value + "</span>";
    });
    quoteSection.innerHTML = arr.join("");
};

// Function to update timer
const updateTimer = () => {
    if (time == 0) {
        displayResult();
    } else {
        document.getElementById("timer").innerText = --time + "s";
    }
};

// Function to reduce time
const timeReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
};

// Function to display test result
const displayResult = () => {
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    let timeTaken = 1;
    if (time != 0) {
        timeTaken = (60 - time) / 100;
    }
    document.getElementById("wpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + "wpm";
    document.getElementById("accuracy").innerText = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%";
};

const restartTest = () => {
    clearInterval(timer);
    document.getElementById("timer").innerText = "60s";
    document.getElementById("mistakes").innerText = "0";
    document.getElementById("quote-input").value = "";
    document.querySelector(".result").style.display = "none";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    mistakes = 0;
    time = 60;

    // Render new quote after resetting
    renderNewQuote();
};

// Function to start the test
const startTest = () => {
    mistakes = 0;
    timer = "";
    userInput.disabled = false;
    timeReduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
};

// Event listener for restart button
document.getElementById("restart-test").addEventListener("click", restartTest);

// Event listener for start button
document.getElementById("start-test").addEventListener("click", startTest);

// Event listener for stop button
document.getElementById("stop-test").addEventListener("click", displayResult);

// Event listener for input field
userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars");
    quoteChars = Array.from(quoteChars);

    let userInputChars = userInput.value.split("");
    quoteChars.forEach((char, index) => {
        if (char.innerText == userInputChars[index]) {
            char.classList.add("success");
        } else if (userInputChars[index] == null) {
            if (char.classList.contains("success")) {
                char.classList.remove("success");
            } else {
                char.classList.remove("fail");
            }
        } else {
            if (!char.classList.contains("fail")) {
                mistakes++;
                char.classList.add("fail");
            }
            document.getElementById("mistakes").innerText = mistakes;
        }

        let check = quoteChars.every((element) => {
            return element.classList.contains("success");
        });

        if (check) {
            displayResult();
        }
    });
});

// On window load
window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    renderNewQuote();
};
