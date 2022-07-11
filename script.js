let playTimer = [];

const createMsgBoardAndBtn = (function () {
  const infoBoard = document.querySelector(".info-board");
  const welcomeMessage = document.createElement("p");
  let instructionMsg = document.createElement("p");
  const playAI = document.createElement("button");
  const playHuman = document.createElement("button");
  const bodyHTML = document.querySelector("body");
  const resetGame = document.createElement("button");
  bodyHTML.appendChild(resetGame);
  infoBoard.appendChild(welcomeMessage);
  infoBoard.appendChild(instructionMsg);
  infoBoard.appendChild(playAI);
  infoBoard.appendChild(playHuman);
  return {
    infoBoard,
    welcomeMessage,
    instructionMsg,
    playAI,
    playHuman,
    resetGame,
  };
})();

const defaultTexts = (function () {
  createMsgBoardAndBtn.instructionMsg.textContent =
    "Click any of the below buttons to proceed.";
  createMsgBoardAndBtn.welcomeMessage.textContent =
    "Hello you're welcome to Tic Tac Toe game.";
  createMsgBoardAndBtn.playHuman.textContent = "Play human";
  createMsgBoardAndBtn.playAI.textContent = "Play An A.I.";
  createMsgBoardAndBtn.resetGame.textContent = "Restart Game";
})();

const Gameboard = (function (grids) {
  return {
    array: [],
    reset: function () {
      if (
        playTimer.length === grids * grids &&
        checkForWin(grids).feedback == undefined
      ) {
        Gameboard.array.splice(0, Gameboard.array.length);
      } else if (checkForWin(grids).feedback != undefined) {
        Gameboard.array.splice(0, Gameboard.array.length);
      }
    },
  };
})(3);

const createDiv = function (i) {
  const gameboard = document.querySelector(".gameboard");
  const square = document.createElement("div");
  square.style.border = "1px solid grey";
  square.style.borderRadius = "15px";
  square.setAttribute("data-index-number", `${i}`);
  square.classList.add("squareDivs", "square");
  gameboard.appendChild(square);
};

const createDivSquares = (function () {
  for (let i = 0; i < 9; i++) createDiv(i);
})();

const checkBoard = (function () {
  const divs = document.querySelectorAll(".squareDivs");
  return {
    divs,
  };
})();

function boardReset() {
  checkBoard.divs.forEach((square) => {
    square.textContent = "";
  });
}

function markBoard(box) {
  if (box.textContent != "") return;
  if (checkForWin(3).feedback != undefined) return;
  if (playTimer.length === 9 && checkForWin(3).feedback == undefined) return;
  else {
    if (playTimer[playTimer.length - 1] === "O" || playTimer.length < 1) {
      Gameboard.array[parseInt(box.dataset.indexNumber)] = "X";
      playTimer.push("X");
      box.textContent = "X";
    } else if (playTimer[playTimer.length - 1] === "X") {
      Gameboard.array[parseInt(box.dataset.indexNumber)] = "O";
      playTimer.push("O");
      box.textContent = "O";
    }
  }
}

function checkPlayersMarks(grids) {
  function checkGameboardMarks(startIndex, interval, gridSize) {
    let array = [];
    while (startIndex < Gameboard.array.length) {
      array.push(Gameboard.array[startIndex]);
      array.length > gridSize ? array.pop() : false;
      startIndex += interval;
    }
    return {
      array: array.join(""),
    };
  }

  function iterateCheckGameboardMarks(startCount, grid, interval, gridSize) {
    let array = [];
    for (let i = 0; i < grid; i += startCount) {
      array.push(checkGameboardMarks(i, interval, gridSize).array);
    }
    return {
      array,
    };
  }

  function cacheNewInstances(grid) {
    if (grid < 3) return; // Minimum gameboard size is 3x3.
    const playerMarks1 = checkGameboardMarks(0, grid + 1, grid),
      playerMarks2 = iterateCheckGameboardMarks(1, grid, grid, grid),
      playerMarks3 = iterateCheckGameboardMarks(grid, grid * grid, 1, grid),
      playerMarks4 = checkGameboardMarks(grid - 1, grid - 1, grid);
    return {
      playerMarks1,
      playerMarks2,
      playerMarks3,
      playerMarks4,
    };
  }

  let array = cacheNewInstances(grids).playerMarks2.array.concat(
    cacheNewInstances(grids).playerMarks3.array,
    cacheNewInstances(grids).playerMarks1.array,
    cacheNewInstances(grids).playerMarks4.array
  );
  return {
    array,
  };
}

const marker = (function () {
  let x = "X",
    o = "O",
    i = 1;
  while (i < 3) x.repeat(i), o.repeat(i), i++;
  (x = x.repeat(i)), (o = o.repeat(i));
  return {
    x,
    o,
  };
})();

function checkForWin(grids) {
  let feedback;
  checkPlayersMarks(grids).array.forEach((validLine) => {
    if (validLine === marker.x && playTimer.length - 1 < grids * grids) {
      feedback = "X wins";
    } else if (validLine === marker.o && playTimer.length - 1 < grids * grids) {
      feedback = "O wins";
    }
  });
  return {
    feedback,
  };
}

function checkForDraw(grids) {
  if (
    playTimer.length === grids * grids &&
    checkForWin(grids).feedback == undefined
  ) {
    createMsgBoardAndBtn.welcomeMessage.textContent = 'It\'s A Draw Game.';
    createMsgBoardAndBtn.instructionMsg.textContent = 'Click the Restart button to play again.';
  } else if (checkForWin(grids).feedback != undefined) {
    if (checkForWin(grids).feedback == 'X wins') {
      createMsgBoardAndBtn.welcomeMessage.textContent = 'Player X Has Won This Round.';
      setTimeout(function() {
        createMsgBoardAndBtn.instructionMsg.textContent = 'Click the Restart button to play again.'
      }, 1000);
    }
    if (checkForWin(grids).feedback == 'O wins') {
      createMsgBoardAndBtn.welcomeMessage.textContent = 'Player O Has Won This Round.';
      setTimeout(function() {
        createMsgBoardAndBtn.instructionMsg.textContent = 'Click the Restart button to play again.'
      }, 1000);
    }
  }
}

function restartGame(){
  Gameboard.reset();
  boardReset();
  playTimer = [];
  checkForWin(3).feedback = '';
}

function gameboardListener(grid) {
  checkBoard.divs.forEach((square) => {
    square.addEventListener("click", () => {
      markBoard(square);
      checkForWin(grid);
      checkForDraw(grid);
    });
  });
}
createMsgBoardAndBtn.playHuman.addEventListener("click", () => {
  gameboardListener(3);
  setTimeout(function() {
    if (playTimer.length === 0) {
      createMsgBoardAndBtn.welcomeMessage.textContent = 'Player X make your first move.';
    }
  }, 1000)
});
createMsgBoardAndBtn.resetGame.addEventListener('click', restartGame);