import board from "./board.js";

const board1 = new board(0);

document.addEventListener('keydown', function (event) {
  if (event.key == 'p') {
    board1.printArray();
  }
});

document.addEventListener('keydown', function (event) {
  if (event.key == 'z') {
    board1.play();
  }
});