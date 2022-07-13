let playTimer = [];
let backgroundArray = [];

const createDomElement = (function () {
  const infoBoard = document.querySelector(".info-board");
  const gameReporter = document.createElement("p");
  const instruction = document.createElement("p");
  const playAI = document.createElement("button");
  const playHuman = document.createElement("button");
  const bodyHTML = document.querySelector("body");
  const resetGame = document.createElement("button");
  bodyHTML.appendChild(resetGame);
  infoBoard.appendChild(gameReporter);
  infoBoard.appendChild(instruction);
  infoBoard.appendChild(playAI);
  infoBoard.appendChild(playHuman);
  return {
    infoBoard,
    gameReporter,
    instruction,
    playAI,
    playHuman,
    resetGame,
  };
})();

const defaultTexts = (function () {
  createDomElement.instruction.textContent =
    "Click any of the below buttons to proceed.";
  createDomElement.gameReporter.textContent =
    "You're welcome to Tic Tac Toe game.";
  createDomElement.playHuman.textContent = "Play human";
  createDomElement.playAI.textContent = "Play An A.I.";
  createDomElement.resetGame.textContent = "Restart Game";
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

const createPlayBoard = function (i) {
  const gameboard = document.querySelector(".gameboard");
  const square = document.createElement("div");
  square.style.border = "1px solid #703f70";
  square.style.borderRadius = "15px";
  square.setAttribute("data-index-number", `${i}`);
  square.classList.add("squareDivs", "square");
  gameboard.appendChild(square);
};
const createPlayBoardSquares = (function () {
  for (let i = 0; i < 9; i++) createPlayBoard(i);
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
        createDomElement.gameReporter.textContent = "Player O's turn.";
      }, 500);
    } else if (playTimer[playTimer.length - 1] === "X") {
      Gameboard.array[parseInt(box.dataset.indexNumber)] = "O";
      playTimer.push("O");
      box.textContent = "O";
      setTimeout(function () {
        createDomElement.gameReporter.textContent = "Player X's turn.";
      }, 500);
    }
  }
  setTimeout(function () {
    if (playTimer.length >= 1) {
      createDomElement.instruction.textContent =
        "Think before making your next move.";
    }
  }, 1000);
}

function scanForValidMove(startIndex, interval, gridSize) {
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
function iteratescanForValidMove(startCount, grid, interval, gridSize) {
  let array = [];
  let index = [];
  for (let i = 0; i < grid; i += startCount) {
    array.push(scanForValidMove(i, interval, gridSize).array);
    index.push(scanForValidMove(i, interval, gridSize).index);
  }
  return {
    array,
    index,
  };
}
function cacheNewInstances(grid) {
  if (grid < grid) return;
  const playerMarks1 = scanForValidMove(0, grid + 1, grid),
    playerMarks2 = iteratescanForValidMove(1, grid, grid, grid),
    playerMarks3 = iteratescanForValidMove(grid, grid * grid, 1, grid),
    playerMarks4 = scanForValidMove(grid - 1, grid - 1, grid);
  return {
    playerMarks1,
    playerMarks2,
    playerMarks3,
    playerMarks4,
  };
}
function storeAllGameMoves(grids) {
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

const validWinMoveFor = (function () {
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
  storeAllGameMoves(grids).array.forEach((validLine) => {
    if (
      validLine === validWinMoveFor.x &&
      playTimer.length - 1 < grids * grids
    ) {
      feedback = "X wins";
      backgroundColorIndex = storeAllGameMoves(grids).array.indexOf(validLine);
    } else if (
      validLine === validWinMoveFor.o &&
      playTimer.length - 1 < grids * grids
    ) {
      feedback = "O wins";
      backgroundColorIndex = storeAllGameMoves(grids).array.indexOf(validLine);
    }
  });
  return {
    feedback,
    backgroundColorIndex,
  };
}

function announceGameOutcome(grids) {
  let condition;
  if (
    playTimer.length === grids * grids &&
    checkForWin(grids).feedback == undefined
  ) {
    condition = true;
    setTimeout(function () {
      createDomElement.gameReporter.textContent = "It's A Draw Game.";
    }, 501);
    setTimeout(function () {
      createDomElement.instruction.textContent =
        "Click the Restart button to play again.";
    }, 1000);
  } else if (checkForWin(grids).feedback != undefined) {
    if (checkForWin(grids).feedback == "X wins") {
      condition = true;
      addBackgroundColorForValidMoves(grids);
      setTimeout(function () {
        createDomElement.gameReporter.textContent =
          "Player X Has Won This Round.";
      }, 501);
      setTimeout(function () {
        createDomElement.instruction.textContent =
          "Click the Restart button to play again.";
      }, 1000);
    }
    if (checkForWin(grids).feedback == "O wins") {
      condition = true;
      addBackgroundColorForValidMoves(grids);
      setTimeout(function () {
        createDomElement.gameReporter.textContent =
          "Player O Has Won This Round.";
      }, 501);
      setTimeout(function () {
        createDomElement.instruction.textContent =
          "Click the Restart button to play again.";
      }, 1000);
    }
  }
  return {
    condition,
  };
}

function restartGame() {
  Gameboard.reset();
  boardReset();
  playTimer = [];
  checkForWin(3).feedback = "";
  createDomElement.gameReporter.textContent = "Player X make your first move.";
  setTimeout(function () {
    createDomElement.instruction.textContent =
      "New game, new opportunity. Think smart.";
  }, 500);
  setTimeout(function () {
    if (playTimer.length >= 1) {
      createDomElement.instruction.textContent =
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
      computerPlay(grid);
      checkForWin(grid);
      announceGameOutcome(grid);
    });
  });
}

function addBackgroundColorForValidMoves(grids) {
  let array = [
    ...storeAllGameMoves(grids).index[+checkForWin(grids).backgroundColorIndex],
  ];
  for (let i = 0; i <= checkBoard.divs.length; i++) {
    for (let j = 0; j <= checkBoard.divs.length; j++) {
      if (i == array[j]) {
        checkBoard.divs[i].style.backgroundColor = "#8000804d";
        checkBoard.divs[i].style.color = "#cacaca";
      }
    }
  }
}

function startAndRestart(){
  gameboardListener(3);
  setTimeout(function () {
    if (playTimer.length === 0) {
      createDomElement.gameReporter.textContent =
        "Player X make your first move.";
    }
  }, 1000);
  restartGame();
}

createDomElement.playHuman.addEventListener("click", startAndRestart);
createDomElement.resetGame.addEventListener("click", restartGame);

function computerPlay(grid) {
  function findAvailableCheckBox() {
    let listOfUndefined = [],
      listOfMarkedIndexes = [],
      array = [],
      listOfAvailableIndexes = [];
    for (let i = 0; i < Gameboard.array.length; i++) {
      if (Gameboard.array[i] === undefined) {
        listOfUndefined.push(i);
      }
    }
    for (let i = 0; i < Gameboard.array.length; i++) {
      if (Gameboard.array[i] !== undefined) {
        listOfMarkedIndexes.push(i);
      }
    }
    let maxOflistOfMarkedIndex = Math.max(...listOfMarkedIndexes);
    let i = maxOflistOfMarkedIndex + 1;
    while (i < 9) {
      listOfAvailableIndexes.push(i);
      i++;
    }
    array = listOfUndefined.concat(listOfAvailableIndexes);
    return {
      array,
    };
  }
  function chooseRandom() {
    let index = Math.floor(
      Math.random() * findAvailableCheckBox().array.length
    );
    return {
      index,
    };
  }
  setTimeout(function () {
    let emptyRandomIndex = findAvailableCheckBox().array[chooseRandom().index];
    if (announceGameOutcome(grid).condition) return;
    else {
      if (playTimer[playTimer.length - 1] === "X") {
        Gameboard.array[emptyRandomIndex] = "O";
        playTimer.push("O");

        for (let i = 0; i < 9; i++) {
          if (checkBoard.divs[i].dataset.indexNumber == emptyRandomIndex) {
            checkBoard.divs[i].textContent = "O";
            announceGameOutcome(grid);
          }
        }
        setTimeout(function () {
          createDomElement.gameReporter.textContent = "Player X's turn.";
        }, 500);
      }
    }
  }, 1000);
}