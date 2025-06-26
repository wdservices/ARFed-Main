import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';

// Confetti component
const Confetti = ({ show }) => {
    if (!show) return null;
    const confettiPieces = Array.from({ length: 50 }).map((_, i) => {
        const duration = `${2 + Math.random() * 3}s`;
        const delay = `${Math.random() * 2}s`;
        const bgColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
        const animationString = `fall ${duration} ${delay} linear forwards`;
        const style = {
            position: 'absolute',
            left: `${Math.random() * 100}vw`,
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            opacity: 0,
            backgroundColor: bgColor,
            animation: animationString,
        };
        return <div key={i} style={style}></div>;
    });
    return <div className="fixed inset-0 overflow-hidden pointer-events-none z-40">{confettiPieces}</div>;
};

const App = () => {
    // Game state
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState('X'); // X always starts
    const [gameStatus, setGameStatus] = useState('waiting_start'); // playing, X_wins, O_wins, draw, waiting_start
    const [showConfetti, setShowConfetti] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const playSynthRef = useRef(null);
    const winSynthRef = useRef(null);
    const loseSynthRef = useRef(null);
    const drawSynthRef = useRef(null);

    // Initialize Tone.js synths and audio context
    useEffect(() => {
        playSynthRef.current = new Tone.Synth().toDestination();
        winSynthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
        loseSynthRef.current = new Tone.Synth().toDestination();
        drawSynthRef.current = new Tone.Synth().toDestination();
        const startAudio = async () => {
            if (Tone.context.state !== 'running') {
                try {
                    await Tone.start();
                } catch (e) {}
            }
            document.removeEventListener('click', startAudio);
            document.removeEventListener('touchstart', startAudio);
        };
        document.addEventListener('click', startAudio);
        document.addEventListener('touchstart', startAudio);
        return () => {
            document.removeEventListener('click', startAudio);
            document.removeEventListener('touchstart', startAudio);
            playSynthRef.current?.dispose();
            winSynthRef.current?.dispose();
            loseSynthRef.current?.dispose();
            drawSynthRef.current?.dispose();
        };
    }, []);

    // Sound playing functions
    const playSound = () => {
        if (!isMuted && playSynthRef.current) {
            playSynthRef.current.triggerAttackRelease("C4", "8n");
        }
    };
    const playWinSound = () => {
        if (!isMuted && winSynthRef.current) {
            winSynthRef.current.triggerAttackRelease(["C5", "E5", "G5"], "4n");
        }
    };
    const playLoseSound = () => {
        if (!isMuted && loseSynthRef.current) {
            loseSynthRef.current.triggerAttackRelease("C3", "4n");
        }
    };
    const playDrawSound = () => {
        if (!isMuted && drawSynthRef.current) {
            drawSynthRef.current.triggerAttackRelease("G4", "8n");
        }
    };

    // Check for win or draw conditions
    useEffect(() => {
        if (gameStatus === 'playing') {
            const winner = checkWinner(board);
            if (winner) {
                setGameStatus(`${winner}_wins`);
                if (winner === 'X') {
                    playWinSound();
                    setShowConfetti(true);
                } else {
                    playLoseSound();
                }
            } else if (board.every(cell => cell !== null)) {
                setGameStatus('draw');
                playDrawSound();
            }
        }
        if (gameStatus.includes('wins') || gameStatus === 'draw') {
            const timer = setTimeout(() => setShowConfetti(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [board, gameStatus]);

    // AI logic for single player mode
    useEffect(() => {
        if (gameStatus === 'playing' && currentPlayer === 'O') {
            const timer = setTimeout(() => {
                makeAIMove();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [board, currentPlayer, gameStatus]);

    // Game Logic Functions
    const checkWinner = (currentBoard) => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let i = 0; i < winPatterns.length; i++) {
            const [a, b, c] = winPatterns[i];
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                return currentBoard[a];
            }
        }
        return null;
    };
    const minimax = (currentBoard, player) => {
        const winner = checkWinner(currentBoard);
        if (winner === 'X') return { score: -1 };
        if (winner === 'O') return { score: 1 };
        if (currentBoard.every(cell => cell !== null)) return { score: 0 };
        const moves = [];
        for (let i = 0; i < currentBoard.length; i++) {
            if (currentBoard[i] === null) {
                currentBoard[i] = player;
                let score = minimax(currentBoard, player === 'X' ? 'O' : 'X').score;
                currentBoard[i] = null;
                moves.push({ index: i, score: score });
            }
        }
        let bestMove = null;
        let bestScore;
        if (player === 'O') {
            bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = moves[i].index;
                }
            }
        } else {
            bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = moves[i].index;
                }
            }
        }
        return { index: bestMove, score: bestScore };
    };
    const makeAIMove = () => {
        if (gameStatus !== 'playing' || currentPlayer !== 'O') return;
        const bestMove = minimax(board, 'O');
        if (bestMove.index !== undefined && board[bestMove.index] === null) {
            handleCellClick(bestMove.index);
        } else {
            const emptyIndex = board.findIndex(cell => cell === null);
            if (emptyIndex !== -1) {
                handleCellClick(emptyIndex);
            }
        }
    };
    const handleCellClick = (index) => {
        if (board[index] !== null || gameStatus !== 'playing') {
            return;
        }
        playSound();
        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        setBoard(newBoard);
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    };
    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setCurrentPlayer('X');
        setGameStatus('waiting_start');
        setShowConfetti(false);
    };
    const startGame = () => {
        resetGame();
        setGameStatus('playing');
    };
    const getStatusMessage = () => {
        switch (gameStatus) {
            case 'playing':
                return `Your turn (${currentPlayer})`;
            case 'X_wins':
                return `You Win! 🎉`;
            case 'O_wins':
                return `AI Wins! 🤖`;
            case 'draw':
                return "It's a Draw! 🤝";
            case 'waiting_start':
                return "Click Start to play against AI.";
            default:
                return '';
        }
    };
    const renderBoard = () => (
        <div className="grid grid-cols-3 gap-2 w-full max-w-md mx-auto aspect-square">
            {board.map((cell, index) => (
                <button
                    key={index}
                    className={`
                        w-full h-full bg-white text-6xl font-bold rounded-lg shadow-md
                        flex items-center justify-center transition-all duration-200
                        ${cell === 'X' ? 'text-blue-600' : (cell === 'O' ? 'text-red-600' : 'text-gray-800')}
                        ${gameStatus === 'playing' && cell === null ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-not-allowed'}
                    `}
                    onClick={() => handleCellClick(index)}
                    disabled={cell !== null || gameStatus !== 'playing'}
                >
                    {cell}
                </button>
            ))}
        </div>
    );
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center font-inter">
            <style>{`
                @keyframes fall {
                    0% { transform: translateY(-100vh) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
            `}</style>
            <Confetti show={showConfetti} />
            <div className="flex flex-col items-center p-4 w-full h-full justify-center">
                <h1 className="text-5xl font-extrabold text-white mb-8 drop-shadow-lg">Tic-Tac-Toe</h1>
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-6 w-full max-w-md">
                    <p className="text-xl font-semibold text-gray-200 text-center mb-3">
                        {getStatusMessage()}
                    </p>
                </div>
                {renderBoard()}
                {(gameStatus.includes('wins') || gameStatus === 'draw') ? (
                    <button
                        onClick={startGame}
                        className="mt-8 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-105"
                    >
                        Play Again
                    </button>
                ) : (
                    gameStatus === 'waiting_start' && (
                        <button
                            onClick={startGame}
                            className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                        >
                            Start Game
                        </button>
                    )
                )}
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="mt-4 px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
                >
                    {isMuted ? 'Unmute Sound' : 'Mute Sound'}
                </button>
            </div>
        </div>
    );
};

export default App; 