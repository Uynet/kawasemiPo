import Art from '../../art.js';
import EmitTrail from "../AI/emitTrail.js";
import Audio from '../../audio.js';
import Collider from '../../Collision/collider.js';
import Collision from '../../Collision/collision.js';
import Box from '../../Collision/box.js';
import EntityManager from '../../Stage/entityManager.js';
import Entity from '../entity.js';
import BulletHitWall from '../Effect/bulletHitWall.js';
import Bright from '../Effect/bright.js';
import BulletTrail from "../Effect/bulletTrail.js";

let player;
export default class Spilit extends Entity{
  constructor(pos){
    player = EntityManager.player;
    super(pos,VEC0());
    this.type = "MOVER";
    this.name = "spilit";
    this.pattern = Art.enemyPattern.coin;//
    this.pattern = Art.playerPattern.spilit;//
    this.sprite = new PIXI.Sprite(this.pattern[this.spid]);
    this.sprite.position = pos;
    this.layer = "ENTITY";
    this.isUpdater = true;
    this.arg = 0;
    this.addAnimator(true,3,6);
    this.AIList.push(new EmitTrail(this,Bright,8));
  }
  Phisics(){
    player = EntityManager.player;
    let repel = {
      x : -(player.pos.x - this.pos.x),
      y : -(player.pos.y - this.pos.y),
    }
    let absorp = {
      x : -repel.x,
      y : -repel.y,
    }
    let len = length(repel); 
    repel = normalize(repel);
    repel = scala(30/(len*len),repel);
    absorp = normalize(absorp);
    absorp = scala(len*len/50,absorp);

    let f = {
      x:Math.sin(this.frame/17),
      y:Math.cos(this.frame/13),
    }
    f = scala(2,f);
    this.pos = add(this.pos,f);
    this.pos = add(this.pos,repel);
    this.pos = add(this.pos,absorp);
    this.pos = add(this.pos,POV(player.arg,8));
  }
  shot(player){
    player.weapon.shot(player);
  }
  Update(){
    this.arg = Rand(5);
    this.ExecuteAI();
    this.Phisics();
    this.sprite.position = this.pos;
    this.frame++;
  }
}
