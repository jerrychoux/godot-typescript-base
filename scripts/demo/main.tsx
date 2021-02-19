import { tool, property, node } from "../decorators";
import Player from "./player";

import ENEMY from "res://scenes/demo/enemy.tscn";
import Enemy from "./enemy";

@tool
export default class Main extends godot.Node2D {
  score: number = 0;

  _ready() {
    godot.randomize();
    // this.gameNew();
  }

  _on_player_OnHited(body: godot.Node) {}

  _on_startTimer_timeout() {
    let enemyTimer = this.$("enemyTimer") as godot.Timer;
    enemyTimer.start();
    let scoreTimer = this.$("scoreTimer") as godot.Timer;
    scoreTimer.start();
  }

  _on_scoreTimer_timeout() {
    this.score += 1;
  }

  _on_enemyTimer_timeout() {
    let pathFollow = this.$("enemyPath/enemyPathFollow") as godot.PathFollow2D;
    pathFollow.offset = godot.randi();

    let direction =
      pathFollow.rotation +
      godot.PI / 2 +
      godot.rand_range(-godot.PI / 4, godot.PI / 4);

    let enemy = (ENEMY as godot.PackedScene).instance() as godot.RigidBody2D;
    enemy.position = pathFollow.position;
    enemy.rotation = direction;

    let enemyScript = enemy as Enemy;
    enemy.linear_velocity = new godot.Vector2(
      godot.rand_range(enemyScript.minSpeed, enemyScript.maxSpeed),
      0
    ).rotated(direction);

    this.add_child(enemy);
  }

  gameOver() {
    let scoreTimer = this.$("scoreTimer") as godot.Timer;
    scoreTimer.stop();

    let enemyTimer = this.$("enemyTimer") as godot.Timer;
    enemyTimer.stop();
  }

  gameNew() {
    this.score = 0;

    let startPosition = this.$("startPosition") as godot.Position2D;
    let player = this.$("player") as Player;
    player.start(startPosition.position);

    let startTimer = this.$("startTimer") as godot.Timer;
    startTimer.start();
  }
}
