import Art from '../../art.js';
import EntityManager from '../../Stage/entityManager.js';
import Input from '../../input.js';
import Param from '../../param.js';
import Game from '../../game.js';
import BackEntity from '../backEntity.js';
import UIManager from '../../UI/uiManager.js';
import Signpop from '../Effect/signpop.js';
import StagePop from '../../UI/stagePop.js';
import Bright from "../Effect/bright.js";
import BasicAI from "../AI/Basic/basicAI.js";

export default class Shop extends BackEntity{
  constructor(pos,message){
    super(pos,0);
    /*基本情報*/
    this.layer= "ENTITY";
    this.name = "shop";
    this.isUpdater = true;
      /* 固有情報
       * message : 複数のページからなる文章
       * text : 1つのページの文章
       * sentense : 1行の文章
       * font : 1文字
       * */
       //オブジェクトを配列に変換?
    this.message = [];
    for(let l in message){
      this.message.push(message[l]);
    }
    this.page = 0;//現在のページ番号
    this.isRead = false;//会話中かどうか
    /*スプライト*/
    this.pattern = Art.wallPattern.shop;
    this.sprite = Art.CreateSprite(this.pattern[0]);
    this.sprite.position = pos;
    //pop
    let p = copy(this.pos);
    p.y -= 16;
    this.popup = new Signpop(p);
    EntityManager.addEntity(this.popup);
    //AI
    this.addAI(new BasicAI(this));
  }
  Read(){
    this.isRead = true;
    Game.scene.PushSubState("MES");
    UIManager.EnterShop();
  }
  isCanRead(){
    let player = EntityManager.player;
    return (DIST(player.pos,this.pos) <  16 && player.isAlive);
  }
  Bright(){
    if(this.Modulo(8)){
      let trail = new Bright(add(this.pos,Rand2D(16)),Rand2D(0.5));
      trail.addEntity();
    }
  }
  Update(){
    this.ExecuteAI();
    //page : 現在のページ番号
    let player = EntityManager.player;
    //this.Bright();
    if(this.isCanRead()){
        player.isCanRead = true;
      if( Input.isKeyClick(KEY.X)){
        this.Read();
      }
    }
  }
}
