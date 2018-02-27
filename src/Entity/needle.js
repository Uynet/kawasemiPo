import Art from '../art.js';
import Collider from '../Collision/collider.js';
import Collision from '../Collision/collision.js';
import Box from '../Collision/box.js';
import EntityManager from '../Stage/entityManager.js';
import UIManager from '../UI/uiManager.js'
import Timer from '../timer.js';
import FontEffect from './Effect/fontEffect.js';
import Wall from './wall.js';
import BackEntity from './backEntity.js';
import BulletShot from './Effect/bulletShot.js';
import Param from '../param.js';

let EntityList = EntityManager.entityList;

//トゲ
export default class Needle extends BackEntity{
  constructor(pos,tex){
    super(pos,tex);
    /*基本情報*/
    this.collider = new Collider(SHAPE.BOX,new Box({x:pos.x+4,y:pos.y+12},8,8));//衝突判定の形状
    this.name = "needle";
    this.layer = "ENTITY";
    this.isUpdater  =true;
    /*スプライト*/
    this.pattern = Art.wallPattern.steel.entity;
    this.spid = 3; //spriteIndex 現在のスプライト番号
    //this.pattern = Art.wallPattern.needle;
    //this.tex = this.pattern[0];
    this.sprite = Art.SpriteFactory(this.tex);//現在表示中のスプライト
    this.sprite.position = this.pos;
    /*パラメータ*/
    this.hp = 1;
    this.atkMax = 4;
    this.atkMin = 1;
    /*フラグ*/
    this.isAlive = true;
  }
  //自分がダメージを食らう
  Damage(atkMax){
    this.hp += atkMax;
  }

  //プレイヤーにダメージ
  Hurt(){
    let player = EntityManager.player; 
    let c = Collision.on(this,player);
    if(c.isHit){
      //ダメージ
      //速度が大きい程ダメージ大きい
      let v = player.vel.x * player.vel.x + player.vel.y * player.vel.y;
      if(v >1){
        let damage = Math.floor(v);
        EntityManager.player.Damage(-damage);
      }
      //反動
      //player.vel.y = -6 * c.n.y;
      //player.vel.x = -6 * c.n.x; 
    }
  }

  Update(){
    this.sprite.position = this.pos;

    this.Hurt()
    /*observer*/
    if(this.hp<=0){
      EntityManager.removeEntity(this);
      let p = CPV(this.pos);
      EntityManager.addEntity(new BulletShot(p,VEC0()));
    }
  }
}
