class menu extends Phaser.Scene {
  constructor() {
    super("menu");
  }

  preload() {
    this.load.setPath("assets/");
  }

  create() {
    // Título
    const title = this.add.text(160, 40, "DILÚVIO ESPACIAL", {
      fontSize: "24px",
      fill: "#fff",
      align: "center",
      fontFamily: "Arial",
    });
    title.setOrigin(0.5, 0.5);

    // Subtítulo
    const subtitle = this.add.text(160, 70, "Escolha uma fase", {
      fontSize: "12px",
      fill: "#aaa",
      align: "center",
      fontFamily: "Arial",
    });
    subtitle.setOrigin(0.5, 0.5);

    // Botão Fase 1 (Scene0)
    const button1 = this.add.rectangle(160, 110, 80, 25, 0x2e7d32);
    const text1 = this.add.text(160, 110, "FASE 1", {
      fontSize: "14px",
      fill: "#fff",
      fontFamily: "Arial",
    });
    text1.setOrigin(0.5, 0.5);
    button1.setInteractive();
    button1.on("pointerdown", () => {
      this.scene.start("preloader", { nextScene: "scene0" });
    });
    button1.on("pointerover", () => {
      button1.setFillStyle(0x388e3c);
    });
    button1.on("pointerout", () => {
      button1.setFillStyle(0x2e7d32);
    });

    // Botão Fase 2 (Scene1)
    const button2 = this.add.rectangle(160, 145, 80, 25, 0x1565c0);
    const text2 = this.add.text(160, 145, "FASE 2", {
      fontSize: "14px",
      fill: "#fff",
      fontFamily: "Arial",
    });
    text2.setOrigin(0.5, 0.5);
    button2.setInteractive();
    button2.on("pointerdown", () => {
      this.scene.start("preloader", { nextScene: "scene1" });
    });
    button2.on("pointerover", () => {
      button2.setFillStyle(0x1976d2);
    });
    button2.on("pointerout", () => {
      button2.setFillStyle(0x1565c0);
    });

    // Botão Fase 3 (Scene2)
    const button3 = this.add.rectangle(160, 180, 80, 25, 0xc62828);
    const text3 = this.add.text(160, 180, "FASE 3", {
      fontSize: "14px",
      fill: "#fff",
      fontFamily: "Arial",
    });
    text3.setOrigin(0.5, 0.5);
    button3.setInteractive();
    button3.on("pointerdown", () => {
      this.scene.start("preloader", { nextScene: "scene2" });
    });
    button3.on("pointerover", () => {
      button3.setFillStyle(0xd32f2f);
    });
    button3.on("pointerout", () => {
      button3.setFillStyle(0xc62828);
    });

    // Botão Fase 4 (Scene3)
    const button4 = this.add.rectangle(160, 215, 80, 25, 0xf57c00);
    const text4 = this.add.text(160, 215, "FASE 4", {
      fontSize: "14px",
      fill: "#fff",
      fontFamily: "Arial",
    });
    text4.setOrigin(0.5, 0.5);
    button4.setInteractive();
    button4.on("pointerdown", () => {
      this.scene.start("preloader", { nextScene: "scene3" });
    });
    button4.on("pointerover", () => {
      button4.setFillStyle(0xff8f00);
    });
    button4.on("pointerout", () => {
      button4.setFillStyle(0xf57c00);
    });
  }
}

export default menu;
