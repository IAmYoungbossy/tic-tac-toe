let markTracker = [];

const createDivs = (function(i) {
    const gameboard = document.querySelector('.gameboard');
    const square = document.createElement('div');
    square.style.border = '1px solid black';
    square.setAttribute('data-index-number', `${i}`);
    square.classList.add('squareDivs', 'square');
    gameboard.appendChild(square);
  });
  for (let i = 0; i < 9; i++) createDivs(i);