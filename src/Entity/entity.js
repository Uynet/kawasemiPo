import Collider from '../Collision/collider.js';
import Box from '../Collision/box.js';

export default class Entity{
  constructor(pos,vel){
    /*phys*/
    this.pos = pos;
    this.vel = vel;
    this.acc = VEC0();
    this.gravity;
    this.size = 16;
    //this.e = 0.9;
    /*standard*/
    this.frame = 0;
    this.type = "MOVER";//最も深い階層に書いたもので上書きされる
    //this.collider;
    //this.isUpdater = true;    
    //this.isMultiple;
    /*sprite*/
    //this.sprite;
    //this.container;
    /*未実装*/
    this.layer;
    /* Other */
  }
  /*common*/
  Physics(){};
  Collision(){};
  Update(){};
  Set(param , value){
    this[param] = value;
  }
  SetSize(size){
    this.size = size;
    this.sprite.scale.set(this.size/16);
    this.collider = new Collider(SHAPE.BOX,new Box(this.pos,this.size,this.size));//衝突判定の形状
  }
  AddForce(f){
    this.force.x = f.x;
    this.force.y = f.y;
  }
  ExecuteAI(){
    for (let AI of this.AIList){
      AI.Do();
    }
  }
  /*Hurt()*/
}


