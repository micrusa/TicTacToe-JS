var canvas = document.getElementById("main");
canvas.height = 400;
canvas.width = 400;
const lw = (canvas.width / 3);
const lh = (canvas.height / 3);

var v = canvas.getContext("2d");
v.strokeRect(0, 0, canvas.width, canvas.height);

var board;
var players = ["O", "X"];
var currPlayer;
var finished;

document.addEventListener('click', (e) => {
    forEachPos((i, j) => {
        if(e.clientX >= j*lw && e.clientX < (j+1)*lw && e.clientY >= i*lh && e.clientY < (i+1)*lh && board[i][j] == ""){
            board[i][j] = players[currPlayer];
            if(++currPlayer >= players.length)
                currPlayer = 0;
        }
    });
    if(finished){
        reset();
    }
    tick();
});

reset();
function reset(){
    clearScreen();
    board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];
    currPlayer = 0;
    finished = false;
    for(var i = 1; i < 3; i++){
        v.moveTo(i * lw, 0);
        v.lineTo(i * lw, canvas.height);
        v.moveTo(0, i * lh);
        v.lineTo(canvas.width, i * lh);
        v.stroke();
    }
}

function clearScreen(){
    v.beginPath();
    v.clearRect(1, 1, canvas.width - 2, canvas.height - 2);
    v.fill();
}

function drawBoard(){
    forEachPos((i, j) => {
        const initialX = j * lw + (lw / 2);
        const initialY = i * lh + (lh / 2);
        v.clearRect(j * lw + 1, i * lh + 1, lw - 2, lh - 2);
        v.beginPath();
        if(board[i][j] == players[0]){
            v.arc(initialX, initialY, lw / 3, 0, Math.PI*2, false);
        } else if(board[i][j] == players[1]) {
            const w = (lw / 3);
            const h = (lh / 3);
            v.moveTo(initialX - w, initialY - h);
            v.lineTo(initialX + w, initialY + h);
            v.moveTo(initialX + w, initialY - h);
            v.lineTo(initialX - w, initialY + h);
        }
        v.stroke();
    });
}

function checkWinner(){
    for(var j = 0; j < players.length; j++){
        for(var i = 0; i < board.length; i++){
            if(hasLine(board[i][0], board[i][1], board[i][2], j)){
                return players[j];
            }
        }
        for(var i = 0; i < board.length; i++){
            if(hasLine(board[0][i], board[1][i], board[2][i], j)){
                return players[j];
            }
        }
        if(hasLine(board[0][0], board[1][1], board[2][2], j)) {
            return players[j];
        }
        if(hasLine(board[0][2], board[1][1], board[2][0], j)) {
            return players[j];
        }
    }
    var x = "Tie";
    forEachPos((i, j) => {
        if(board[i][j] == ""){
            x = null;
            return;
        }
    });
    return x;
}

function tick(){
    drawBoard();
    var winner = checkWinner();
    if(winner != null) {
        clearScreen();
        v.textAlign = 'center';
        v.font = canvas.height/7.5 + 'px Arial';
        v.fillText((winner != "Tie" ? "Winner is " : "") + winner, (canvas.width/2), (canvas.height/2));
        finished = true;
    }
}

function hasLine(x, y, z, v){
    return x == y && y == z && z == players[v];
}

function forEachPos(f){
    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board[0].length; j++){
            f(i, j);
        }
    }
}