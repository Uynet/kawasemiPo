import Enemy from './enemy.js';
import EFFECT from './effect.js';
import Art from '../art.js';
import EntityManager from '../Stage/entityManager.js';
import Util from '../util.js';

/*Targetクラス*/
export default class Target extends EFFECT{
  constructor(enemy){
    super(enemy.pos,{x:0,y:0});
    /*基本情報*/
    this.type = ENTITY.EFFECT;
    this.frame = 0;
    /*スプライト*/
    this.tex = Art.bulletPattern[3];
    this.sprite = Art.SpriteFactory(this.tex);
    this.sprite.position = this.pos;
    /*パラメータ*/
    this.enemy = enemy;//ロックしているenemyの情報
  }

  Update(){
    //これいる？
    this.sprite.anchor.set(0.5);
    this.sprite.rotation = this.frame/50;
    //シュッてなるやつ
    //最初一瞬ゼロ除算してて怖い
    this.sprite.scale.x = 1.5 + 1.5/this.frame;
    this.sprite.scale.y = 1.5 + 1.5/this.frame;
    this.sprite.position = {x:this.pos.x+8,y:this.pos.y+8};
    this.frame++;
  }
}
