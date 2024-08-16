
export default class piece {
  //كل حجر له المعلومات التالية : الخطوات يلي مشيها - موقع - شكل الحجر واللاعب (الحصان للمستخدم والجندي للكومبيوتر)
  constructor(player) {
    this.steps = 1;
    if (player == 'human') {
      this.shape = 'hourse';
      this.pos = [11, 9];
      this.value = "1";
    }
    else {
      this.shape = 'soldier';
      this.pos = [7, 9];
      this.value = "2";
    }
  }
}