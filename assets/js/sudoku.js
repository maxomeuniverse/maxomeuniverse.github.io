//-------------------------------------------------------------------------------------
// Variables
var numSelected = null;
var tileSelected = null;

var errors = 0;

var nbDigits = 6;

var board = [
    "--61-4",
    "----2-",
    "3-5-62",
    "6-2---",
    "453-16",
    "261-4-"
]

var boardTruePlay = [
    [3, 1, 4, 2, 5, 4], // Rows
    [4, 2, 5, 1, 4, 3]  // Columns
]

var solution = [
    "526134",
    "134625",
    "315462",
    "642351",
    "453216",
    "261543"
]

//-------------------------------------------------------------------------------------
// On Start Functions

window.onload = function(){
    setGame();
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
            
            if(board[r][c] != "-"){ // If ...
                // tile.innerText = board[r][c];
                let imageElem = addEmoteImageElement(tile, board[r][c]);
                let idElem = createIdTextElement(tile, board[r][c]);
                
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
        if(isSolutionTile(this)){ 
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

        if (solution[r][c] == numSelected.id){
            boardTruePlay[0][r] += 1;
            boardTruePlay[1][c] += 1;
            checkboardTruePlay();
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
        if(boardTruePlay[0][i] == 6){
            setTileValidity(i, 0);
        }

        // Check col
        if(boardTruePlay[1][i] == 6){
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
