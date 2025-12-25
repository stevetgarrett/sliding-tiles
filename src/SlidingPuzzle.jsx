import { useState, useEffect } from 'react';
import './SlidingPuzzle.css';

const SlidingPuzzle = () => {
  const GRID_SIZE = 4;
  const TOTAL_TILES = GRID_SIZE * GRID_SIZE;

  // Initialize puzzle with tiles 1-15 and one empty space (0)
  const initializePuzzle = () => {
    const tiles = Array.from({ length: TOTAL_TILES - 1 }, (_, i) => i + 1);
    tiles.push(0); // Add empty space
    return shufflePuzzle(tiles);
  };

  // Shuffle the puzzle ensuring it's solvable
  const shufflePuzzle = (tiles) => {
    const shuffled = [...tiles];
    // Perform random valid moves to ensure solvability
    for (let i = 0; i < 1000; i++) {
      const emptyIndex = shuffled.indexOf(0);
      const validMoves = getValidMoves(emptyIndex);
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      [shuffled[emptyIndex], shuffled[randomMove]] = [shuffled[randomMove], shuffled[emptyIndex]];
    }
    return shuffled;
  };

  // Get valid tile positions that can move to empty space
  const getValidMoves = (emptyIndex) => {
    const row = Math.floor(emptyIndex / GRID_SIZE);
    const col = emptyIndex % GRID_SIZE;
    const moves = [];

    if (row > 0) moves.push(emptyIndex - GRID_SIZE); // Up
    if (row < GRID_SIZE - 1) moves.push(emptyIndex + GRID_SIZE); // Down
    if (col > 0) moves.push(emptyIndex - 1); // Left
    if (col < GRID_SIZE - 1) moves.push(emptyIndex + 1); // Right

    return moves;
  };

  const [tiles, setTiles] = useState(initializePuzzle);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  // Check if puzzle is solved
  const checkWin = (currentTiles) => {
    for (let i = 0; i < TOTAL_TILES - 1; i++) {
      if (currentTiles[i] !== i + 1) return false;
    }
    return currentTiles[TOTAL_TILES - 1] === 0;
  };

  const handleTileClick = (index) => {
    if (isWon) return;

    const emptyIndex = tiles.indexOf(0);
    const validMoves = getValidMoves(emptyIndex);

    if (validMoves.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      setMoves(moves + 1);

      if (checkWin(newTiles)) {
        setIsWon(true);
      }
    }
  };

  const resetGame = () => {
    setTiles(initializePuzzle());
    setMoves(0);
    setIsWon(false);
  };

  return (
    <div className="puzzle-container">
      <h1>Sliding Puzzle</h1>
      <div className="game-info">
        <p>Moves: {moves}</p>
        {isWon && <p className="win-message">🎉 Congratulations! You won! 🎉</p>}
      </div>
      <div className="puzzle-grid">
        {tiles.map((tile, index) => (
          <div
            key={index}
            className={`tile ${tile === 0 ? 'empty' : ''} ${
              getValidMoves(tiles.indexOf(0)).includes(index) ? 'movable' : ''
            }`}
            onClick={() => handleTileClick(index)}
          >
            {tile !== 0 && tile}
          </div>
        ))}
      </div>
      <button className="reset-button" onClick={resetGame}>
        New Game
      </button>
    </div>
  );
};

export default SlidingPuzzle;
