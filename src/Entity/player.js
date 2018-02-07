import Entity from './entity.js'
import Art from '../art.js'
import Collider from '../Collision/collider.js';
import Collision from '../Collision/collision.js';
import Box from '../Collision/Box.js';
import Input from '../input.js';
import EntityManager from '../Stage/entityManager.js';
import Util from '../util.js';
import EventManager from '../Event/eventmanager.js';
import Event from '../Event/event.js';
import StageResetEvent from '../Event/stageResetEvent.js';
import GameOverEvent from '../Event/gameOverEvent.js';
import Drawer from '../drawer.js';
import Game from '../Game.js';
import WeaponManager from '../Weapon/weaponManager.js';
import Timer from '../timer.js';
import UIManager from '../UI/uiManager.js';
import Font from './font.js';

const JUMP_VEL = 7;//ジャンプ力
  const RUN_VEL = 0.5;//はしり速度
const PLAYER_GRAVITY = 0.4;
const PLAYER_HP = 100;
const FLICTION = 0.7;
const POP_PLAYER = -1;
const INV_TIME = 5;//無敵時間
/*アニメーションのインターバル*/
const ANIM_RUN = 3;
const ANIM_WAIT = 7;

const VX_MAX = 3;
const VY_MAX = 7;

let state = {
  WAITING : 0,
  RUNNING  : 1,
  JUMPING : 2,
  FALLING : 3,
  DYING : 4,//死んでから遷移開始するまでの操作不能状態
  DEAD : 5
}
/*フラグと状態が同じものを意味しててキモい*/

export default class Player extends Entity{
  constructor(pos){
    super(pos,{x:0,y:0},{x:0,y:0});
    /*基本情報*/
    this.collider = new Collider(SHAPE.BOX,new Box(pos,16,16));//衝突判定の形状
    this.type = ENTITY.PLAYER;
    this.frame = 0;
    this.frameDead;//死んだ時刻
    this.frameDamaged;//最後に攻撃を食らった時間 無敵時間の計算に必要
    this.e = 0.1;
    /*スプライト*/
    this.pattern = Art.playerPattern;
    this.spid = 0 // spriteIndex 現在のスプライト番号
    this.sprite = Art.SpriteFactory(this.pattern[this.spid]);//現在表示中のスプライト
    this.sprite.position = this.pos;
    /*パラメータ*/
    this.hp = PLAYER_HP;
    this.gravity = PLAYER_GRAVITY;
    this.arg = 0;//狙撃角度 0 - 2π
    /*状態*/
    this.state = state.WAITING;
    this.weapon = WeaponManager.weaponList[0];//選択中の武器のインスタンス
    this.dir = DIR.RIGHT;//向き
    /*フラグ*/
    this.isJump = false;//空中にいるか
    this.isRun = false;//走っているか
    this.isAlive = true;//
    this.isInvincible = false//無敵時間
  }
  /*キー入力による移動*/
  Input(){
    /*ジャンプ*/
    if(Input.isKeyInput(KEY.Z)){
      if(this.isJump == false){
        this.vel.y = -JUMP_VEL;
        this.isJump = true;
        this.state = state.JUMPING;
      }
    }
    /*右向き*/
    if(Input.isKeyInput(KEY.RIGHT)){
      this.state = state.RUNNING;
      this.dir = DIR.RIGHT;
      this.isRun = true;
      this.arg = 0;
      this.acc.x = RUN_VEL;
      /*
      if(!this.isJump){
        this.vel.y = POP_PLAYER;
      }
      */
    }
    /*左向き*/
    if(Input.isKeyInput(KEY.LEFT)){
      this.state = state.RUNNING;
      this.dir = DIR.LEFT;
      this.isRun = true;
      this.arg = Math.PI;
      this.acc.x = -RUN_VEL;
      /*
      if(!this.isJump){
        this.isJump = true;
        this.vel.y = POP_PLAYER;
      }
      */
    }
    /*上向き*/
    if(Input.isKeyInput(KEY.UP)){
      this.dir = DIR.UP;
      this.arg = -Math.PI/2;
    }
    /*下向き*/
    if(Input.isKeyInput(KEY.DOWN)){
      this.dir = DIR.DOWN;
      this.arg = Math.PI/2;
    }
    /*shot*/
    if(Input.isKeyInput(KEY.X)){
      this.weapon.Target(this);
      this.weapon.shot(this);
    }
    /*for debug*/
    if(Input.isKeyInput(KEY.SP)){
        let p = {
          x:this.pos.x,
          y:this.pos.y
        }
        let v = {
          x:Math.random()*2,
          y:-5
        }
        switch(Math.floor(16*Math.random())){
          case 0 :EntityManager.addEntity(new Font(p,v,"あ"));break;
          case 1 :EntityManager.addEntity(new Font(p,v,"い"));break;
          case 2 :EntityManager.addEntity(new Font(p,v,"う"));break;
          case 3 :EntityManager.addEntity(new Font(p,v,"え"));break;
          case 4 :EntityManager.addEntity(new Font(p,v,"お"));break;
          case 5 :EntityManager.addEntity(new Font(p,v,"か"));break;
          case 6 :EntityManager.addEntity(new Font(p,v,"き"));break;
          case 7 :EntityManager.addEntity(new Font(p,v,"く"));break;
          case 8 :EntityManager.addEntity(new Font(p,v,"け"));break;
          case 9 :EntityManager.addEntity(new Font(p,v,"こ"));break;
          case 10 :EntityManager.addEntity(new Font(p,v,"さ"));break;
          case 11 :EntityManager.addEntity(new Font(p,v,"し"));break;
          case 12 :EntityManager.addEntity(new Font(p,v,"す"));break;
          case 13 :EntityManager.addEntity(new Font(p,v,"せ"));break;
          case 14 :EntityManager.addEntity(new Font(p,v,"そ"));break;
          case 15 :EntityManager.addEntity(new Font(p,v,"た"));break;
        }
    }
  }

  /*状態からアニメーションを行う*/
  Animation(){
    switch(this.state){
      case state.WAITING :
        switch(this.dir){
          case DIR.RIGHT :
            this.spid = (Math.floor(Timer.timer/ANIM_WAIT))%4
            this.sprite.texture = this.pattern.waitR[this.spid];
            break;
          case DIR.LEFT :
            this.spid = (Math.floor(Timer.timer/ANIM_WAIT))%4
            this.sprite.texture = this.pattern.waitL[this.spid];
            break;
          case DIR.UP :
            this.spid = (Math.floor(Timer.timer/ANIM_WAIT))%4
            this.sprite.texture = this.pattern.waitU[this.spid];
            break;
            break;
          case DIR.DOWN :
            this.spid = (Math.floor(Timer.timer/ANIM_WAIT))%4
            this.sprite.texture = this.pattern.waitD[this.spid];
            break;
        }
        break;
      case state.JUMPING :
        switch(this.dir){
          case DIR.RIGHT :
            this.spid = (Math.floor(Timer.timer/ANIM_RUN))%4
            this.sprite.texture = this.pattern.jumpR[this.spid];
            break;
          case DIR.LEFT :
            this.spid = (Math.floor(Timer.timer/ANIM_RUN))%4
            this.sprite.texture = this.pattern.jumpL[this.spid];
            break;
          case DIR.UP :
            this.spid = (Math.floor(Timer.timer/ANIM_RUN))%4
            this.sprite.texture = this.pattern.jumpR[this.spid];
            break;
          case DIR.DOWN :
            this.spid = (Math.floor(Timer.timer/ANIM_RUN))%4
            this.sprite.texture = this.pattern.jumpL[this.spid];
            break;
        }
        break;
      case state.RUNNING :
        switch(this.dir){
          case DIR.RIGHT :
            this.spid = (Math.floor(Timer.timer/ANIM_RUN))%6;
            this.sprite.texture = this.pattern.runR[this.spid];
            break;
          case DIR.LEFT :
            this.spid = (Math.floor(Timer.timer/ANIM_RUN))%6;
            this.sprite.texture = this.pattern.runL[this.spid];
            break;
          case DIR.UP :
            this.spid = (Math.floor(Timer.timer/ANIM_RUN))%6;
            this.sprite.texture = this.pattern.runU[this.spid];
            break;
          case DIR.DOWN :
            this.spid = (Math.floor(Timer.timer/ANIM_RUN))%6;
            this.sprite.texture = this.pattern.runD[this.spid];
            break;
        }
        break;
        //死亡
      case state.DYING:
        this.spid = Math.min(7,(Math.floor(Timer.timer/ANIM_RUN))%8);
          this.sprite.texture = this.pattern.dying[this.spid];
        break;
    }
    //this.sprite.texture = this.pattern[this.spid];
  }

  /*武器チェンジ*/
  ChangeWeapon(name){
    WeaponManager.ChangeWeapon(this,name);
  }
  /*ダメージ*/
  /*負の値を入れる*/
  Damage(atk){
    //無敵時間は攻撃を受けない
    if(!this.isInvincible){
      if(this.isAlive){
        this.hp+=atk;
        //ダメージをポップ
        //ここ値渡しにしないとプレイヤーと同じ座標を指してしまう
        let p = {
          x:this.pos.x,
          y:this.pos.y
        }
        let v = {
          x:1*Math.random(),
          y:-3
        }
        //フォントはダメージ数に応じて数字を表示する　
        EntityManager.addEntity(new Font(p,v,-atk));
        this.hp = Math.max(this.hp,0);
        UIManager.HP.Bar();
        //ダメージを受けて一定時間無敵になる
        this.isInvincible = true;
        this.frameDamaged = this.frame;
      }
    }
  }
  /* 衝突判定 */
  collision(){
    for(let l of EntityManager.wallList){
      if(Collision.on(this,l).isHit){
        /* 衝突応答*/
        /*フラグの解除*/
        if(Collision.on(this,l).n.y == -1){
          this.isJump = 0;
        }
        Collision.Resolve(this,l);
        /*速度*/
        //if(Collision.on(this,l).n.x != 0) this.vel.x = 0;
        //if(Collision.on(this,l).n.y != 0) this.vel.y = 0;
        /*押し出し*/
        //while(Collision.on(this,l).isHit){
         // this.pos.x += Collision.on(this,l).n.x/5;
         // this.pos.y += Collision.on(this,l).n.y/5;
        //}
        /*note : now isHit == false*/
      }
    }
  }
  Physics(){
    this.pos.x += this.vel.x; 
    this.pos.y += this.vel.y; 
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.vel.y += this.gravity;
    //最大速度制限:
    if(this.vel.x > VX_MAX)this.vel.x = VX_MAX;
    if(this.vel.x < -VX_MAX)this.vel.x = -VX_MAX;
    if(this.vel.y > VY_MAX)this.vel.y = VY_MAX;
    if(this.vel.y < -VY_MAX)this.vel.y = -VY_MAX;
    /*摩擦
     * 地面にいる&&入力がない場合のみ有向*/
    if(this.state == state.WAITING){
      this.vel.x *= FLICTION;
    }
    this.acc.x = 0;

    if(this.vel.y > 1){
      this.state = state.FALLING;
    }
  }

  Update(){
      if(this.isAlive){
        this.state = state.WAITING; //何も入力がなければWAITINGとみなされる
          this.isRun = false;
        this.Input();//入力
        if(this.isJump){
          this.state = state.JUMPING;
        }
        this.Physics();//物理
      }
    this.collision();//衝突
    this.Animation();//状態から画像を更新
    Drawer.ScrollOn(this.pos);

    /*observer*/
    if(this.hp <= 0){
      //死亡開始時に一回だけ呼ばれる部分
      if(this.isAlive){
        this.frameDead = this.frame;
        this.isDying = true;
        this.isAlive = false;
      }
      this.state = state.DYING;
    }
    //死亡中
    if(this.isDying){       //まだ死んでない  
      if(this.frame - this.frameDead < 50){
        this.isDying = true;
      }else{
        //完全に死んだ
        //完全死亡時に一回だけ呼ばれる部分
        if(this.isDying){
        //this.state = state.DEAD
          let g = new GameOverEvent();
          EventManager.eventList.push(g);
        }
        this.isDying = false;
      }
    }
    //無敵時間の有向時間
      if(this.frame - this.frameDamaged > INV_TIME){
        this.isInvincible = false;
      }
    //
    this.sprite.position = this.pos;
    this.frame++;
  }
}

