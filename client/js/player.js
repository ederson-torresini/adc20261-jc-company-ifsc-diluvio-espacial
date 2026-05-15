class player extends Phaser.Scene {
  constructor() {
    super("player");
  }

  create() {
    this.add.image(320, 240, "start").postFX.addBlur(5);

    this.add
      .text(400, 50, "Escolha seu personagem:", {
        fontFamily: "pixelify-sans",
        fontSize: "64px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    this.anims.create({
      key: "vd",
      frames: this.anims.generateFrameNumbers("vd", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "character",
      frames: this.anims.generateFrameNumbers("character", {
        start: 8,
        end: 15,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.vd = this.add
      .sprite(300, 225, "vd")
      .setScale(3)
      .setInteractive()
      .on("pointerdown", () => {
        console.log("VD player selected");
        this.game.localPlayer = "vd";
        this.game.socket.emit(
          "select-player",
          this.game.room,
          this.game.localPlayer,
        );
        this.scene.stop("player");
        this.scene.start("scene1");
      });
    this.vd.play("vd");

    this.character = this.add
      .sprite(550, 225, "character")
      .setScale(3)
      .setInteractive()
      .on("pointerdown", () => {
        console.log("Character player selected");
        this.game.localPlayer = "character";
        this.game.socket.emit(
          "select-player",
          this.game.room,
          this.game.localPlayer,
        );
        this.scene.stop("player");
        this.scene.start("scene0");
      });
    this.character.play("character");
  }
}

export default player;
