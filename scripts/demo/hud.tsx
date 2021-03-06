import { onready, signal, tool } from "../decorators";

@tool
export default class Hud extends godot.CanvasLayer {
  @signal
  static readonly OnStartGame: string;

  //   @onready("scoreLabel")
  scoreLabel: godot.Label;
  //   @onready("message")
  message: godot.Label;
  //   @onready("startButton")
  startButton: godot.Button;
  //   @onready("messageTimer")
  messageTimer: godot.Timer;

  _ready() {
    this.scoreLabel = this.$("scoreLabel") as godot.Label;
    this.message = this.$("message") as godot.Label;
    this.startButton = this.$("startButton") as godot.Button;
    this.messageTimer = this.$("messageTimer") as godot.Timer;
    // this.showGameOver();
  }

  _on_startButton_pressed() {
    this.startButton.hide();
    this.emit_signal(Hud.OnStartGame);
  }

  _on_messageTimer_timeout() {
    this.message.hide();
  }

  showMessage(text: string) {
    this.message.text = text;
    this.message.show();
    this.messageTimer.start();
  }

  async showGameOver() {
    this.showMessage("Game Over");
    await godot.yield(this.messageTimer, "timeout");

    this.message.text = "Dodge the\nCreeps!";
    this.message.show();

    godot.yield(this.get_tree().create_timer(1), "timeout");
    this.startButton.show();
  }

  updateScore(score: number) {
    this.scoreLabel.text = godot.str(score);
  }
}
