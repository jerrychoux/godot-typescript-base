import { tool, property, node } from "../decorators";
import Player from "./player";

import ENEMY from "res://scenes/demo/enemy.tscn";

@tool
export default class Main extends godot.Node2D {
  score: number = 0;

  _ready() {
    this.gameNew();
  }

  _on_player_OnHited(body: godot.Node) {}

  _on_startTimer_timeout() {
    let enemyTimer = this.$("enemyTimer") as godot.Timer;
    enemyTimer.stop();
  }

  _on_scoreTimer_timeout() {
    this.score += 1;
  }

  _on_enemyTimer_timeout() {}

  gameOver() {
    let scoreTimer = this.$("scoreTimer") as godot.Timer;
    scoreTimer.stop();
  }

  gameNew() {
    this.score = 0;
    let enemy = (ENEMY as godot.PackedScene).instance();
    this.add_child(enemy);

    let startPosition = this.$("startPosition") as godot.Position2D;
    let player = this.$("player") as Player;

    player.start(startPosition.position);
  }
}
