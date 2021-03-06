import Audio from "../audio.js";
import FontEffect from "../Entity/Effect/fontEffect.js";
import Lasersight from "../Entity/Effect/lasersight.js";
import Target from "../Entity/Effect/target.js";
import EntityManager from "../Stage/entityManager.js";
import UIManager from "../UI/uiManager.js";

const DIR = {
  UR: "UR",
  UL: "UL",
  DR: "DR",
  DL: "DL",
  R: "R",
  L: "L"
};

export default class Weapon {
  /* 
   * ammunition : 弾薬数 
  /* agi : agility*/
  constructor(name) {
    this.name = name;
    /*基本情報*/
    this.target = null;
    this.isTargetOn = false; //照準が発生しているか
    this.lasersight;
    this.isLaserOn = false;
    this.arg = 0;
  }
  Init() {
    this.isTargetOn = false;
    this.isLaserOn = false;
    this.target = null; //これ大丈夫か??
  }
  shot(player) {
    //最後に撃ってからframeまで停止
    if (player.frame - player.frameShot > this.agi) {
      const bulletGauge = UIManager.find("BULLET")[0];
      bulletGauge.Shot();
      bulletGauge.setState("value", player.bullet);

      player.spilit.OnShot();
      //shot時刻
      player.frameShot = player.frame;
      //playerの弾薬が残っていなければ打てない
      if (player.bullet < this.cost) {
        EntityManager.addEntity(new FontEffect(player.pos, "たまぎれ", "pop"));
        Audio.PlaySE("empty");
      } else {
        //弾薬消費
        player.bullet -= this.cost;
        player.bullet = Math.max(0, player.bullet);

        this.arg = player.arg;
        this.Set(player);
      }
    }
  }
  //敵が視界に入っているか
  isSeen(player, enemy) {
    return (
      ((player.dir == DIR.UR || player.dir == DIR.UL) &&
        (player.pos.y - enemy.pos.y) / Math.abs(player.pos.x - enemy.pos.x) >
          1) ||
      ((player.dir == DIR.DR || player.dir == DIR.DL) &&
        (player.pos.y - enemy.pos.y) / Math.abs(player.pos.x - enemy.pos.x) <
          -1) ||
      (player.dir == DIR.R &&
        (player.pos.x - enemy.pos.x) / Math.abs(player.pos.y - enemy.pos.y) <
          -1) ||
      (player.dir == DIR.L &&
        (player.pos.x - enemy.pos.x) / Math.abs(player.pos.y - enemy.pos.y) > 1)
    );
  }
  Target(player) {
    /*とりあえず全探索*/
    for (let l of EntityManager.enemyList) {
      //既にロックオンされている敵が射程外に出たら解除
      if (this.isTargetOn && l == this.target.enemy) {
        if (
          DIST_C(l.pos, player.pos) < this.length &&
          this.isSeen(player, l) //各方向+-45度まで許容
        )
          continue;
        this.target.Delete();
        this.isTargetOn = false;
        continue;
      }
      //射程距離以内かつ視界
      if (DIST_C(l.pos, player.pos) < this.length && this.isSeen(player, l)) {
        //既にロックオンされている敵より近ければ
        if (
          !this.isTargetOn ||
          DIST_C(l.pos, player.pos) + 1 < DIST_C(this.target.pos, player.pos)
        ) {
          //今のロック先を解除して
          if (this.isTargetOn) {
            this.target.Delete();
            this.isTargetOn = false;
          }
          //targetを追加する
          this.target = new Target(l);
          this.target.addEntity();
          this.isTargetOn = true;
        }
      }
    }
    if (this.isTargetOn == true) {
      //lockしていた敵が視界から消えたら消去
      if (!this.target.enemy.isAlive) {
        this.target.Delete();
        this.isTargetOn = false;
      } else {
        //方向を指定
        player.toArg = Math.atan(
          (this.target.ofsetPos.y - (player.pos.y + player.size / 2)) /
            (this.target.ofsetPos.x - (player.pos.x + player.size / 2))
        );
        if (player.pos.x + player.size / 2 > this.target.ofsetPos.x)
          player.toArg += Math.PI;
      }
    }
  }
  //レーザーサイト
  Lasersight(player, weapon) {
    if (!this.isLaserOn) {
      let effect;
      let p = copy(add(player.spilit.pos, fromPolar(player.toArg, 16)));
      effect = new Lasersight(p, player.toArg);
      EntityManager.addEntity(effect);
      this.lasersight = effect;
      this.isLaserOn = true;
    } else {
      this.lasersight.Rotate(player, this);
    }
  }
  Reset() {
    if (this.isTargetOn) this.target.Delete();
    if (this.isLasersight) this.lasersight.Delete();
    this.Init();
  }
}
