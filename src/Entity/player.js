import Mover from './mover.js'
import Art from '../art.js'
import CollisionShape from '../Collision/collisionShape.js';
import Collision from '../Collision/collision.js';
import Circle from '../Collision/Circle.js';
import Box from '../Collision/Box.js';
import Input from '../input.js';
import EntityManager from '../Stage/entityManager.js';
import Util from '../util.js';
import EventManager from '../Event/eventmanager.js';
import Event from '../Event/event.js';
import StageResetEvent from '../Event/stageResetEvent.js';
import Teki1 from './teki1.js';
import Bullet from './bullet.js';
import Drawer from '../drawer.js';
import Game from '../Game.js';
import Weapon from '../Weapon/weapon.js';
import WeaponManager from '../Weapon/weaponManager.js';

const JUMP_VEL = 7;//ジャンプ速度
  const RUN_VEL = 0.5;//はしり速度
const PLAYER_GRAVITY = 0.3;
const PLAYER_HP = 10;
const FRICTION = 0.7;
const POP_PLAYER = -1;

const VX_MAX = 3;
const VY_MAX = 3;

let rect = new PIXI.Rectangle(0,0,16,16);
/*TODO フラグの管理*/
export default class Player extends Mover{
  constructor(pos){
    super(pos,VEC0,{x:0,y:0});
    this.type = ENTITY.PLAYER;
    this.texture = Art.playerTexture;
    this.texture.frame = rect;
    this.sprite = Art.SpriteFactory(this.texture);
    this.sprite.position = pos;
    this.collisionShape = new CollisionShape(SHAPE.BOX,new Box(pos,16,16));//衝突判定の形状
    this.hp = PLAYER_HP;
    this.gravity = PLAYER_GRAVITY;
    this.arg = 0;//狙撃角度 0 - 2π
    this.flagAlive = true;
    this.flagJump = false;//空中にいる時1
      this.weapon = WeaponManager.weaponList[0];//選択中の武器のインスタンス
      this.dir = DIR.RIGHT;//向き
  }

  /*パターン画像の左上から何番目をクリップするか選択*/
  pattern(i){
    rect.x = i*16;
    this.texture.frame = rect;
    return this.texture;
  }

  /*キー入力による移動*/
  Input(){
    /*ジャンプ*/
    if(Input.isKeyInput(KEY.Z)){
      if(this.flagJump == false){
        this.vel.y = -JUMP_VEL;
        this.flagJump = true;
      }
    }
    /*上向き*/
    if(Input.isKeyInput(KEY.UP)){
      this.dir = DIR.UP;
      this.arg = -Math.PI/2;
      this.pattern(2);
    }
    /*左向き*/
    if(Input.isKeyInput(KEY.LEFT)){
      this.dir = DIR.LEFT;
      this.arg = Math.PI;
      this.pattern(1);
      this.acc.x = -RUN_VEL;
      if(!this.flagJump){
        this.flagJump = true;
        this.vel.y = POP_PLAYER;
      }
    }
    /*右向き*/
    if(Input.isKeyInput(KEY.RIGHT)){
      this.dir = DIR.RIGHT;
      this.arg = 0;
      this.texture = this.pattern(0);
      this.acc.x = RUN_VEL;
      if(!this.flagJump){
        this.flagJump = true;
        this.vel.y = POP_PLAYER;
      }
    }
    /*下向き*/
    if(Input.isKeyInput(KEY.DOWN)){
      this.dir = DIR.RIGHT;
      this.arg = Math.PI/2;
      this.texture = this.pattern(3);
    }
    /*shot*/
    if(Input.isKeyClick(KEY.X)){
      this.weapon.shot(this);
    }
    /*for debug*/
    if(Input.isKeyClick(KEY.SP)){
      this.ChangeWeapon("2");
    }
  }

  ChangeWeapon(name){
    WeaponManager.ChangeWeapon(this,name);
  }

  /* 衝突判定 */
  collision(){
    /*TODO リスト分割 */
    let EntityList = EntityManager.entityList;

    for(let l of EntityList){
      switch(l.type){
        case ENTITY.WALL :
          /*衝突判定*/
          if(Collision.on(this,l).isHit){
            /* 衝突応答*/
            /*TODO Colクラスに核*/

            /*フラグの解除*/
            if(Collision.on(this,l).n.y == -1){
              this.flagJump = 0;
            }
            /*速度*/
            if(Collision.on(this,l).n.x != 0) this.vel.x = 0;
            if(Collision.on(this,l).n.y != 0) this.vel.y = 0;
            /*押し出し*/
            while(Collision.on(this,l).isHit){
              this.pos.x += Collision.on(this,l).n.x/5;
              this.pos.y += Collision.on(this,l).n.y/5;
            }
            /*note : now isHit == false*/
          }
          break;
      }
    }
  }
  Physics(){
    this.pos.x += this.vel.x; 
    this.pos.y += this.vel.y; 
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.vel.y += this.gravity;
    if(this.vel.x > VX_MAX)this.vel.x = VX_MAX;
    if(this.vel.x < -VX_MAX)this.vel.x = -VX_MAX;
    if(this.flagJump == false){
      this.vel.x *= FRICTION;
    }
    this.acc.x = 0;

  }

  Update(){
    this.Input();//入力
    this.Physics();//物理
    this.collision();//衝突
    Drawer.ScrollOnPlayer(this);

    /*observer*/
    if(this.hp <= 9){
      let restartEvent = new StageResetEvent(this);
      EventManager.PushEvent(restartEvent);
    }

    this.sprite.position = this.pos;
  }
}
