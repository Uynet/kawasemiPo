import Art from '../../art.js';
import Timer from "../../timer.js";
import Collider from '../../Collision/collider.js';
import Collision from '../../Collision/collision.js';
import Bullet4AI from '../AI/bullet4AI.js';
import Bullet from './bullet.js';
import Param from '../../param.js';

//normal bullet
export default class Bullet4 extends Bullet{
  constructor(pos,weapon){
    super(pos,POV(weapon.arg,weapon.speed));
    this.Init(pos,weapon);
  }
 SetParam(){
    this.hp = Param.bullet4.hp;//弾丸のHP 0になると消滅
    this.atkMin = Param.bullet4.atkMin;//攻撃力
    this.atkMax = Param.bullet4.atkMax;//攻撃力
    //this.curve = Param.bullet3.curve;
  }
  Init(pos,weapon){
    /*基本情報*/
    this.name = "bullet4";
    this.arg = weapon.arg;
    this.vi = weapon.speed;
    this.vel = POV(this.arg,this.vi);
    this.isTargetOn = weapon.isTargetOn;
    if(this.isTargetOn) this.targetedEnemy = weapon.target.enemy;
    /*スプライト*/
    this.BasicBulletInit();
    this.sprite.alpha = 0.8;
    this.sprite.blendMode = PIXI.BLEND_MODES.ADD;
    this.SetBoxCollider(4,4);
    this.AIList.push(new Bullet4AI(this));
    this.addAnimator(true,1,4);
    this.SetSize(this.size+Rand(8));
  }
  onAnimationEnd(){
    //nothing to do
  }
}
