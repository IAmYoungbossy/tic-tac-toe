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
