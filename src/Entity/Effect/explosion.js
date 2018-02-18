import EFFECT from './effect.js';
import Art from '../../art.js';
import EntityManager from '../../Stage/entityManager.js';
import Util from '../../util.js';

//爆発エフェクト
export default class Explosion extends EFFECT{
  constructor(name,pos,vel){
    if(name == "stone" || name == "smoke"){
      super(pos,vel);
    }else{
      super(pos,{x:0,y:0});
    }
    /*基本情報*/
    this.type = ENTITY.EFFECT;
    this.frame = 0;
    /*スプライト*/
    this.spid = 0;
    this.name = name;
    //閃光,火球,飛散物,煙
    //this.pattern = Art.bulletPattern.explosion[this.name];
    this.pattern = Art.bulletPattern.explosion[this.name];
    this.sprite = Art.SpriteFactory(this.pattern[this.spid]);
    //this.sprite = Art.SpriteFactory(this.pattern);
    this.sprite.position = this.pos;
  }

  Update(){
    //this.sprite.texture = this.pattern[this.spid];
    switch(this.name){
      case "flash" :
      if(this.frame == 4){
        EntityManager.removeEntity(this);
      }
      break;
      case "fire" :
        let a = 10;
        this.sprite.scale.x = 2 - ( a / (this.frame + a)) * ( a / (this.frame + a));
        this.sprite.scale.y = this.sprite.scale.x;
        this.sprite.alpha -= 0.03;
      if(this.frame == 40){
        EntityManager.removeEntity(this);
      }
      break;
      case "stone" :
        //phys
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.vel.x *= 0.98;
        this.vel.y *= 0.98;
        this.vel.y += 0.1;
        this.sprite.alpha -= 0.02;
      if(this.frame == 40){
        EntityManager.removeEntity(this);
      }
      break;
      case "smoke" :
        let a = 10;
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.sprite.scale.x = 2 - ( a / (this.frame + a)) * ( a / (this.frame + a));
        this.sprite.scale.y = this.sprite.scale.x;
        this.sprite.alpha -= 0.03;
      if(this.frame == 40){
        EntityManager.removeEntity(this);
      }
      break;
    }
    this.sprite.position = this.pos;
    this.frame++;
  }
}
