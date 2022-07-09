let markTracker = [];
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
function togglePlayers(ar, box, arrayT) {
  if (box.textContent != "") return;
  else {
    if (arrayT[arrayT.length - 1] === "O" || arrayT.length < 1) {
      ar[parseInt(box.dataset.indexNumber)] = "X";
      arrayT.push("X");
      box.textContent = "X";
    } else if (arrayT[arrayT.length - 1] === "X") {
      ar[parseInt(box.dataset.indexNumber)] = "O";
      arrayT.push("O");
      box.textContent = "O";
    }
  }
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
    if (validLine === marker.x && markTracker.length - 1 < grids * grids) {
      feedback = "X wins";
    } else if (
      validLine === marker.o &&
      markTracker.length - 1 < grids * grids
    ) {
      feedback = "O wins";
    }
  });
  return {
    feedback,
  };
}
function boardReset() {
  gridSquares.divs.forEach((square) => {
    square.textContent = "";
  });
}
function checkForDraw(grids, box) {
  if (
    markTracker.length === grids * grids &&
    checkForWin(grids).feedback == undefined
  ) {
    alert("X and O Draws");
    Gameboard.reset();
    boardReset();
    markTracker = [];
  } else if (checkForWin(grids).feedback != undefined) {
    alert(checkForWin(grids).feedback);
    Gameboard.reset();
    boardReset();
    markTracker = [];
  }
}
const gridSquares = (function () {
  const divs = document.querySelectorAll(".squareDivs");
  return {
    divs,
  };
})();
function PushToArray(ar, grids) {
  gridSquares.divs.forEach((square) => {
    square.addEventListener("click", () => {
      togglePlayers(ar, square, markTracker);
      checkForWin(grids);
      checkForDraw(grids, square);
    });
  });
}
