document.addEventListener('DOMContentLoaded', () => {
    const game = {
        score: JSON.parse(localStorage.getItem('rps-score')) || {
            wins: 0,
            losses: 0,
            ties: 0
        },
        isAutoPlaying: false,
        autoPlayInterval: null
    };
    const elements = {
        moveButtons: document.querySelectorAll('.move-button'),
        resultDisplay: document.getElementById('result'),
        computerMoveDisplay: document.getElementById('computer-move'),
        winsDisplay: document.getElementById('wins'),
        lossesDisplay: document.getElementById('losses'),
        tiesDisplay: document.getElementById('ties'),
        resetButton: document.getElementById('reset'),
        autoPlayButton: document.getElementById('auto-play')
    };
    initGame();
    elements.moveButtons.forEach(button => {
        button.addEventListener('click', () => {
            if(!game.isAutoPlaying)
            {
                const playerMove = button.dataset.move;
                playGame(playerMove);
            }
        });
    });
    elements.resetButton.addEventListener('click', resetScore);
    elements.autoPlayButton.addEventListener('click', toggleAutoPlay);
    function initGame()
    {
        updateScoreDisplay();
    }
    function playGame(playerMove)
    {
        highlightPlayerMove(playerMove);
        setTimeout(() => {
            const computerMove = pickComputerMove();
            displayComputerMove(computerMove);
            const result = determineWinner(playerMove, computerMove);
            updateScore(result);
            displayResult(result, playerMove, computerMove);
        }, 500);
    }
    function highlightPlayerMove(move)
    {
        elements.moveButtons.forEach(button => {
            button.classList.remove('active');
            if(button.dataset.move === move)
            {
                button.classList.add('active');
            }
        });
    }
    function pickComputerMove()
    {
        const moves = ['rock', 'paper', 'scissors'];
        const randomIndex = Math.floor(Math.random() * moves.length);
        return moves[randomIndex];
    }
    function displayComputerMove(move)
    {
        elements.computerMoveDisplay.innerHTML = `
            <img src="images/${move}-emoji.png" alt="${move}" class="move-icon">
        `;
        elements.computerMoveDisplay.classList.remove('computer-placeholder');
        elements.computerMoveDisplay.classList.add('computer-move');
    }
    function determineWinner(playerMove, computerMove)
    {
        if(playerMove === computerMove)
            return 'tie';
        const winningConditions = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };
        if(winningConditions[playerMove] === computerMove)
            return 'win';
        else
            return 'lose';
    }
    function updateScore(result)
    {
        if (result === 'win') {
            game.score.wins++;
        } else if (result === 'lose') {
            game.score.losses++;
        } else {
            game.score.ties++;
        }
        localStorage.setItem('rps-score', JSON.stringify(game.score));
        updateScoreDisplay();
    }
    function updateScoreDisplay()
    {
        elements.winsDisplay.textContent = game.score.wins;
        elements.lossesDisplay.textContent = game.score.losses;
        elements.tiesDisplay.textContent = game.score.ties;
    }
    function displayResult(result, playerMove, computerMove)
    {
        let message = '';
        let resultClass = '';
        switch(result)
        {
            case 'win':
                message = `VICTORY! ${playerMove.toUpperCase()} BEATS ${computerMove.toUpperCase()}`;
                resultClass = 'win';
                break;
            case 'lose':
                message = `DEFEAT! ${computerMove.toUpperCase()} BEATS ${playerMove.toUpperCase()}`;
                resultClass = 'lose';
                break;
            case 'tie':
                message = `STANDOFF! BOTH CHOSE ${playerMove.toUpperCase()}`;
                resultClass = 'tie';
                break;
        }
        elements.resultDisplay.textContent = message;
        elements.resultDisplay.className = resultClass;
    }
    function resetScore()
    {
        game.score = { wins: 0, losses: 0, ties: 0 };
        localStorage.setItem('rps-score', JSON.stringify(game.score));
        updateScoreDisplay();
        elements.resultDisplay.textContent = '';
        elements.resultDisplay.className = '';
        elements.computerMoveDisplay.innerHTML = '<span>?</span>';
        elements.computerMoveDisplay.classList.add('computer-placeholder');
        elements.computerMoveDisplay.classList.remove('computer-move');        
        elements.moveButtons.forEach(button => {
            button.classList.remove('active');
        });
    }
    function toggleAutoPlay()
    {
        game.isAutoPlaying = !game.isAutoPlaying;
        elements.autoPlayButton.textContent = game.isAutoPlaying ? 'STOP BATTLE' : 'AUTO BATTLE';
        if(game.isAutoPlaying)
        {
            game.autoPlayInterval = setInterval(() => {
                const randomMove = pickComputerMove();
                playGame(randomMove);
            }, 1000);
        }
        else
        {
            clearInterval(game.autoPlayInterval);
        }
    }
});