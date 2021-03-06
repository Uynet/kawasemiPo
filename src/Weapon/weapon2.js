import Audio from "../audio.js";
import Bullet2 from "../Entity/Bullet/bullet2.js";
import BulletShot from "../Entity/Effect/bulletShot.js";
import Explosion1 from "../Entity/Effect/Explosion/explosion1.js";
import EventManager from "../Event/eventmanager.js";
import QuakeEvent from "../Event/quakeEvent.js";
import Param from "../param.js";
import EntityManager from "../Stage/entityManager.js";
import Weapon from "./weapon.js";

const DIR = {
  UR: "UR",
  UL: "UL",
  DR: "DR",
  DL: "DL",
  R: "R",
  L: "L"
};

export default class Weapon2 extends Weapon {
  constructor() {
    super("laser");
    /*基本情報*/
    this.target;
    this.isTargetOn = false; //照準が発生しているか
    this.lasersight;
    this.isLaserOn = false;
    /*パラメータ*/
    this.param = Param.weapon2;
    this.agi = this.param.agi; //間隔
    this.cost = this.param.cost;
    this.speed = this.param.speed; //弾速
    this.length = this.param.length; //射程距離
    /*オプション*/
    this.isTarget = this.param.isTarget;
    this.isLasersight = this.param.isLasersight;
  }
  Set(player) {
    let arg = player.arg;
    //let p = add(fromPolar(arg, 16), copy(player.pos));
    let p = copy(player.spilit.pos);
    let bullet;
    //再帰的に生成
    p = add(player.spilit.pos, fromPolar(arg, 16));
    bullet = new Bullet2(p, arg, 0);
    EntityManager.addEntity(bullet);
    /* ■ SoundEffect : shot */
    Audio.PlaySE("laserShot", 0.7);
    /* □ Effect : shot */
    EntityManager.addEntity(new BulletShot(copy(p), vec0()));
    EntityManager.addEntity(new Explosion1(copy(p), fromPolar(arg, -12)));
    //反動
    //player.vel.x -= v.x/11;
    //if(player.dir == DIR.DR || player.dir == DIR.DL) player.vel.y = -1.2;
    //振動
    EventManager.eventList.push(new QuakeEvent(27, 0.8));
  }
  Update(player) {
    if (this.isTarget) this.Target(player);
    if (this.isLasersight) this.Lasersight(player);
  }
  Reset() {
    if (this.isTargetOn) EntityManager.removeEntity(this.target);
    if (this.isLasersight) EntityManager.removeEntity(this.lasersight);
    this.Init();
  }
  Option(option, value) {
    switch (option) {
      case "isHorming":
        this.isHorming = value;
        break;
      case "isLasersight":
        this.isLasersight = value;
        break;
      case "isTarget":
        this.isTarget = value;
        break;
      default:
        console.warn(option);
    }
  }
}
