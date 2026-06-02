import config from "./config.js";
import preloader from "./preloader.js";
import cutscene from "./cutscene.js";
import asteroids from "./asteroids.js";
import cave from "./cave.js";
import scene2 from "./scene2.js";
import scene3 from "./scene3.js";
import start from "./start.js";

class Game extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.add("start", start);
    this.scene.add("preloader", preloader);
    this.scene.add("cutscene", cutscene);
    this.scene.add("asteroids", asteroids);
    this.scene.add("cave", cave);
    this.scene.add("scene2", scene2);
    this.scene.add("scene3", scene3);
    this.scene.start("start");

    /*
    X = 0: valores 0 e 1
    A = 1: valores 0 e 1
    B = 2: valores 0 e 1
    Y = 3: valores 0 e 1
    L = 4: valores 0 e 1
    R = 6: valores 0 e 1
    Select = 8: valores 0 e 1
    Start = 9: valores 0 e 1

    axes[0] = eixo X: valores -1 (esquerda), 0 e 1 (direita)
    axes[1] = eixo Y: valores -1 (cima), 0 e 1 (baixo)
    */
  }
}

window.onload = () => {
  window.game = new Game();
};
