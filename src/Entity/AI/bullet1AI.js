import EntityManager from '../../Stage/entityManager.js';
import Collision from '../../Collision/collision.js';
import Util from '../../util.js';

export default class Bullet1AI{
  /*bulletの参照を受け取り関数を実行する*/
  constructor(bullet){
    this.bullet = bullet;
  }
  Phisics(){
    this.bullet.pos.x += this.bullet.vel.x;
    this.bullet.pos.y += this.bullet.vel.y;
  }
  /* 衝突判定 */
  collision(){
    /*TODO リスト分割 */
    let EntityList = EntityManager.entityList;

    for(let l of EntityList){
      switch(l.type){
        case ENTITY.ENEMY :
          /*衝突判定*/
          if(Collision.on(this.bullet,l).isHit){
            l.hp-=this.bullet.atk;
            this.bullet.hp = 0;
          }
          break;
        case ENTITY.WALL :
          /*衝突判定*/
          if(Collision.on(this.bullet,l).isHit){
            this.bullet.hp = 0;
          }
          break;
      }
    }
  }

  Do(){
    this.collision();
    this.Phisics();
    /*observer*/
    if(this.bullet.hp<=0){
      EntityManager.removeEntity(this.bullet);
    }
    //飛行距離判定
    if(Util.distance(this.bullet.pos , this.bullet.launchedPos) > this.bullet.length){
      EntityManager.removeEntity(this.bullet);
    }
    this.bullet.sprite.position = this.bullet.pos;
  }
}