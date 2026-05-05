import config from "./config.js";
import scene0 from "./scene0.js";
import scene1 from "./scene1.js";
import scene2 from "./scene2.js";
import start from "./start.js";


class Game extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.add("start", start);
    this.scene.add("scene0", scene0);
    this.scene.add("scene1", scene1);
    this.scene.add("scene2", scene2);
    this.scene.start("start");
  }
}

window.onload = () => {
  window.game = new Game();
};
