let playTimer = [];

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
  square.style.border = "1px solid black";
  square.setAttribute("data-index-number", `${i}`);
  square.classList.add("squareDivs", "square");
  gameboard.appendChild(square);
};

const createDivSquares = (function () {
  for (let i = 0; i < 9; i++) createDiv(i);
})();

const divSquares = (function () {
  const divs = document.querySelectorAll(".squareDivs");
  return {
    divs,
  };
})();

function boardReset() {
  divSquares.divs.forEach((square) => {
    square.textContent = "";
  });
}

function updatePlayerMarkToGameboard(box) {
  if (box.textContent != "") return;
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
    alert("X and O Draws");
    Gameboard.reset();
    boardReset();
    playTimer = [];
  } else if (checkForWin(grids).feedback != undefined) {
    alert(checkForWin(grids).feedback);
    Gameboard.reset();
    boardReset();
    playTimer = [];
  }
}

function gameboardListener(grids) {
  divSquares.divs.forEach((square) => {
    square.addEventListener("click", () => {
      updatePlayerMarkToGameboard(square);
      checkForWin(grids);
      checkForDraw(grids, square);
    });
  });
}
gameboardListener(3);