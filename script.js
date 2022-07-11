let playTimer = [];
let backgroundArray = [];

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
    "You're welcome to Tic Tac Toe game.";
  createMsgBoardAndBtn.playHuman.textContent = "Play human";
  createMsgBoardAndBtn.playAI.textContent = "Play An A.I.";
  createMsgBoardAndBtn.resetGame.textContent = "Restart Game";
})();

const gameStorage = function (grids) {
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
};
const Gameboard = gameStorage(3);

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
      setTimeout(function () {
        createMsgBoardAndBtn.welcomeMessage.textContent = "Player O's turn.";
      }, 500);
    } else if (playTimer[playTimer.length - 1] === "X") {
      Gameboard.array[parseInt(box.dataset.indexNumber)] = "O";
      playTimer.push("O");
      box.textContent = "O";
      setTimeout(function () {
        createMsgBoardAndBtn.welcomeMessage.textContent = "Player X's turn.";
      }, 500);
    }
  }
  setTimeout(function () {
    if (playTimer.length >= 1) {
      createMsgBoardAndBtn.instructionMsg.textContent =
        "Think before making your next move.";
    }
  }, 1000);
}

function checkGameboardMarks(startIndex, interval, gridSize) {
  let array = [];
  let index = [];
  while (startIndex < Gameboard.array.length) {
    array.push(Gameboard.array[startIndex]);
    index.push(startIndex);
    array.length > gridSize ? array.pop() : false;
    index.length > gridSize ? index.pop() : false;
    startIndex += interval;
  }
  return {
    array: array.join(""),
    index: index.join(""),
  };
}
function iterateCheckGameboardMarks(startCount, grid, interval, gridSize) {
  let array = [];
  let index = [];
  for (let i = 0; i < grid; i += startCount) {
    array.push(checkGameboardMarks(i, interval, gridSize).array);
    index.push(checkGameboardMarks(i, interval, gridSize).index);
  }
  return {
    array,
    index,
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
function checkPlayersMarks(grids) {
  let array = cacheNewInstances(grids).playerMarks2.array.concat(
    cacheNewInstances(grids).playerMarks3.array,
    cacheNewInstances(grids).playerMarks1.array,
    cacheNewInstances(grids).playerMarks4.array
  );
  let index = cacheNewInstances(grids).playerMarks2.index.concat(
    cacheNewInstances(grids).playerMarks3.index,
    cacheNewInstances(grids).playerMarks1.index,
    cacheNewInstances(grids).playerMarks4.index
  );
  return {
    array,
    index,
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
  let backgroundColorIndex;
  checkPlayersMarks(grids).array.forEach((validLine) => {
    if (validLine === marker.x && playTimer.length - 1 < grids * grids) {
      feedback = "X wins";
      backgroundColorIndex = checkPlayersMarks(grids).array.indexOf(validLine);
    } else if (validLine === marker.o && playTimer.length - 1 < grids * grids) {
      feedback = "O wins";
      backgroundColorIndex = checkPlayersMarks(grids).array.indexOf(validLine);
    }
  });
  return {
    feedback,
    backgroundColorIndex,
  };
}

function announceGameOutcome(grids) {
  if (
    playTimer.length === grids * grids &&
    checkForWin(grids).feedback == undefined
  ) {
    setTimeout(function () {
      createMsgBoardAndBtn.welcomeMessage.textContent = "It's A Draw Game.";
    }, 501);
    setTimeout(function () {
      createMsgBoardAndBtn.instructionMsg.textContent =
        "Click the Restart button to play again.";
    }, 1000);
  } else if (checkForWin(grids).feedback != undefined) {
    if (checkForWin(grids).feedback == "X wins") {
      changeBackgroundColorForValidMarks(grids);
      setTimeout(function () {
        createMsgBoardAndBtn.welcomeMessage.textContent =
          "Player X Has Won This Round.";
      }, 501);
      setTimeout(function () {
        createMsgBoardAndBtn.instructionMsg.textContent =
          "Click the Restart button to play again.";
      }, 1000);
    }
    if (checkForWin(grids).feedback == "O wins") {
      changeBackgroundColorForValidMarks(grids);
      setTimeout(function () {
        createMsgBoardAndBtn.welcomeMessage.textContent =
          "Player O Has Won This Round.";
      }, 501);
      setTimeout(function () {
        createMsgBoardAndBtn.instructionMsg.textContent =
          "Click the Restart button to play again.";
      }, 1000);
    }
  }
}

function restartGame() {
  Gameboard.reset();
  boardReset();
  playTimer = [];
  checkForWin(3).feedback = "";
  createMsgBoardAndBtn.welcomeMessage.textContent =
    "Player X make your first move.";
  setTimeout(function () {
    createMsgBoardAndBtn.instructionMsg.textContent =
      "New game new opportunity.";
  }, 500);
  setTimeout(function () {
    if (playTimer.length >= 1) {
      createMsgBoardAndBtn.instructionMsg.textContent =
        "Think before making your next move.";
    }
  }, 1000);
  checkBoard.divs.forEach((div) => {
    div.style.backgroundColor = "#1f1f2f";
    div.style.color = "#74695b";
  });
}

function gameboardListener(grid) {
  checkBoard.divs.forEach((square) => {
    square.addEventListener("click", () => {
      markBoard(square);
      checkForWin(grid);
      announceGameOutcome(grid);
    });
  });
}

function changeBackgroundColorForValidMarks(grids) {
  let array = [
    ...checkPlayersMarks(grids).index[+checkForWin(grids).backgroundColorIndex],
  ];
  for (let i = 0; i <= checkBoard.divs.length; i++) {
    for (let j = 0; j <= checkBoard.divs.length; j++) {
      if (i == array[j]) {
        checkBoard.divs[i].style.backgroundColor = "#4c495f";
        checkBoard.divs[i].style.color = "#cacaca";
      }
    }
  }
}

createMsgBoardAndBtn.playHuman.addEventListener("click", () => {
  gameboardListener(3);
  setTimeout(function () {
    if (playTimer.length === 0) {
      createMsgBoardAndBtn.welcomeMessage.textContent =
        "Player X make your first move.";
    }
  }, 1000);
});
createMsgBoardAndBtn.resetGame.addEventListener("click", restartGame);