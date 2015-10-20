#!/usr/bin/env node
var newGame = require('./newGame');
var readline = require('readline');

var blue = '\x1b[34m';
var red = '\x1b[31m';
var green = '\x1b[32m';
var bgred = '\x1b[101m';
var bggreen = '\x1b[42m';
var bold = '\x1b[21m';
var reset = '\x1b[0m';

function repeat(c, n) {
    var r = '';
    while (n--) r += c;
    return r;
}

function printBoard(board, special) {
    var y = board.length;
    var x = board[0].length;
    var s = '';
    s += repeat(' ', String(y).length) + blue;
    for (var j = 0; j < x; j++) s += repeat(' ', String(x).length - String(j + 1).length + 1) + (j + 1);
    s += reset + '\n';
    for (var i = 0; i < y; i++) {
        s += blue + (i + 1) + repeat(' ', String(y).length - String(i + 1).length) + reset;
        for (var j = 0; j < x; j++) {
            s += repeat(' ', String(x).length);
            if (board[i][j] === -1) s += special;
            else if (board[i][j] === -2) s += green+'F'+reset;
            else s += board[i][j];
        }
        s += '\n';
    }

    return s;
}

function turn() {
    console.log('\u001B[2J\u001B[0;0f');
    console.log(printBoard(gameState.board, '_'));
    console.log('Flags: ' + gameState.flags + '\n');
    i.prompt();
}

function win() {
    console.log('\u001B[2J\u001B[0;0f');
    console.log(printBoard(gameState.minefield, bggreen+'F'+reset));
    console.log('WINNER!');
    process.exit();
}

function lose() {
    console.log('\u001B[2J\u001B[0;0f');
    console.log(printBoard(gameState.minefield, bgred+'#'+reset));
    console.log('KABOOM!');
    process.exit();
}

var options = process.argv.length === 5 ? process.argv.slice(2, 5) : [10, 20, 10];
var gameState = newGame.apply(null, options)

var i = readline.createInterface(process.stdin, process.stdout);
i.setPrompt('> ', 2);
turn();

i.on('line', function(line) {
    var args = line.trim().split(' ');
    if (args[0] === 'f') {
        var result = gameState.flag(Number(args[1]) - 1, Number(args[2]) - 1);
        if (result === 1) win();
        else if (gameState.flags === 0) lose();
    }
    else if (args.length === 2) {
        var result = gameState.reveal(Number(args[0]) - 1, Number(args[1]) - 1);
        if (result === -1) lose();
    }

    turn();
});
