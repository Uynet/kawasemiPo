import Enemy from './Enemy.js';
import Art from '../art.js';
import Collider from '../Collision/collider.js';
import Collision from '../Collision/collision.js';
import Box from '../Collision/box.js';
import EntityManager from '../Stage/entityManager.js';
import Enemy2AI from './AI/enemy2AI.js';
import UIManager from '../UI/uiManager.js'
import Timer from '../timer.js';
import FontEffect from './Effect/fontEffect.js';
const ATK_ENEMY2 = 10;

let EntityList = EntityManager.entityList;

export default class Enemy2 extends Enemy{
  constructor(pos){
    super(pos,{x:0,y:0},{x:0,y:0});
    /*基本情報*/
    this.collider = new Collider(SHAPE.BOX,new Box(pos,16,16));//衝突判定の形状
    this.frame = 0;
    /*スプライト*/
    this.pattern = Art.enemyPattern.enemy1;
    this.spid = 0; //spriteIndex 現在のスプライト番号
    this.sprite = Art.SpriteFactory(this.pattern[this.spid]);//現在表示中のスプライト
    this.sprite.position = this.pos;
    /*パラメータ*/
    this.addAI(new Enemy2AI(this));
    this.atkMax = ATK_ENEMY2;
    this.hp = 10;
    this.gravity = 0.1;
    /*フラグ*/
    this.isJump = false;
    this.isAlive = true;
    /*床の親子関係*/
    this.over;//上に乗ってるやつ
    this.under;//下にある床
  }
  //自分がダメージを食らう
  Damage(atkMax){
    this.hp += atkMax;
    //ダメージをポップ
    EntityManager.addEntity(new FontEffect(this.pos,-atkMax+"","enemy"));
  }
  Collision(){
    /*衝突判定*/
    for(let l of EntityManager.wallList){
      if(l == this) continue;
      /*衝突判定*/
      let c = Collision.on(this,l);
      if(c.isHit){
        /* 衝突応答*/

        /*速度*/
        if(c.n.x != 0) this.vel.x = 0;
        //地面との衝突
        if(c.n.y == -1){ 
          this.isJump = false;
          this.vel.y = Math.min(0,this.vel.y * -0.3);
        }
        //天井との衝突
        if(c.n.y == 1 ){
          this.vel.y = Math.max(0,this.vel.y * -0.3)
        }
        /*押し出し*/
        this.pos.x += c.n.x * c.depth;
        this.pos.y += c.n.y * c.depth;
        /*note : now isHit == false*/
      }
    }
    for(let i=0;i<EntityManager.enemyList.length;i++){
      let l = EntityManager.enemyList[i];
      let c = Collision.on(this,l);
      //これないと自分と衝突判定してバグ
      if(i == EntityManager.enemyList.indexOf(this))continue;
      /*衝突判定*/
      if(c.isHit){
        /* 衝突応答*/

        /*速度*/
        if(c.n.x != 0) this.vel.x = 0;
        //地面との衝突
        if(c.n.y == -1){ 
          this.isJump = false;
          this.vel.y = Math.min(1,this.vel.y * -0.3);
        }
        //天井との衝突
        if(c.n.y == 1 ){
          this.vel.y = Math.max(1,this.vel.y * -0.3)
        }
        /*押し出し*/
        let l = EntityManager.enemyList[i];
        this.pos.x += c.n.x * c.depth/2;
        this.pos.y += c.n.y * c.depth/2;
        /*note : now isHit == false*/
      }
    }
  }
  //プレイヤーにダメージを与える
  Hurt(){
    let player = EntityManager.player; 
    let c = Collision.on(this,player);
    if(c.isHit && c.n.y != 1){
      //ダメージ
      let damage = this.atkMax  +  Math.floor(-this.vel.y * Math.random());
      EntityManager.player.Damage(-damage);
    }
  }


  Physics(){
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.acc.y = this.gravity;
  }

  Update(){
    for (let AI of this.AIList){
      AI.Do();
    }
    this.Collision();
    this.Physics();
    this.Hurt();
    this.sprite.position = this.pos;
    //アニメーション
    this.spid = Math.floor(this.frame/2)%4;
    this.sprite.texture = this.pattern[this.spid];
    this.frame++;
    //observer
    if(this.hp<=0){
      this.isAlive = false
      EntityManager.removeEntity(this);
    }
    this.frame++;
  }
}