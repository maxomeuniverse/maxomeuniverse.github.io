const inputs = document.querySelector(".inputs");
const resetBtn = document.querySelector(".reset-btn");
const typingInput = document.querySelector(".typing-input");
const hint = document.querySelector(".hint span");
const result = document.querySelector(".result");

let corrects = [];
let nb_incorrect = 0;

function initializeGame(){
    let word = wordList[0].word;
    corrects = [];
    
    let html = "";
    for (let i = 0; i < word.length; i++) {
        html += `<input type="text" id="case" disabled>`;
    }

    inputs.innerHTML = html;
}

function setGame(e){
    let key = e.target.value;
    if(key.match(/^[A-Za-z0-9]+$/)) {
        console.log(key);
        if(wordList[0].word.includes(key)){
            for (let i = 0; i < (wordList[0].word).length; i++) {
                if( (wordList[0].word)[i] === key) {
                    inputs.querySelectorAll("input")[i].value = key;
                    corrects.push(key);
                }
            }

        } else {
            let animated = document.querySelector(".inputs");
            nb_incorrect += 1;

            if(nb_incorrect >= 5){
                hint.innerText = wordList[0].hint;
            }
            
            animated.classList.add("apply-shake");
            
            animated.addEventListener("animationend", (e) => {
                animated.classList.remove("apply-shake");
            });


        }
    }

    typingInput.value = "";

    console.log("> "+corrects);
    if(corrects.length === wordList[0].word.length){

        let links = `Next step : <br> <a href="https://drive.google.com/file/d/1V_FwedADahkAat9dbUSGPj-7xR6CI0B3/view?usp=sharing">maxome_old_data.zip</a>`;
        result.innerHTML = links;

    }
}


initializeGame();

resetBtn.addEventListener("click", initializeGame);
typingInput.addEventListener("input", setGame);
document.addEventListener("keydown", () => typingInput.focus());

