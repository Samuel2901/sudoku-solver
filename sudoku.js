const grey = "rgba(150,150,150,0.3)";
let focusId = [];
let focusBox;
let fin = 0;

function createSudoku(){
    // Create sudoku array
    let sudoku = new Array(9);
    for (let i = 0; i < 9; i++){
        sudoku[i] = new Array(9);
    }

    // Get each number from user input
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            id = "input" + i.toString() + j.toString()
            sudoku[i][j] = parseInt(document.getElementById(id).value)
        }
    }
    return sudoku;
}

// Check if input is a number between 1-9
function oneToNine(){
    if (isNaN(this.value) || parseInt(this.value) < 1)
    {
        this.value = null;
    }

    // Check if input is possible
    // Get id
    let row = this.id[5];
    let column = this.id[6];

    // Create sudoku
    let sudoku = createSudoku();

    // Color red and lock sudoku if not valid
    if (!(checkSudoku(sudoku, column, row))){
        this.style.backgroundColor = "red";

        // Select all inputs
        let inputs = document.querySelectorAll("input");
        // Disable them
        for (input of inputs){
            input.disabled = true;
        }
        // Enable current input
        this.disabled = false;
        this.addEventListener("input",function(){
            // Select all inputs
            let inputs = document.querySelectorAll("input");
            // Enable them
            for (input of inputs){
                input.disabled = false;
            }
        })

    }
}

// Color rows grey
function mouseEnter(){
    // Get id from mouse hover
    let id = this.id;
    let row = id[5];
    let column = id[6];

    // loop trough each box in row and col and color grey
    for (let i = 0; i < 9; i++){
        let rowId = "input" + row + i;
        if (rowId != focusBox){
            document.getElementById(rowId).style.backgroundColor = grey;
        }
        let columnId = "input" + i + column;
        if (columnId != focusBox){
            document.getElementById(columnId).style.backgroundColor = grey;
        }
    }

}
function mouseLeave(){
    // Get id
    let id = this.id;
    let row = id[5];
    let column = id[6];

    // loop trough each box in row and col and color white
    for (let i = 0; i < 9; i++){

        let rowId = "input" + row + i;
        if (focusId.includes(rowId) == false){
            document.getElementById(rowId).style.backgroundColor = "white";
        }

        let columnId = "input" + i + column;
        if (focusId.includes(columnId) == false){
            document.getElementById(columnId).style.backgroundColor = "white";
        }
    }
}

function focus(){
    // Get id of focus box
    focusId = []
    focusBox = this.id;
    let row = focusBox[5];
    let column = focusBox[6];

    // Make array of all boxes in focus
    for (let i = 0; i < 9; i++){
        focusId.push("input" + row + i)
        focusId.push("input" + i + column)
    }

    // Color everything else white
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            // Create id
            tmpId = "input" + i.toString() + j.toString()
            tmpIdStyle = document.getElementById(tmpId).style

            // Check if box is in focus
            if (focusId.includes(tmpId) == false){
                tmpIdStyle.backgroundColor = "white";
            }

            else if (tmpIdStyle.backgroundColor == "lightblue"){
                tmpIdStyle.backgroundColor = grey;
            }
        }
    }
    // Color the clicked box blue
    this.style.backgroundColor = "lightblue";
}

function startSudoku(){
    fin = 0;
    let invalid = false;
    // Create sudoku array
    let sudoku = createSudoku();

    // Check if valid
    for (let y = 0; y < 9; y++){
        for (let x = 0; x < 9; x++){
            if (!(checkSudoku(sudoku, x, y))){
                invalid = true;
            }
        }
    }
    if (invalid){
        alert("Sudoku could not be solved");
    }
    else {
        solve(sudoku, 0, 0);
        return(sudoku);
    }
}

function solved(){
    // Check if already solved
    for (let y = 0; y < 9; y++){
        for (let x = 0; x < 9; x++){
            if (!document.getElementById("input" + y + x).value){
                return true;
            }
        }
    }
    alert("Sudoku is already solved")
    return false
}

// Checks if number in sudoku is valid
function checkSudoku(sudoku, x, y){
    // Check x-row for duplicates
    // Make a check array
    let check = [];
    for (let i = 0; i < 9; i++){
        check[i] = 0;
    }
    // Loop through row looking for duplicates
    for (let i = 0; i < 9; i++){
        // Get number in row
        let num = sudoku[y][i];
        // Check if number is duplicate
        if (check[num - 1] == 1){
            return false;
        }
        check[num - 1]++;
    }

    // Check y-column for duplicates
    // Reset check array
    for (let i = 0; i < 9; i++){
        check[i] = 0
    }

    // Loop through col looking for duplicates
    for (let i = 0; i < 9; i++){
        // Get number in col
        let num = sudoku[i][x];
        // Check if number is duplicate
        if (check[num - 1] == 1){
            return false;
        }
        check[num - 1]++;
    }

    // Check square
    // Find square
    let xS = Math.floor(x/3);
    let yS = Math.floor(y/3);

    // Reset check array
    for (let i = 0; i < 9; i++){
        check[i] = 0;
    }

    // loop trough square
    for (let tmpx = 0; tmpx < 3; tmpx++){
        for (let tmpy = 0; tmpy < 3; tmpy++){
            let num = sudoku[(yS * 3) + tmpx][(xS * 3) + tmpy];

            // Check for duplicates
            if (check[num - 1] == 1){
                return false;
            }
            check[num - 1]++;
        }
    }
    // Return true becuase check was completed
    return true
}

function solve(sudoku, x, y){

    // Check if last number
    if (x == 8 && y == 8){
        // Check if there is already a number
        if (sudoku[y][x]){
            if (checkSudoku(sudoku, x, y)){
                fin = 1;
                return;
            }
        }

        // Try 1-9
        for (let i = 1; i <= 9; i++){
            sudoku[8][8] = i;
            // Check which number fits
            if (checkSudoku(sudoku, x, y)){
                fin = 1;
                return;
            }
        }
        // If no number fits return false
        return;
    }

    // Calculate next position
    let newX, newY;

    if (x == 8){
        newX = 0;
        newY = y + 1;
    }
    else {
        newX = x + 1;
        newY = y;
    }

    // If there is already a number move to next number
    if (sudoku[y][x]){
        solve(sudoku, newX, newY);
        return;
    }

    // Check 1-9
    for (let i = 1; i <= 9; i++){
        sudoku[y][x] = i;

        if (checkSudoku(sudoku, x, y)){
            // Move to next number
            solve(sudoku, newX, newY);

            // Check if finished
            if (fin == 1){
                return;
            }
        }
    }
    sudoku[y][x] = null
    return;
}

// Add eventlisteners to all buttons
// Color the selected input box
let boxes = document.getElementsByTagName("input");
for (let i of boxes)
{
    // Check input
    i.addEventListener("input", oneToNine)
    // Check if mouse is above
    i.addEventListener("mouseenter", mouseEnter)
    // When mouse exits
    i.addEventListener("mouseleave", mouseLeave)
    // When element gets focus
    i.addEventListener("focus", focus)
}

// Add eventlistener for solve button
document.getElementById("solve").addEventListener("click", function(){
    // Check if already solved
    if (!solved()){
        return;
    }

    let sudoku = startSudoku();
    if (fin == 1){
        // Add solved sudoku to document
        for (let y = 0; y < 9; y++){
            for (let x = 0; x < 9; x++){
                let id = "input" + y + x;
                document.getElementById(id).value = sudoku[y][x];
            }
        }
    }
    else {
        alert("Sudoku could not be solved")
    }
})

// Clear sudoku
document.getElementById("clear").addEventListener("click", function(){
    // Select all inputs
    let inputs = document.querySelectorAll("input");
    // Clear them
    for (input of inputs){
        input.value = "";
        input.disabled = false;
        input.style.backgroundColor = "white";
    }
    focusId = [];
    focusBox = 0;
})

// Find next number
document.getElementById("help").addEventListener("click", function(){
    // Solve the sudoku
    let sudoku = startSudoku();

    if (!solved()){
        return;
    }

    //Check if finished
    if (fin == 1){

        let rcheck = 0;
        let randomX, randomY, input;

        while (rcheck === 0){
            // Pick random number
            randomX = Math.floor(Math.random() * 9);
            randomY = Math.floor(Math.random() * 9);

            // Create id
            let id = "input" + randomY + randomX;

            input = document.getElementById(id)
            // Check if ther is already a number
            if (!(input.value)){
                rcheck = 1;
            }
        }
        // Insert solved number into random pos
        input.value = sudoku[randomY][randomX];
    }
})
