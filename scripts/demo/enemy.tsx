export default class Enemy extends godot.RigidBody2D {
  minSpeed: number = 150;
  maxSpeed: number = 300;

  _ready() {
    let animatedSprite = this.$("AnimatedSprite") as godot.AnimatedSprite;
    let animatedTypes = animatedSprite.frames.get_animation_names();
    let index = godot.randi() % animatedTypes.size();
    let animation = animatedTypes.get(index);
    animatedSprite.set_animation(animation);
    animatedSprite.play();
  }

  _on_VisibilityNotifier2D_screen_exited() {
    this.queue_free();
  }
}
