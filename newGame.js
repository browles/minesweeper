function range(low, high) {
    var i = low;
    var res = [];
    while (i < high) res.push(i++);
    return res;
}

function shuffle(arr) {
    var i = arr.length;
    while (i-- > 0) {
        var rand = Math.random() * i | 0;
        var t = arr[rand];
        arr[rand] = arr[i];
        arr[i] = t;
    }

    return arr;
}

function newMinefield(x, y, num) {
    var minefield = Array(y);
    for (var i = 0; i < y; i++) {
        minefield[i] = Array(x);
        for (var j = 0; j < x; j++) minefield[i][j] = 0;
    }
    var bombIndices = shuffle(range(0, x * y)).slice(0, num);
    bombIndices.forEach(function(index) {
        var i = index / x | 0;
        var j = index % x;

        minefield[i][j] = -1;
    });
    bombIndices.forEach(function(index) {
        var i = index / x | 0;
        var j = index % x;

        if (minefield[i - 1] != null && minefield[i - 1][j - 1] != null && minefield[i - 1][j - 1] !== -1) minefield[i - 1][j - 1]++;
        if (minefield[i] != null && minefield[i][j - 1] != null && minefield[i][j - 1] !== -1) minefield[i][j - 1]++;
        if (minefield[i + 1] != null && minefield[i + 1][j - 1] != null && minefield[i + 1][j - 1] !== -1) minefield[i + 1][j - 1]++;
        if (minefield[i - 1] != null && minefield[i - 1][j] != null && minefield[i - 1][j] !== -1) minefield[i - 1][j]++;
        if (minefield[i + 1] != null && minefield[i + 1][j] != null && minefield[i + 1][j] !== -1) minefield[i + 1][j]++;
        if (minefield[i - 1] != null && minefield[i - 1][j + 1] != null && minefield[i - 1][j + 1] !== -1) minefield[i - 1][j + 1]++;
        if (minefield[i] != null && minefield[i][j + 1] != null && minefield[i][j + 1] !== -1) minefield[i][j + 1]++;
        if (minefield[i + 1] != null && minefield[i + 1][j + 1] != null && minefield[i + 1][j + 1] !== -1) minefield[i + 1][j + 1]++;
    });

    return minefield;
}

function newBoard(x, y) {
    var arr = Array(y);
    for (var i = 0; i < y; i++) {
        arr[i] = Array(x);
        for (var j = 0; j < x; j++) arr[i][j] = -1;
    }

    return arr;
}

function reveal(x, y) {
    if (this.minefield[x] == null || this.minefield[x][y] == null) return 0;
    else if (this.minefield[x][y] === -1) return -1;
    else if (this.board[x][y] === -1) {
        this.board[x][y] = this.minefield[x][y];
        if (this.minefield[x][y] === 0) {
            this.reveal(x - 1, y - 1);
            this.reveal(x, y - 1);
            this.reveal(x + 1, y - 1);
            this.reveal(x - 1, y);
            this.reveal(x + 1, y);
            this.reveal(x - 1, y + 1);
            this.reveal(x, y + 1);
            this.reveal(x + 1, y + 1);
        }
        return 1;
    }
}

function flag(x, y) {
    if (this.board[x][y] === -1 && this.flags > 0) {
        this.board[x][y] = -2;
        this.flags--;
        if (this.minefield[x][y] === -1) this.remaining--;
    }
    else if (this.board[x][y] === -2) {
        this.board[x][y] = -1;
        this.flags++;
        if (this.minefield[x][y] === -1) this.remaining++;
    }
    if (this.remaining === 0) return 1;
    else return 0;
}

var proto = {reveal, flag};

function newGame(x, y, num) {
    var ng = Object.create(proto);
    ng.board = newBoard(x, y);
    ng.minefield = newMinefield(x, y, num);
    ng.flags = num;
    ng.remaining = num;
    return ng;
}

module.exports = newGame;