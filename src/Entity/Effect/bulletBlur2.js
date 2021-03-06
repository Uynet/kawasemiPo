import Art from "../../art.js";
import EntityManager from "../../Stage/entityManager.js";
import EFFECT from "./effect.js";

/*bullet3残像*/
export default class BulletBlur2 extends EFFECT {
  constructor(pos, vel) {
    super(pos, vel);
    this.Init(pos, vel);
  }
  Init(pos, vel) {
    /*基本情報*/
    this.name = "bulletblur2";
    this.frame = 0;
    this.isAlive = true; //消えたらfalse
    /*スプライト*/
    this.spid = 0; //12~15
    this.pattern = Art.bulletPattern.blur2;
    this.sprite = Art.SpriteFactory(this.pattern[this.spid]);
    this.sprite.anchor.set(0.5);
    this.sprite.scale = VECN(Rand(0.5) + 1);
    this.sprite.position = ADV(this.pos, VECN(8));
    this.sprite.blendMode = PIXI.BLEND_MODES.ADD;
  }

  Physics() {
    this.pos = ADV(this.pos, this.vel);
    this.vel = MLV(this.vel, VECN(0.9));
  }

  Update() {
    if (this.isAlive) {
      this.sprite.scale = ADV(this.sprite.scale, VECN(-this.frame / 128));
      this.Physics();
      this.sprite.position = ADV(this.pos.x, VECN(8));
      this.sprite.texture = this.pattern[this.spid];
      this.spid = Math.floor(this.frame / 4) % 4;
      this.sprite.alpha *= 0.94;
      if (this.frame >= 16) {
        //消える時に一回だけ呼ばれる
        if (this.isAlive) {
          EntityManager.removeEntity(this);
          this.isAlive = false;
        }
      }
      this.sprite.position = ADV(this.pos, VECN(8));
      this.frame++;
    }
  }
}
