import EntityManager from "../../Stage/entityManager.js";
import Pool from "../../Stage/pool.js";
import EFFECT from "./effect.js";

//爆発エフェクト
export default class Explosion2 extends EFFECT {
  constructor(pos, arg) {
    super(pos, VEC0());
    //微妙に左上に寄ってるので中心に
    this.pos = ADV(this.pos, VECN(8));
    this.arg = arg;
    this.vi = 15;
    /*基本情報*/
    this.frame = 0;
    this.isNoSprite = true;
  }
  Bomb() {
    /*stone*/
    for (let i = 0; i < 8; i++) {
      let arg = this.arg + Rand(0.7);
      let vi = this.vi + Rand(8);
      let v = POV(arg, vi);
      let stone = Pool.GetStone(CPV(this.pos), v);
      if (stone !== false) EntityManager.addEntity(stone);
    }
    /*smoke*/
    for (let j = 0; j < 6; j++) {
      let v = {
        x: Rand(4),
        y: Rand(1)
      };
      let smoke = Pool.GetSmoke(CPV(this.pos), v, 1 + Rand(0.2));
      if (smoke !== false) EntityManager.addEntity(smoke);
    }
  }

  Update() {
    //爆発して自分は消える
    this.Bomb();
    EntityManager.removeEntity(this);
  }
}
