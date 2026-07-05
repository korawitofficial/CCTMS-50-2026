/**
 * Lightweight chess/checkers board renderer.
 * IMPORTANT: This is a DISPLAY-ONLY utility. Per Project Overview (1.6 Out of Scope),
 * CCTMS is not a Chess Engine — it never validates legality or enforces moves.
 * It only renders a position string (FEN-like) into a visual grid.
 */

const PIECE_GLYPHS = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟',
};

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

/** Parses the board-placement segment of a FEN string into an 8x8 grid (row 0 = rank 8). */
export function fenToGrid(fenBoardPart) {
  const rows = (fenBoardPart || START_FEN).split('/');
  return rows.map((row) => {
    const cells = [];
    for (const char of row) {
      if (/\d/.test(char)) {
        for (let i = 0; i < Number(char); i++) cells.push(null);
      } else {
        cells.push(char);
      }
    }
    while (cells.length < 8) cells.push(null);
    return cells.slice(0, 8);
  });
}

export function squareName(fileIndex, rankRowIndex) {
  const file = 'abcdefgh'[fileIndex];
  const rank = 8 - rankRowIndex;
  return `${file}${rank}`;
}

/** Renders an 8x8 board as an HTML string. `lastFrom`/`lastTo` are square names like "e4". */
export function renderBoardHtml(fenBoardPart, { lastFrom, lastTo, flipped = false } = {}) {
  const grid = fenToGrid(fenBoardPart);
  const rowsIdx = flipped ? [...grid.keys()].reverse() : [...grid.keys()];
  let html = '<div class="chess-board" role="img" aria-label="Board position">';
  for (const r of rowsIdx) {
    const colsIdx = flipped ? [...Array(8).keys()].reverse() : [...Array(8).keys()];
    for (const c of colsIdx) {
      const piece = grid[r][c];
      const isLight = (r + c) % 2 === 0;
      const sq = squareName(c, r);
      const isLast = sq === lastFrom || sq === lastTo;
      html += `<div class="chess-square ${isLight ? 'chess-square--light' : 'chess-square--dark'} ${isLast ? 'chess-square--highlight' : ''}" data-square="${sq}">`;
      if (piece) {
        const isWhite = piece === piece.toUpperCase();
        html += `<span class="chess-piece ${isWhite ? 'chess-piece--white' : 'chess-piece--black'}">${PIECE_GLYPHS[piece] || ''}</span>`;
      }
      html += '</div>';
    }
  }
  html += '</div>';
  return html;
}
