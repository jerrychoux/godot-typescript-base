export default class Player extends godot.Area2D {
  speed: number = 400;
  screenSize: godot.Vector2;

  _ready() {
    this.screenSize = this.get_viewport_rect().size;
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
}
