import Art from "../../art.js";
import Audio from "../../audio.js";
import Box from "../../Collision/box.js";
import Collider from "../../Collision/collider.js";
import EntityManager from "../../Stage/entityManager.js";
import BlockDebris from "../Effect/blockDebris.js";
import BulletShot from "../Effect/bulletShot.js";
import Wall from "../wall.js";

//壊せる木箱
export default class WoodBox extends Wall {
  constructor(pos) {
    super(pos, Art.enemyPattern.woodbox[0]);
    /*基本情報*/
    this.collider = new Collider(SHAPE.BOX, new Box(pos, 16, 16)); //衝突判定の形状
    this.type = "WALL";
    this.name = "woodbox";
    this.isBreakable = true; //破壊可能
    this.isUpdater = true;
    this.colType = "wall";
    this.material = "wood";
    /*スプライト*/
    this.pattern = Art.wallPattern.steel.entity;
    this.spid = 3; //spriteIndex 現在のスプライト番号
    this.sprite = Art.Sprite(this.pattern[this.spid]); //現在表示中のスプライト
    this.sprite.position = this.pos;
    /*パラメータ*/
    this.hp = 1;
    /*フラグ*/
    this.isAlive = true;
  }
  //自分がダメージを食らう
  Damage(atkMax) {
    this.hp += atkMax;
    Audio.PlaySE("blockBreak");
  }

  OnDying() {
    this.Delete();
    let p = copy(this.pos);
    EntityManager.addEntity(new BulletShot(p, vec0()));
    let v;
    for (let i = 0; i < 2; i++) {
      v = {
        x: Rand(1) + (2 * i - 1), //←と→に飛ばす
        y: -1 - Rand(3) / 5
      };
      EntityManager.addEntity(new BlockDebris(p, v));
    }
  }
  Update() {
    this.sprite.position = this.pos;

    if (this.hp <= 0) {
      this.OnDying();
    }
  }
}
