import Bullet from '../Entity/bullet.js';
import EntityManager from '../Stage/entityManager.js';
import Util from '../util.js';
import Target from '../Entity/Effect/target.js';


const DIR = {
  UR : "UR",
  UL : "UL",
  DR : "DR",
  DL : "DL",
  R : "R",
  L : "L",
};

const SEEN = 2;

export default class Weapon{
  /* 
   * ammunition : 弾薬数 
  /* agi : agility*/
  constructor(name){
    this.name = name;
    /*基本情報*/
    this.target = null;
    this.isTargetOn = false;//照準が発生しているか
    this.lasersight;
    this.isLaserOn = false;
    this.arg = 0;
  }
  shot(player){ }
  //敵が視界に入っているか
  isSeen(player,enemy){
    return (player.dir == DIR.UR || player.dir ==  DIR.UL) && (player.pos.y-enemy.pos.y)/Math.abs((player.pos.x-enemy.pos.x)) > 1
      || (player.dir == DIR.DR || player.dir == DIR.DL) && (player.pos.y-enemy.pos.y)/Math.abs((player.pos.x-enemy.pos.x)) <-1
        || player.dir == DIR.R && (player.pos.x-enemy.pos.x)/Math.abs((player.pos.y-enemy.pos.y)) <-1
          || player.dir == DIR.L && (player.pos.x-enemy.pos.x)/Math.abs((player.pos.y-enemy.pos.y)) >1
  }
  Target(player){
    /*とりあえず全探索*/
    for(let l of EntityManager.enemyList){
      //既にロックオンされている敵が射程外に出たら解除
      if(this.isTargetOn &&
        l == this.target.enemy){
        if(Util.distance(l.pos, player.pos) < this.length
          //各方向+-45度まで許容
          && this.isSeen(player,l)
        ){
          continue;
        }
        EntityManager.removeEntity(this.target);
        this.isTargetOn = false;
        continue;
      }
      //射程距離以内かつ視界
      if(Util.distance(l.pos, player.pos) < this.length && this.isSeen(player,l)
      ){
        //既にロックオンされている敵より近ければ
        if(!this.isTargetOn ||
          Util.distance(l.pos , player.pos) < Util.distance(this.target.pos,player.pos)){
          //今のロック先を解除して
          if(this.isTargetOn){
            EntityManager.removeEntity(this.target);
            this.isTargetOn = false;
          }
          //targetを追加する
          this.target = new Target(l);
          EntityManager.addEntity(this.target);
          this.isTargetOn = true;
        }
      }
    }
    if(this.isTargetOn == true){
      //lockしていた敵が視界から消えたら消去
      if(!this.target.enemy.isAlive){
        EntityManager.removeEntity(this.target);
        this.isTargetOn = false;
      }else{
        //方向を指定
        player.arg = Math.atan((this.target.pos.y-player.pos.y)/(this.target.pos.x-player.pos.x));
        if(player.pos.x > this.target.pos.x ) player.arg += Math.PI;
      }
    }
  }
  //レーザーサイト
  Lasersight(player,weapon){
    if(!this.isLaserOn){
      let effect;
      let p = CPV(player.pos);
      effect = new Lasersight(p,player.arg);
      EntityManager.addEntity(effect);
      this.lasersight = effect;
      this.isLaserOn = true;
    }else{
      this.lasersight.Rotate(player,this);
    }
  }


}
