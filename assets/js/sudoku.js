//-------------------------------------------------------------------------------------
// Variables
var numSelected = null;
var tileSelected = null;

var errors = 0;

var nbDigits = 6;
var currentDifficulty = 0;

var board = [
    [ // EASY
        "21--3-",
        "53-4--",
        "--1---",
        "--5216",
        "46-1--",
        "-5-36-"
    ],
    [
        // MEDIUM
        "-4----",
        "-25---",
        "---5--",
        "--3-61",
        "-3---5",
        "---132",
    ],
    [ // HARD
      "----6-",
      "---4-1",
      "5-1---",
      "-3--2-",
      "-1-3--",
      "--2---",
    ]
]

var boardTruePlay = [
    [ // EASY
        [3, 3, 1, 4, 3, 3], // Rows
        [3, 4, 2, 4, 3, 1]  // Columns
    ],
    [
        // MEDIUM
        [1, 2, 1, 3, 2, 3], // Rows
        [0, 3, 2, 2, 2, 3]
    ],
    [
        // HARD
        [1, 2, 2, 2, 2, 1], // Rows
        [1, 2, 2, 2, 2, 1]  // Columns
    ]
]

var solution = [
    [ // EASY
        "214635",
        "536421",
        "621543",
        "345216",
        "463152",
        "152364"
    ],
    [
        // MEDIUM
        "341256",
        "625314",
        "416523",
        "253461",
        "132645",
        "564132",
    ],
    [
        //HARD
        "154263",
        "263451",
        "521634",
        "436125",
        "615342",
        "342516",
    ]
]

//-------------------------------------------------------------------------------------
// On Start Functions

window.onload = function(){
    loadDifficulty();
    
    setDifficultyButton();
    setGame();
}

function loadDifficulty(){
    let urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);

    if(window.location.search == ""){ // If no parameters in the url
        currentDifficulty = 0; // default on EASY
        return; // stop here
    }
    
    currentDifficulty = urlParams.get("dif"); // Get difficulty value from url parameters

}

function setDifficultyButton(){
    let parent = document.getElementById("difficulty");
    let easyButton = parent.querySelector("#easy");
    let mediumButton = parent.querySelector("#medium");
    let hardButton = parent.querySelector("#hard");

    easyButton.addEventListener("click", function(event){updateDifficulty(0);});
    mediumButton.addEventListener("click", function(event){updateDifficulty(1);});
    hardButton.addEventListener("click", function(event){updateDifficulty(2);});
}

function updateDifficulty(newDifficulty){
    window.open("https://maxomeuniverse.github.io/sudoku?dif="+newDifficulty, '_self');    
}

function setGame() {
    // Set digit selection part
    for(let i = 1; i <= nbDigits; i++){
        // Set digits divs
        let number = document.createElement("div");
        number.id = i;
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
        
        // Add emote image         
        addEmoteImageElement(number, i);

        number.addEventListener("click", selectNumber);
    }

    // Set sudoku board (6x6)
    for(let r = 0; r < nbDigits; r++){
        for(let c = 0; c < nbDigits; c++){
            
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            
            if(board[currentDifficulty][r][c] != "-"){ // If ...
                // tile.innerText = board[currentDifficulty][r][c];
                let imageElem = addEmoteImageElement(tile, board[currentDifficulty][r][c]);
                let idElem = createIdTextElement(tile, board[currentDifficulty][r][c]);
                
                idElem.classList.add("solution");                
                tile.classList.add("tile-start");
            } else {
                createIdTextElement(tile, "-");
            }
            
            // Set decoration grid lines // TODO fix it
            if(r == 1 || r == 3) {
                tile.classList.add("horizontal-line");
            }
            if(c == 2){
                tile.classList.add("vertical-line");
            }
            
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
            
            tile.addEventListener("click", selectTile);
        }
    }

}

//-------------------------------------------------------------------------------------
// Selection functions

function selectNumber(){
    // Unset "selection" class (back to normal css)
    if(numSelected != null){
        numSelected.classList.remove("number-selected");
    }

    // Set "selection" class
    numSelected = this;
    numSelected.classList.add("number-selected");

}

function selectTile(){
    if(numSelected){
        digitId = getTileDigitId(this);
        
        // If the tile don't have to be changed (because i's the solution)
        if(isSolutionTile(this) || isValidTile(this)){ 
            return; // do nothing
        } 

        // If (over)write the tile
        // Remove old tile's element
        removeEmoteImageElement(this);
        removeIdTextElement(this);
        // Add "new" elements
        addEmoteImageElement(this, numSelected.id);
        createIdTextElement(this, numSelected.id);

        // Check solution
        let coords = this.id.split("-");// get array of coordinates
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        if (solution[currentDifficulty][r][c] == numSelected.id ){ 
            if(!isCorrectTile(this)){ // Check solution and if not correct (means not already set as correct)

                // Note that this tile is correct
                this.classList.add("correct");
                
                // Update row solved
                if(boardTruePlay[currentDifficulty][0][r] < nbDigits){
                    boardTruePlay[currentDifficulty][0][r] += 1;
                }
                // Update column solved
                if( boardTruePlay[currentDifficulty][1][c] < nbDigits){                
                    boardTruePlay[currentDifficulty][1][c] += 1;
                }
                
                checkboardTruePlay();
            }
        } else {
            errors += 1;
            document.getElementById("errors").innerText = errors;
        }

        
    }
    else if (tileSelected){// If num not selected but tile selected

    }

}

// ------------------------------------------------------------------------------------
// Other logic functions
function checkboardTruePlay(){
    // Check validity
    for(let i = 0; i < nbDigits; i++){
        // Check row
        if(boardTruePlay[currentDifficulty][0][i] == 6){
            setTileValidity(i, 0);
        }

        // Check col
        if(boardTruePlay[currentDifficulty][1][i] == 6){
            setTileValidity(i, 1);
        }
    }
}

//-------------------------------------------------------------------------------------
// Add element function

function addEmoteImageElement(parent, id){
    let imageElem = document.createElement("img");
    let imagePath = getImagePath(id);
    imageElem.setAttribute("src", imagePath);
    imageElem.setAttribute("height", "40");
    imageElem.setAttribute("width", "40");
    imageElem.id = "emote";
    parent.appendChild(imageElem);

    return imageElem;
}

function createIdTextElement(parent, id){
    let elem = document.createElement("span");
    elem.id = id;
    elem.classList.add("info");
    // elem.innerText = id;
    parent.appendChild(elem);

    return elem;
}

// type : 0 = row / 1 = col
function setTileValidity(id, type){
    let elements = document.getElementById("board").children;
    for (let i = 0; i < elements.length; i++) {
        let elem = elements[i];

        let coords = elem.id.split("-");// get array of coordinates
        if(coords[type] == id){
            elem.classList.add("valid");
        }
    }
}

//-------------------------------------------------------------------------------------
// Remove element function

function removeEmoteImageElement(elem){
    if(elem.querySelector('#emote')){ // If there is an emote image
        elem.querySelector('#emote').remove();
    }
}

function removeIdTextElement(elem){
    elem.getElementsByClassName("info")[0].remove();
}

//-------------------------------------------------------------------------------------
// Getter and Checker function

function isEmoteImageIn(elem){
    return elem.querySelector('#emote') != null;
}

function isSolutionTile(elem){
    return elem.getElementsByClassName("info")[0].classList.contains("solution");
}

function isValidTile(elem){
    return elem.classList.contains("valid");
}

function isCorrectTile(elem){
    return elem.classList.contains("correct");
}

function getTileDigitId(elem){
    return elem.getElementsByClassName("info")[0].id;
}


function getImagePath(id){
    id = parseInt(id);
    switch(id){
        case 1:        
            return "assets/img/emotes_56/crane_56.png";
            break;
        case 2:
            return "assets/img/emotes_56/emote_dmmu_56.png";
            break;
        case 3:
            return "assets/img/emotes_56/emote_pog_2_56.png";
            break;
        case 4:
            return "assets/img/emotes_56/icon_pntChaine_leak_shadow_56.png";
            break;
        case 5:
            return "assets/img/emotes_56/moulaxome_56.png";
            break;
        case 6:
            return "assets/img/emotes_56/pupa_love1_56.png";
            break;
        default:
            return "";
    }
}

// Thanks to Kenny Yip Coding for inspiration / made by Maxome_
