$(document).ready(function () {
    let playerLetter = ''
    let matrix = [0, 0, 0, 0, 0, 0, 0, 0, 0]

    let isPlayerTurn = true
    let isGameOver = false

    $('.options').click(function (e) {
        playerLetter = e.target.className.slice(-1)
        $('.select-box').toggleClass('hide')
        $('.play-board').toggleClass('show')

        //Random start
        if ((0 | Math.random() * 10) % 2) {
            isPlayerTurn = true
            if (playerLetter == 'O') $('.players').toggleClass('active')
        } else {
            isPlayerTurn = false
            if (playerLetter == 'X') $('.players').toggleClass('active')
            computerTurn()
        }
    })
    //Reset
    $('.btn').click(function (e) {
        playerLetter = ''
        matrix = [0, 0, 0, 0, 0, 0, 0, 0, 0]
        isPlayerTurn = true
        isGameOver = false
        $("span[class^='box']").each(function () { $(this).html('') })
        $('.result-box').removeClass('show')
        $('.players').removeClass('active')
        $('.select-box').toggleClass('hide')
    })

    $('.play-area').click(function (e) {
        const className = e.target.className
        if (
            !isPlayerTurn ||
            matrix[className.slice(-1) - 1] ||
            isGameOver ||
            !className.includes('box')
        ) return
        playerTurn(className)
        computerTurn()
    })
    function playerTurn(className) {
        $(`.${className}`).html(playerLetter)
        matrix[+className.slice(-1) - 1] = playerLetter
        checkWin()
        $('.players').toggleClass('active')
        isPlayerTurn = false
    }
    async function computerTurn() {
        if (isGameOver) return
        let randNum = 0
        let counter = 0
        await waitFor(500);
        while (matrix[randNum = 0 | Math.random() * 9] && counter++ < 200) { }
        matrix[randNum] = playerLetter == 'X' ? 'O' : 'X'

        $(`.box${randNum + 1}`).html(playerLetter == 'X' ? 'O' : 'X')
        checkWin()
        $('.players').toggleClass('active')
        isPlayerTurn = true;
    }
    async function gameOver(str) {
        isGameOver = true
        await waitFor(1000);
        $('.result-box').toggleClass('show')
        $('.play-board').toggleClass('show')
        $('.won-text').html(str)
    }
    function checkWin() {
        if (isGameOver) return
        const end = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]].find(([n0, n1, n2]) =>
            (matrix[n0] == matrix[n1] && matrix[n1] == matrix[n2] && matrix[n0])
        )
        if (end) return gameOver(matrix[end[0]] + ' Win')
        if (matrix.indexOf(0) == -1)
            gameOver('teko')

    }
    const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));
});

// function checkWin() {
//     if (isGameOver) return

//     const end = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]].findIndex(([n0, n1, n2]) =>
//         (matrix[n0] == matrix[n1] && matrix[n1] == matrix[n2] && !matrix[n0])
//     )
//     console.log(end)
//     if (end != -1) return gameOver(matrix[end[0]] + 'Win')

//     if (matrix.indexOf(0) == -1)
//         gameOver('teko')
// }


// for (let i = 0; i < 8; i += 3)
//     if (matrix[i] == matrix[i + 1] &&
//         matrix[i + 1] == matrix[i + 2] && matrix[i] != 0
//     )
//         gameOver(matrix[i] + ' WIN')
// for (let i = 0; i < 3; i++)
//     if (matrix[i] == matrix[i + 3] &&
//         matrix[i + 3] == matrix[i + 6] && matrix[i] != 0
//     )
//         gameOver(matrix[i] + ' WIN')
// if (matrix[0] == matrix[4] &&
//     matrix[4] == matrix[8] && matrix[0] != 0)
//     gameOver(matrix[0] + ' WIN')

// if (matrix[2] == matrix[4] &&
//     matrix[4] == matrix[6] && matrix[2] != 0)
//     gameOver(matrix[2] + ' WIN')