import { signal, tool } from "../decorators";

@tool
export default class Player extends godot.Area2D {
  speed: number = 400;
  screenSize: godot.Vector2;

  @signal
  static readonly OnHited: string;

  _ready() {
    this.screenSize = this.get_viewport_rect().size;
    // this.hide();
  }

  _on_player_body_entered(body: godot.Node) {
    this.hide();

    let collisionShape2D = this.$("CollisionShape2D") as godot.CollisionShape2D;
    collisionShape2D.set_deferred("disabled", true);

    this.emit_signal(Player.OnHited, body);
  }

  _process(delta: number) {
    var velocity = new godot.Vector2();
    if (godot.Input.is_action_pressed("ui_right")) {
      velocity.x += 1;
    }
    if (godot.Input.is_action_pressed("ui_left")) {
      velocity.x -= 1;
    }
    if (godot.Input.is_action_pressed("ui_down")) {
      velocity.y += 1;
    }
    if (godot.Input.is_action_pressed("ui_up")) {
      velocity.y -= 1;
    }

    let animatedSprite = this.$("AnimatedSprite") as godot.AnimatedSprite;
    if (velocity.length() > 0) {
      velocity = velocity.normalized();

      animatedSprite.animation = velocity.x != 0 ? "walk" : "up";
      animatedSprite.play();

      animatedSprite.flip_h = velocity.x < 0;
      animatedSprite.flip_v = velocity.y > 0;
    } else {
      animatedSprite.stop();
    }

    let position = this.position;
    position.x += velocity.x * this.speed * delta;
    position.y += velocity.y * this.speed * delta;

    position.x = godot.clamp(position.x, 0, this.screenSize.x);
    position.y = godot.clamp(position.y, 0, this.screenSize.y);

    this.position = position;
  }

  start(pos: godot.Vector2) {
    this.position = pos;

    let collisionShape2D = this.$("CollisionShape2D") as godot.CollisionShape2D;
    collisionShape2D.disabled = false;
  }
}
