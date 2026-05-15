class room extends Phaser.Scene {
  constructor() {
    super("room");
    this.qrcodeContainer = document.getElementById("qr-code");
  }

  create() {
    this.add.image(400, 225, "room-brackground");
    this.game.room = (Math.random() * 10000).toString().split(".")[0];
    this.add.text(50, 50, this.game.room, {
      fontFamily: "pixelify-sans",
      fontSize: "32px",
      fill: "#000000",
    });

    new QRCode(this.qrcodeContainer, {
      text: location.href + "?room=" + this.game.room,
      width: 320,
      height: 240,
    });

    console.log("Joining room:", this.game.room);
    this.game.socket.emit("join-room", this.game.room);

    this.game.socket.on("player-selected", (player) => {
      console.log(
        "Player selected in room:",
        this.game.room,
        "player:",
        player,
      );

      if (player === "vd") this.game.localPlayer = "character";
      else this.game.localPlayer = "vd";

      this.qrcodeContainer.remove();

      this.scene.stop("room");
    
      this.scene.start("scene1", { x: 10, y: 50 });
    });
  }
}

export default room;
