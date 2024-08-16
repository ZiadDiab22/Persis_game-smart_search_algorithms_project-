import piece from "./piece.js";

export default class board {
  constructor(boardArr, computerPieces, humanPieces, computerWin, humanWin, p) {
    if (boardArr == 0) {
      this.rows = 19; //عدد أسطر الرقعة 
      this.columns = 19; //عدد أعمدة الرقعة
      this.computerPieces = []; //مصفوفة فيها أحجار الكومبيوتر الموجودة حاليا في الرقعة
      this.humanPieces = []; //مصفوفة فيها أحجار المستخدم الموجودة حاليا في الرقعة
      this.safePositions = [[16, 8], [16, 10], [10, 16], [8, 16], [10, 2], [8, 2], [2, 8], [2, 10]];
      this.createBoard(); //تابع إنشار رقعة جديدة 
      this.slodiers = 0; //عدد أحجار الكومبيوتر الموجودة حاليا في الرقعة
      this.hourses = 0; //عدد أحجار المستخدم الموجودة حاليا في الرقعة
      this.computerWin = 0; //عدد أحجار الكومبيوتر الموجودة داخل المطبخ (الفائزة)
      this.humanWin = 0; //عدد أحجار المستخدم الموجودة حاليا في الرقعة
    }
    else {
      this.computerPieces = computerPieces;
      this.humanPieces = humanPieces;
      this.slodiers = this.computerPieces.length;
      this.hourses = this.humanPieces.length;
      this.computerWin = computerWin;
      this.humanWin = humanWin;
      this.boardArr = boardArr;
      this.pieceMoved = p;
    };
    this.throwValue = 0; //قيمة الرمية الحالية - قيمة الرمية : يعني كم صدفة وجهها لأسفل
    this.throwsInfo = []; //مصفوفة فيها معلومات كل رمية (عدد الأصداف التي وجهها للأسفل - اسم الرمية - خطواتها - احتمال ظهورها)
    this.addRow(); //تابع انشاء المصفوفة السابقة 
    this.currentthrowsValues = []; //مصفوفة نضع فيها قيم الرميات الظاهرة الدور الحالي
    this.currentthrowsNames = []; //مصفوفة نضع فيها اسماءالحركات الظاهرة في الدور الحالي
    this.currentthrowsSteps = []; //مصفوفة نضع فيها عدد خطوات الحركات الظاهرة في الدور الحالي
    this.possibleMoves = [];
    this.createMaps();
    this.foundObject = 0;
    this.h = 0;
    this.safePositions = [[16, 8], [16, 10], [10, 16], [8, 16], [10, 2], [8, 2], [2, 8], [2, 10]];
  }


  createMaps() {

    this.replacGMap = {
      ' ': ' ',
      '1': ' ',
      '11': '1',
      '111': '11',
      '1111': '111',
      'x1': 'x',
      'x11': 'x1',
      'x111': 'x11',
      'x1111': 'x111'
    };

    this.replacGSMap = {
      ' ': ' ',
      '2': ' ',
      '22': '2',
      '222': '22',
      '2222': '222',
      'x2': 'x',
      'x22': 'x2',
      'x222': 'x22',
      'x2222': 'x222'
    };

    this.replaceWMap = {
      ' ': '1',
      '1': '11',
      '11': '111',
      '111': '1111',
      'x': 'x1',
      'x1': 'x11',
      'x11': 'x111',
      'x111': 'x1111',
    };

    this.replaceWSMap = {
      ' ': '2',
      '2': '22',
      '22': '222',
      '222': '2222',
      'x': 'x2',
      'x2': 'x22',
      'x22': 'x222',
      'x222': 'x2222',
    };
  }

  win(player) {
    if (player == 'human') {
      if (this.humanWin == 4) return true;
      else return false
    }
    else {
      if (this.computerWin == 4) return true;
      else return false
    }
  }

  play() {

    if (this.win('human')) {
      console.log("***** Human win *****");
      return;
    }

    else if (this.win('computer')) {
      console.log("***** computer win *****");
      return;
    }

    else {
      console.log("YOUR TURN ...");
      let input = prompt("select t to throw :");
      if (input == "t") {
        this.humanPlay();
      }
    }

    console.log("COMPUTER TURN ...");
    this.computerPlay();

  }

  humanPlay() {
    let t = 0
    this.currentthrowsValues = [];
    this.currentthrowsNames = [];
    this.currentthrowsSteps = [];
    while (((t == 0) || (t == 1) || (t == 5) || (t == 6)) && (this.currentthrowsNames.length <= 10)) {
      t = this.throw();
      this.foundObject = this.throwsInfo.find(obj => obj.value == t);
      this.currentthrowsValues.push(t);
      this.currentthrowsNames.push(this.foundObject.name);
      this.currentthrowsSteps.push(this.foundObject.steps);
      if ((t == 1) || (t == 5)) {
        this.currentthrowsValues.push(7);
        this.currentthrowsNames.push('khal');
        this.currentthrowsSteps.push(1);
      }
    }

    // this.currentthrowsValues = [7, 20, 3];
    // this.currentthrowsNames = ['khal', 'ss', 'three'];
    // this.currentthrowsSteps = [1, 35, 3];

    while (this.currentthrowsValues.length > 0) {
      console.log('\nyour throws :');
      for (let i = 0; i < this.currentthrowsValues.length; i++) {
        console.log(i + 1, this.currentthrowsNames[i]);
      }
      if ((!(this.currentthrowsValues.includes(7))) && (this.hourses == 0)) break;
      while ((this.currentthrowsValues.includes(7)) && (this.hourses + this.humanWin < 4)) {
        let ans = prompt("would you want to enter new piece ? (y/n)");
        if (ans == "n") break;
        else if (ans == "y") {
          this.enterPiece('human');
          let ind = this.currentthrowsValues.indexOf(7)
          this.currentthrowsValues.splice(ind, 1);
          this.currentthrowsNames.splice(ind, 1);
          this.currentthrowsSteps.splice(ind, 1);
          for (let i = 0; i < this.currentthrowsValues.length; i++) {
            console.log(i + 1, this.currentthrowsNames[i]);
          }
        }
      }

      if ((this.currentthrowsValues.length > 1) && (this.hourses > 1))
        var input = prompt("select move :");
      else input = 1
      this.walk(this.currentthrowsSteps[input - 1], 'human');
      this.currentthrowsValues.splice(input - 1, 1);
      this.currentthrowsNames.splice(input - 1, 1);
      this.currentthrowsSteps.splice(input - 1, 1);
    }
  }

  computerPlay() {
    let t = 0
    this.currentthrowsValues = [];
    this.currentthrowsNames = [];
    this.currentthrowsSteps = [];
    while (((t == 0) || (t == 1) || (t == 5) || (t == 6)) && (this.currentthrowsNames.length <= 10)) {
      t = this.throw();
      this.foundObject = this.throwsInfo.find(obj => obj.value == t);
      this.currentthrowsValues.push(t);
      this.currentthrowsNames.push(this.foundObject.name);
      this.currentthrowsSteps.push(this.foundObject.steps);
      if ((t == 1) || (t == 5)) {
        this.currentthrowsValues.push(7);
        this.currentthrowsNames.push('khal');
        this.currentthrowsSteps.push(1);
      }
    }

    // this.currentthrowsValues = [7, 2, 4];
    // this.currentthrowsNames = ['khal', 'two', 'four'];
    // this.currentthrowsSteps = [1, 2, 4];

    while (this.currentthrowsValues.length > 0) {
      console.log('\ncomputer throws :');
      for (let i = 0; i < this.currentthrowsValues.length; i++) {
        console.log(i + 1, this.currentthrowsNames[i]);
      }
      if ((!(this.currentthrowsValues.includes(7))) && (this.slodiers == 0)) break;
      while ((this.currentthrowsValues.includes(7)) && (this.slodiers + this.computerWin < 4)) {
        this.enterPiece('computer');
        let ind = this.currentthrowsValues.indexOf(7)
        this.currentthrowsValues.splice(ind, 1);
        this.currentthrowsNames.splice(ind, 1);
        this.currentthrowsSteps.splice(ind, 1);
        console.log('\ncomputer throws :');
        for (let i = 0; i < this.currentthrowsValues.length; i++) {
          console.log(i + 1, this.currentthrowsNames[i]);
        }
      }

      this.walk(this.currentthrowsSteps[0], 'computer');
      this.currentthrowsValues.splice(0, 1);
      this.currentthrowsNames.splice(0, 1);
      this.currentthrowsSteps.splice(0, 1);
    }
  }

  addRow() {
    this.throwsInfo = [
      { value: 1, steps: 10, name: 'dst', probability: 0.186624 },
      { value: 2, steps: 2, name: 'two', probability: 0.31104 },
      { value: 3, steps: 3, name: 'three', probability: 0.27648 },
      { value: 4, steps: 4, name: 'four', probability: 0.13824 },
      { value: 5, steps: 24, name: 'png', probability: 0.036864 },
      { value: 0, steps: 6, name: 'shaka', probability: 0.046656 },
      { value: 6, steps: 12, name: 'bara', probability: 0.004096 },
      { value: 7, steps: 1, name: 'khal', probability: 0.223488 }
    ];
  }
  // إنشاء الرقعة الابتدائية
  createBoard() {
    this.boardArr = new Array(this.rows);
    for (let i = 0; i < this.rows; i++) {
      this.boardArr[i] = new Array(this.columns);
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if ((!((i >= 8) && (i <= 10))) && (!((j >= 8) && (j <= 10))))
          this.boardArr[i][j] = 'N';
        else if (((i >= 8) && (i <= 10)) && (((j >= 8) && (j <= 10))))
          this.boardArr[i][j] = 'K';
        else this.boardArr[i][j] = ' ';
      }
    }
    this.safePositions = [[16, 8], [16, 10], [10, 16], [8, 16], [10, 2], [8, 2], [2, 8], [2, 10]];
    this.safePositions.forEach(([r, c]) => {
      this.boardArr[r][c] = 'x';
    });
  }
  //رمي بشكل عشوائي
  throw2() {
    return Math.floor(Math.random() * 7);
  }
  //رمي وفقا لنتائج الاحتمالات
  throw() {
    // probabilities of throw
    let rand = Math.random();
    if (rand <= 0.27648) { // three = 0.27648 = 27.648 %
      return 3;
    } else if (rand <= 0.41472) { // four = 0.13824 = 13.824 %
      return 4;
    } else if (rand <= 0.72576) { // two = 0.31104 = 31.104 %
      return 2;
    } else if (rand <= 0.729856) { // bara = 0.004096 = 0.4096 %
      return 6;
    } else if (rand <= 0.776512) { // shaka = 0.046656 = 4.6656 %
      return 0;
    } else if (rand <= 0.813376) { // png = 0.036864 = 3.6864 %
      return 5;
    } else { // dst = 0.186624 = 18.6624 %
      return 1;
    }
  }
  //طباعة الرقعة
  printArray() {
    console.log("---");
    for (let i = 0; i < this.rows; i++) {
      console.log(this.boardArr[i]);
    }
    console.log("---");
  }
  //إدخال حجر جديد إلى الرقعة
  enterPiece(player) {

    if (player == 'human') {
      let p = new piece('human')
      this.humanPieces.push(p);
      this.hourseIn(p.pos[0], p.pos[1]);
      this.printArray();
      this.hourses++;
    }
    else {
      let p = new piece('computer')
      this.computerPieces.push(p);
      this.soldierIn(p.pos[0], p.pos[1]);
      this.printArray();
      this.slodiers++;
    }
  }
  // ادخال حصان (الحجر الخاص بالمستخدم) إلى المطبخ
  enterHourse() { //to kithcen
    outerLoop:
    for (let i = 10; i > 8; i--) {
      for (let j = 10; j > 7; j--) {
        if (this.boardArr[i][j] == 'K') {
          this.boardArr[i][j] = '1';
          break outerLoop;
        }
      }
    }
    for (let i = 0; i < this.humanPieces.length; i++) {
      if (this.humanPieces[i].steps == 84) {
        this.humanPieces.splice(i, 1);
      }
    }
    this.humanWin++
    this.hourses--
  }
  // ادخال جندي (الحجر الخاص بالكومبيوتر) إلى المطبخ
  enterSoldier() {
    outerLoop:
    for (let i = 8; i < 10; i++) {
      for (let j = 8; j < 11; j++) {
        if (this.boardArr[i][j] == 'K') {
          this.boardArr[i][j] = '2';
          break outerLoop;
        }
      }
    }
    for (let i = 0; i < this.computerPieces.length; i++) {
      if (this.computerPieces[i].steps == 84) {
        this.computerPieces.splice(i, 1);
      }
    }
    this.computerWin++
    this.slodiers--
  }
  //حذف حجر من مصفوفة الأحجار الحالية (نستخدمها لما حجر يقتل حجر آخر)
  deleteObject(a, b, player) {
    if (player == 'human') {
      for (let i = 0; i < this.computerPieces.length; i++) {
        if (this.computerPieces[i].pos[0] == a && this.computerPieces[i].pos[1] == b) {
          this.computerPieces.splice(i, 1);
          this.slodiers--;
        }
      }
    }
    else {
      for (let i = 0; i < this.humanPieces.length; i++) {
        if (this.humanPieces[i].pos[0] == a && this.humanPieces[i].pos[1] == b) {
          this.humanPieces.splice(i, 1);
          this.hourses--;
        }
      }
    }
  }
  //خروج حصان من موقعه
  hourseOut(i, j) {

    this.boardArr[i][j] = this.replacGMap[this.boardArr[i][j]] || this.boardArr[i][j];
  }
  //خروج جندي من موقعه
  soldierOut(i, j) {

    this.boardArr[i][j] = this.replacGSMap[this.boardArr[i][j]] || this.boardArr[i][j];
  }
  //دخول الحصان الى مكانه (مثلا اذا كان المكان فاضي بيصير فيه حصان و اذا كان فيه حصان بيصير حصانين وهيك..)
  hourseIn(i, j) {

    if (this.replaceWMap[this.boardArr[i][j]]) {
      this.boardArr[i][j] = this.replaceWMap[this.boardArr[i][j]];
    } else if (this.boardArr[i][j] == 'x2' || this.boardArr[i][j] == 'x22' || this.boardArr[i][j] == 'x222' || this.boardArr[i][j] == 'x2222') {
      return;
    } else {
      this.deleteObject(i, j, 'human');
      this.boardArr[i][j] = '1';
    }

  }
  //دخول جندي الى مكانه
  soldierIn(i, j) {

    if (this.replaceWSMap[this.boardArr[i][j]]) {
      this.boardArr[i][j] = this.replaceWSMap[this.boardArr[i][j]];
    } else if (this.boardArr[i][j] == 'x1' || this.boardArr[i][j] == 'x11' || this.boardArr[i][j] == 'x111' || this.boardArr[i][j] == 'x1111') {
      return;
    } else {
      this.deleteObject(i, j, 'computer');
      this.boardArr[i][j] = '2';
    }

  }
  //قسمت مسار اللاعب الى أقسام لأنو بكل قسم رح نحركو بطريقة (نزود و ننقص اعمدة وسطور)
  //هاد التابع بيشوف الحجر كم خطوة صرلو ماشي و بيقلي بأيا قسم موجود
  whichPart(h) {
    if ((h.steps >= 1) && (h.steps <= 16)) return 1;
    else if ((h.steps >= 17) && (h.steps <= 33)) return 2;
    else if ((h.steps >= 34) && (h.steps <= 50)) return 3;
    else if ((h.steps >= 51) && (h.steps <= 67)) return 4;
    else if ((h.steps >= 68) && (h.steps <= 83)) return 5;
    else return 6;
  }

  //التوابع التالية هي توابع تحريك أحجار المستخدم حسب القسم الموجودة فيه 
  HinPart1(steps, h) {
    let i = h.pos[0];
    let j = h.pos[1];

    this.hourseOut(i, j);

    while (steps > 0) {
      if ((j == 9) && (i <= 17)) {
        i++;
        h.pos[0] = i;
      }
      else if ((j == 9) && (i == 18)) {
        j++;
        h.pos[1] = j;
      }
      else if ((j == 10) && (i <= 18) && (i >= 12)) {
        i--;
        h.pos[0] = i;
      }
      else if (j > 10) {
        if (this.whichPart(h) == 2) {
          this.HinPart2(steps, h)
          break;
        }
      }
      else if ((j == 10) && (i == 11)) {
        j++;
        i--;
        h.pos[0] = i;
        h.pos[1] = j;
        if (steps == 1) { this.hourseIn(i, j); }
      }
      steps--;
      h.steps++;
    }

    if (j <= 10) this.hourseIn(i, j);
  }

  HinPart2(steps, h) {
    let i = h.pos[0];
    let j = h.pos[1];

    this.hourseOut(i, j);

    while (steps > 0) {
      if ((i == 10) && (j <= 17)) {
        j++;
        h.pos[1] = j;
      }
      else if (((i == 10) && (j == 18)) || (i == 9)) {
        i--;
        h.pos[0] = i;
      }
      else if ((i == 8) && (j >= 12)) {
        j--;
        h.pos[1] = j;
      }
      else if ((i == 8) && (j == 11)) {
        j--;
        i--;
        h.pos[0] = i;
        h.pos[1] = j;
        if (steps == 1) { this.hourseIn(i, j); }
      }
      else if (j <= 10) {
        if (this.whichPart(h) == 3) {
          this.HinPart3(steps, h)
          break;
        }
      }
      steps--;
      h.steps++;
    }

    if (j > 10) this.hourseIn(i, j);
  }

  HinPart3(steps, h) {
    let i = h.pos[0];
    let j = h.pos[1];

    this.hourseOut(i, j);

    while (steps > 0) {
      if ((j == 10) && (i > 0)) {
        i--;
        h.pos[0] = i;
      }
      else if (((j == 10) && (i == 0)) || (j == 9)) {
        j--;
        h.pos[1] = j;
      }
      else if ((j == 8) && (i <= 6)) {
        i++;
        h.pos[0] = i;
      }
      else if (j < 8) {
        if (this.whichPart(h) == 4) {
          this.HinPart4(steps, h)
          break;
        }
      }
      else if ((j == 8) && (i == 7)) {
        j--;
        i++;
        h.pos[0] = i;
        h.pos[1] = j;
        if (steps == 1) { this.hourseIn(i, j); }
      }
      steps--;
      h.steps++;
    }

    if (j > 7) this.hourseIn(i, j);
  }

  HinPart4(steps, h) {
    let i = h.pos[0];
    let j = h.pos[1];

    if (h.steps + steps == 84) {
      this.hourseOut(i, j);
      h.steps += steps;
      this.enterHourse();
      return;
    }
    if (h.steps + steps > 84) return;

    this.hourseOut(i, j);

    while (steps > 0) {
      if ((i == 8) && (j > 0)) {
        j--;
        h.pos[1] = j;
      }
      else if (((i == 8) && (j == 0)) || (i == 9)) {
        i++;
        h.pos[0] = i;
      }
      else if ((i == 10) && (j <= 6)) {
        j++;
        h.pos[1] = j;
      }
      else if ((i == 10) && (j == 7)) {
        j++;
        i++;
        h.pos[0] = i;
        h.pos[1] = j;
        if (steps == 1) { this.hourseIn(i, j); }
      }
      else if (j > 7) {
        if (this.whichPart(h) == 5) {
          this.HinPart5(steps, h)
          break;
        }
      }
      steps--;
      h.steps++;
    }

    if (j < 8) this.hourseIn(i, j);
  }

  HinPart5(steps, h) {
    let i = h.pos[0];
    let j = h.pos[1];

    if (h.steps + steps == 84) {
      this.hourseOut(i, j);
      h.steps += steps;
      this.enterHourse();
      return;
    }
    if (h.steps + steps > 84) return;
    this.hourseOut(i, j);

    while (steps > 0) {
      if ((j == 8) && (i < 18)) {
        i++;
        h.pos[0] = i;
      }
      else if (((j == 8) && (i == 18))) {
        j++;
        h.pos[1] = j;
      }
      else if ((j == 9) && (i > 11)) {
        i--;
        h.pos[0] = i;
      }
      steps--;
      h.steps++;
    }
    this.hourseIn(i, j);
  }

  //التوابع التالية هي توابع تحريك أحجار الكومبيوتر حسب القسم الموجودة فيه
  CinPart1(steps, h) {
    let i = h.pos[0];
    let j = h.pos[1];

    this.soldierOut(i, j);

    while (steps > 0) {
      if ((j == 9) && (i >= 1)) {
        i--;
        h.pos[0] = i;
      }
      else if ((j == 9) && (i == 0)) {
        j--;
        h.pos[1] = j;
      }
      else if ((j == 8) && (i >= 0) && (i <= 6)) {
        i++;
        h.pos[0] = i;
      }
      else if (j < 8) {
        if (this.whichPart(h) == 2) {
          this.CinPart2(steps, h)
          break;
        }
      }
      else if ((j == 8) && (i == 7)) {
        j--;
        i++;
        h.pos[0] = i;
        h.pos[1] = j;
        if (steps == 1) { this.soldierIn(i, j); }
      }
      steps--;
      h.steps++;
    }

    if (j > 7) this.soldierIn(i, j);
  }

  CinPart2(steps, h) {
    let i = h.pos[0];
    let j = h.pos[1];

    this.soldierOut(i, j);

    while (steps > 0) {
      if ((i == 8) && (j >= 1)) {
        j--;
        h.pos[1] = j;
      }
      else if (((i == 8) && (j == 0)) || (i == 9)) {
        i++;
        h.pos[0] = i;
      }
      else if ((i == 10) && (j <= 6)) {
        j++;
        h.pos[1] = j;
      }
      else if ((i == 10) && (j == 7)) {
        j++;
        i++;
        h.pos[0] = i;
        h.pos[1] = j;
        if (steps == 1) { this.soldierIn(i, j); }
      }
      else if (j > 7) {
        if (this.whichPart(h) == 3) {
          this.CinPart3(steps, h)
          break;
        }
      }
      steps--;
      h.steps++;
    }

    if (j < 8) this.soldierIn(i, j);
  }

  CinPart3(steps, h) {
    let i = h.pos[0];
    let j = h.pos[1];

    this.soldierOut(i, j);

    while (steps > 0) {
      if ((j == 8) && (i < 18)) {
        i++;
        h.pos[0] = i;
      }
      else if (((j == 8) && (i == 18)) || (j == 9)) {
        j++;
        h.pos[1] = j;
      }
      else if ((j == 10) && (i > 11)) {
        i--;
        h.pos[0] = i;
      }
      else if (j > 10) {
        if (this.whichPart(h) == 4) {
          this.CinPart4(steps, h)
          break;
        }
      }
      else if ((j == 10) && (i == 11)) {
        j++;
        i--;
        h.pos[0] = i;
        h.pos[1] = j;
        if (steps == 1) { this.soldierIn(i, j); }
      }
      steps--;
      h.steps++;
    }

    if (j < 11) this.soldierIn(i, j);
  }

  CinPart4(steps, h) {
    let i = h.pos[0];
    let j = h.pos[1];

    if (h.steps + steps == 84) {
      this.soldierOut(i, j);
      h.steps += steps;
      this.enterSoldier();
      return;
    }
    if (h.steps + steps > 84) return;

    this.soldierOut(i, j);

    while (steps > 0) {
      if ((i == 10) && (j < 18)) {
        j++;
        h.pos[1] = j;
      }
      else if (((i == 10) && (j == 18)) || (i == 9)) {
        i--;
        h.pos[0] = i;
      }
      else if ((i == 8) && (j > 11)) {
        j--;
        h.pos[1] = j;
      }
      else if ((i == 8) && (j == 11)) {
        j--;
        i--;
        h.pos[0] = i;
        h.pos[1] = j;
        if (steps == 1) { this.soldierIn(i, j); }
      }
      else if (j < 11) {
        if (this.whichPart(h) == 5) {
          this.CinPart5(steps, h)
          break;
        }
      }
      steps--;
      h.steps++;
    }

    if (j > 10) this.soldierIn(i, j);
  }

  CinPart5(steps, h) {
    let i = h.pos[0];
    let j = h.pos[1];

    if (h.steps + steps == 84) {
      this.soldierOut(i, j);
      h.steps += steps;
      this.enterSoldier();
      return;
    }
    if (h.steps + steps > 84) return;
    this.soldierOut(i, j);

    while (steps > 0) {
      if ((j == 10) && (i > 0)) {
        i--;
        h.pos[0] = i;
      }
      else if (((j == 10) && (i == 0))) {
        j--;
        h.pos[1] = j;
      }
      else if ((j == 9) && (i < 7)) {
        i++;
        h.pos[0] = i;
      }
      steps--;
      h.steps++;
    }
    this.soldierIn(i, j);
  }

  humanWalk(steps, h) {
    let n = this.whichPart(h);
    if (n == 1) this.HinPart1(steps, h);
    else if (n == 2) this.HinPart2(steps, h);
    else if (n == 3) this.HinPart3(steps, h);
    else if (n == 4) this.HinPart4(steps, h);
    else if (n == 5) this.HinPart5(steps, h);
  }

  computerWalk(steps, h) {
    let n = this.whichPart(h);
    if (n == 1) this.CinPart1(steps, h);
    else if (n == 2) this.CinPart2(steps, h);
    else if (n == 3) this.CinPart3(steps, h);
    else if (n == 4) this.CinPart4(steps, h);
    else if (n == 5) this.CinPart5(steps, h);
    this.h = this.heurstic()
  }

  walk(steps, player) {
    if (player == 'human' && this.hourses > 0) {
      if (this.hourses > 1) {
        this.humanPieces.sort((a, b) => a.steps - b.steps);
        let index = prompt("select piece to move");
        this.humanWalk(steps, this.humanPieces[index - 1])
      }
      else {
        this.humanWalk(steps, this.humanPieces[0])
      }
    }
    else if (player == 'computer' && this.slodiers > 0) {
      let bestScore = Number.NEGATIVE_INFINITY;
      let bestBoard = null;
      let possible = [];
      let visited = [];
      console.log("\n*\n*\n*\n*\n*\n*\n*\n*\n*\n*\n*\n*\n*\n*\n*\n*\n*\n*\n");
      let curr = JSON.parse(JSON.stringify(this))
      this.findPossibleMoves("computer", steps)
      // console.log("possible", this.possibleMoves);
      // console.log("curr", curr);
      for (let nextBoard of this.possibleMoves) {
        visited.push(nextBoard);
        let score = nextBoard.expectimax(curr, steps, nextBoard, 0, 2, visited);
        console.log("score", score);
        possible.push({ board: nextBoard, score: score });

        if (score > bestScore) {
          bestScore = score;
          bestBoard = nextBoard;
        }
      }

      if (possible.length > 1) {
        let bestMoves = [];
        for (let move of possible) {
          if (move.score === bestScore) {
            bestMoves.push(move.board);
          }
        }
        bestBoard = bestMoves[0];
      }
      console.log("nodes visited", visited.length)
      this.update(bestBoard);
    }
    this.printArray();
  }

  update(b) {
    this.boardArr = b.boardArr
    this.computerPieces = b.computerPieces
    this.humanPieces = b.humanPieces
    this.slodiers = b.slodiers
    this.hourses = b.hourses
    this.computerWin = b.computerWin
    this.humanWin = b.humanWin
    this.pieceMoved = b.pieceMoved
  }

  //إيجاد حركات الكومبيوتر الممكنة له , لكي يقوم لاحقا باختيار افضلها 
  findPossibleMoves(player, steps) {
    this.possibleMoves = []
    if (player == "computer") {
      for (let i = 0; i < this.computerPieces.length; i++) {
        let b = new board(JSON.parse(JSON.stringify(this.boardArr)), JSON.parse(JSON.stringify(this.computerPieces)),
          JSON.parse(JSON.stringify(this.humanPieces)), this.computerWin, this.humanWin, i)
        b.computerWalk(steps, b.computerPieces[i])
        this.possibleMoves.push(b)
      }
    }
    else {
      for (let i = 0; i < this.humanPieces.length; i++) {
        let b = new board(JSON.parse(JSON.stringify(this.boardArr)), JSON.parse(JSON.stringify(this.computerPieces)),
          JSON.parse(JSON.stringify(this.humanPieces)), this.computerWin, this.humanWin, i)
        b.humanWalk(steps, b.humanPieces[i])
        this.possibleMoves.push(b)
      }
    }
  }
  // تابع هيورستيك يقوم بحساب عدد الخطوات المتبقية للفوز باللعبة
  heurstic(player) {
    let remainingSteps = 336;
    if (player == "computer") {
      remainingSteps = remainingSteps - (84 * this.computerWin)
      for (let i = 0; i < this.computerPieces.length; i++) {
        let p = this.computerPieces[i]
        remainingSteps -= p.steps
      }
      return remainingSteps + this.hourses;
    }
    else {
      remainingSteps = remainingSteps - (84 * this.humanWin)
      for (let i = 0; i < this.humanPieces.length; i++) {
        let p = this.humanPieces[i]
        remainingSteps -= p.steps
      }
      return remainingSteps + this.slodiers;
    }
  }

  expectimax(current, steps, b, depth, maxDepth, vis) {
    if (depth == maxDepth || b.win("computer")) {
      console.log("last b in expectimax ", b)
      let ev = b.evaluate(current, b, "computer");
      console.log("ev in expectimax", ev)
      return ev;
    }
    console.log("b in expectimax ", b)
    let totalEval = 0.0;
    let numChildren = 0;
    for (let th of this.throwsInfo) {
      b.findPossibleMoves("human", th.steps)
      console.log("th", th);
      for (let nextBoard of b.possibleMoves) {
        vis.push(nextBoard);
        // console.log("dep", depth);
        totalEval += th.probability * b.maxMove(current, steps, nextBoard, depth + 1, maxDepth, vis);
        numChildren++;
      }
    }
    console.log("totalEval", totalEval);
    console.log("numChildren", numChildren);

    if (numChildren == 0) return 0; else return (totalEval / numChildren);
  }

  maxMove(current, steps, b, depth, maxDepth, vis) {
    if (depth == maxDepth || b.win("human")) {
      console.log("last b in maxMove ", b)
      let ev = b.evaluate(current, b, "human");
      console.log("ev in maxMove", ev)
      return ev;
    }
    console.log("b in MaxMove ", b)
    let maxEval = Number.NEGATIVE_INFINITY;
    b.findPossibleMoves("computer", steps)
    for (let nextBoard of b.possibleMoves) {
      vis.push(nextBoard);
      // console.log("dep", depth);
      let evaluation = b.expectimax(current, steps, nextBoard, depth + 1, maxDepth, vis);
      maxEval = Math.max(maxEval, evaluation);
    }
    return maxEval;
  }

  evaluate(t, b, player) {
    // t : الرقعة الأصلية قبل التحريك
    // b : الرقعة بعد التحريك
    console.log("old :", t, "\nnew :", b)
    if (b.kill("computer", t, b)) return 4000;
    else if (b.kill("human", t, b)) return -4000;
    else if (b.PieceWin(t, b, "computer")) return 3000
    else if (b.PieceWin(t, b, "human")) return -3000
    else if (b.Safe("computer", t, b)) return 2000;
    else if (b.Safe("human", t, b)) return -2000;
    else if (b.danger("computer", t, b)) return -1000;
    else if (b.danger("human", t, b)) return 1000;
    else {
      if (player == "computer") return (b.heurstic("computer"));
      else return (b.heurstic("human")) * (-1);
    }
  }


  PieceWin(t, b, player) {
    if (player == "human") {
      if (t.humanWin < b.humanWin) return true;
      else return false;
    }
    else {
      if (t.computerWin < b.computerWin) return true;
      else return false;
    }
  }

  kill(player, t, b) {
    if (player == "computer") {
      if ((t.hourses > b.hourses) && (t.humanWin == b.humanWin)) return true;
      else return false;
    }
    else {
      if ((t.slodiers > b.slodiers) && (t.computerWin == b.computerWin)) return true;
      else return false;
    }
  }

  Safe(player, t, b) {
    let ind;
    if (player == "computer") {
      for (let i = 0; i < b.computerPieces.length; i++) {
        if (b.computerPieces[i] && b.computerPieces[i].pos && (t.computerPieces[i].pos[0] != b.computerPieces[i].pos[0] || t.computerPieces[i].pos[1] != b.computerPieces[i].pos[1])) {
          ind = i;
          break;
        }
      }
      if (ind !== undefined) {
        let str1 = b.computerPieces[ind].pos.join(",");
        let str2 = this.safePositions.map(pos => pos.join(","));
        if (str2.includes(str1)) return true
        else return false;
      }
    }
    else {
      for (let i = 0; i < b.humanPieces.length; i++) {
        if (b.humanPieces[i] && b.humanPieces[i].pos && (t.humanPieces[i].pos[0] != b.humanPieces[i].pos[0] || t.humanPieces[i].pos[1] != b.humanPieces[i].pos[1])) {
          ind = i;
          break;
        }
      }

      if (ind !== undefined) {
        let str1 = b.humanPieces[ind].pos.join(",");
        let str2 = this.safePositions.map(pos => pos.join(","));
        if (str2.includes(str1)) return true;
        else return false;
      }
    }
  }

  danger(player, t, b) {
    if (player == "computer") {
      for (let i = 0; i < b.computerPieces.length; i++) {
        if (t.computerPieces[i].pos[0] != b.computerPieces[i].pos[0] || t.computerPieces[i].pos[1] != b.computerPieces[i].pos[1]) {
          for (let j = 0; j < b.humanPieces.length; j++) {
            if ((b.computerPieces[i].steps + 34 > b.humanPieces[j].steps) && (b.computerPieces[i].steps + 34 < b.humanPieces[j].steps + 5)) {
              if ((b.humanPieces[j].steps <= 41) && (b.computerPieces[i].steps <= 8)) return false;
              let str1 = b.computerPieces[i].pos.join(",");
              let str2 = this.safePositions.map(pos => pos.join(","));
              if (str2.includes(str1)) return false;
              return true;
            }
          }
        }
      }
      return false;
    }

    else {
      for (let i = 0; i < b.humanPieces.length; i++) {
        if (t.humanPieces[i].pos[0] != b.humanPieces[i].pos[0] || t.humanPieces[i].pos[1] != b.humanPieces[i].pos[1]) {
          for (let j = 0; j < b.computerPieces.length; j++) {
            if ((b.humanPieces[i].steps - 34 > b.computerPieces[j].steps) && (b.humanPieces[i].steps - 34 < b.computerPieces[j].steps + 5)) {
              if (b.computerPieces[j].steps <= 41 && b.humanPieces[i].steps <= 8) return false;
              let str1 = b.humanPieces[i].pos.join(",");
              let str2 = this.safePositions.map(pos => pos.join(","));
              if (str2.includes(str1)) return false;
              return true;
            }
          }
        }
      }
      return false;
    }

  }
}
