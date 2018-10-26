import EntityManager from './entityManager.js';
import StageData from "./stageData.js";
import Entity from '../Entity/entity.js';
import Wall from '../Entity/wall.js';
import BackEntity from '../Entity/backEntity.js';
import BackGround from '../Entity/backGround.js';
import Signboard from '../Entity/Mover/signboard.js';
import Shop from '../Entity/Mover/shop.js';
import Player from '../Entity/Mover/player.js'
import Enemy1 from '../Entity/Enemy/enemy1.js'
import Enemy2 from '../Entity/Enemy/enemy2.js'
import Enemy3 from '../Entity/Enemy/enemy3.js'
import Enemy4 from '../Entity/Enemy/enemy4.js'
import Enemy5 from '../Entity/Enemy/enemy5.js'
import Enemy6 from '../Entity/Enemy/enemy6.js'
import Goal from '../Entity/Mover/goal.js'
import Game from '../game.js'
import Art from '../art.js'
import Audio from '../audio.js'
import Drawer from '../drawer.js';
import Woodbox from '../Entity/Mover/woodbox.js';
import Needle from '../Entity/Mover/needle.js';
import StageGen from './stageGen.js';
import Pool from './pool.js';
/*マップデータ*/

let wallTileInfo = {
  outer : [52,53,54,60,61,62,68,69,70],
  inner : [67,65,51,49],
  ID : 58,
}
let backTileInfo = {
  outer : [28,29,30,36,37,38,44,45,46],
  inner : [43,41,27,25],
  ID : 34,
}

export default class MapData{
  constructor(){
    this.entityData;
    this.width;
    this.height;
  }

  /*マップデータを読み込む*/
  static Load(stageNo){
    return new Promise((resolve)=>{
      let xhr = new XMLHttpRequest();
      xhr.open('GET','src/resource/map/stage'+stageNo+'.json',true);
      xhr.onload = ()=>{
        this.jsonObj = JSON.parse(xhr.responseText);
        //entityの読み込み
        this.backEntityData = this.jsonObj.layers[1].data;
        this.entityData = this.jsonObj.layers[2].data;
        this.foreEntityData = this.jsonObj.layers[3].data;
        this.foreData = this.jsonObj.layers[4].data;
        //objの読み込み(今は看板だけ)
        this.objData = this.jsonObj.layers[0].objects;
        this.width = this.jsonObj.layers[1].width;
        this.height = this.jsonObj.layers[1].height;
        //Drawerにマップの大きさを渡す
        Drawer.SetMap(this.width,this.height);
        resolve();
      }
      xhr.send(null);
      this.stageNo = stageNo;
    });
  }
  //周囲8マスのステージ壁の有無
  static GetIsAdjacent(layer,x,y,tileInfo){
    /*
     * [0,1,2,
     *  3,4,5,
     *  6,7,8]
     * */
     const adaptiveWallID = tileInfo.ID;//...ステージ壁 
     let adj =  [ 
      (adaptiveWallID == (this[layer][this.width*(y-1) + (x-1)]-1)),
      (adaptiveWallID == (this[layer][this.width*(y-1) + (x+0)]-1)),
      (adaptiveWallID == (this[layer][this.width*(y-1) + (x+1)]-1)),
      (adaptiveWallID == (this[layer][this.width*(y+0) + (x-1)]-1)),
      true,
      (adaptiveWallID == (this[layer][this.width*(y+0) + (x+1)]-1)),
      (adaptiveWallID == (this[layer][this.width*(y+1) + (x-1)]-1)),
      (adaptiveWallID == (this[layer][this.width*(y+1) + (x+0)]-1)),
      (adaptiveWallID == (this[layer][this.width*(y+1) + (x+1)]-1)),
     ];
     if(x == 0){
       adj[0] = true;
       adj[3] = true;
       adj[6] = true;
     }
     if(x == this.width-1){
       adj[2] = true;
       adj[5] = true;
       adj[8] = true;
     }
     if(y == 0){
       adj[0] = true;
       adj[1] = true;
       adj[2] = true;
     }
     if(y == this.height-1){
       adj[6] = true;
       adj[7] = true;
       adj[8] = true;
     }

     return adj;
  }

  static CreateEntityLayer(layer){
    let wallTiletype = this.jsonObj.tilesets[0].tileproperties;
    let entity;
    let ID;//tiledに対応しているID

    for(let y = 0;y<this.height;y++){
      for(let x = 0;x<this.width;x++){
        ID = this[layer][this.width*y + x]-1;
        //tiledのIDがjsonデータより1小さいので引く
        if(ID == -1)continue;//空白はjsonで0なので(引くと)-1となる
        if(!wallTiletype[ID])cl(x + "  " + y)
        let p = {x:16*x,y:16*y};//座標を変換
        switch(wallTiletype[ID].type){
          case TILE.WALL :
            switch(wallTiletype[ID].name){
              case "woodbox" : entity = new Woodbox(p);break;
              case "needle" : entity = new Needle(p,this.WallData(ID,layer,x,y));break;
              default : entity = new Wall(p,this.WallData(ID,layer,x,y));
            }
            break;
          case TILE.BACK :
            entity = new BackEntity(p,this.WallData(ID,layer,x,y));
            switch(layer){
              case "backEntityData" : entity.layer = "BACK";break;
              case "entityData" : entity.layer = "ENTITY";break;
              case "foreData" : entity.layer = "FORE";break;
              case "foreEntityData" : entity.layer = "FOREENTITY";break;
              default :console.warn("れいやーエラー:"+layer);
            }
            break;
          default : 
            console.warn("未実装:" + wallTiletype[ID].type);
        }
        EntityManager.addEntity(entity);
      }
    }
  }

  static CreateObjectLayer(){
    let obj;
    let ID;//tiledに対応しているID
    //objectの生成
    for(let i = 0;i < this.objData.length;i++){
      ID = this.objData[i].gid;
        let p ={ 
          x: this.objData[i].x,
          y: this.objData[i].y -16,//なぜかyだけずれるので引く
        }
        let message;
        switch(ID){
          case 161 :
            obj = new Player(p); 
            obj.SetStatus();
            break;
          case 162 :
            message = this.objData[i].properties;
            obj = new Signboard(p,message,"signboard");
            break;
          case 163 : obj = new Goal(p); break;
          case 164 :
            //直せ
            message = this.objData[i].properties;
            obj = new Signboard(p,message,"shop");
            break;
          case 169 : obj = new Enemy1(p); break;
          case 170 : obj = new Enemy2(p); break;
          case 171 : obj = new Enemy3(p); break;
          case 172 : obj = new Enemy4(p); break;
          case 173 : obj = new Enemy5(p); break;
          case 174 : obj = new Enemy6(p); break;
      }
        EntityManager.addEntity(obj);
    }
  }
  /* state 
   * ENTER : 新しいステージに入った時
   * RESET : 死んでやり直す時
   */
  static async CreateStage(stageNo,state){
    //BGM再生
    if(Audio.PlayingBGM.name!=StageData.StageBGM[stageNo])Audio.PlayBGM(StageData.StageBGM[stageNo],1.0);
    await this.Load(stageNo);
    //背景の生成
    let BG = StageData.StageBackGround[stageNo];
    this.AddBackGround(BG);
    //entityの生成
    this.CreateEntityLayer("backEntityData");
    this.CreateEntityLayer("entityData");
    this.CreateEntityLayer("foreEntityData");
    this.CreateEntityLayer("foreData");
    this.CreateObjectLayer();
      let p;
    if(stageNo >= 1){
      p = CPV(EntityManager.player.pos);
    }else{
      p = {
        x : 240,
        y : 128,
      }
    }
    Drawer.ScrollSet(p);
  }

  /*マップデータを消して作り直す*/
  static RebuildStage(){
    MapData.DeleteStage();
    let state = "RESET";
    MapData.CreateStage(Game.stage,state);
  }

  /*現在開かれているステージを削除*/
  static DeleteStage(){
    while(EntityManager.entityList.length > 0){
      //poolしている物はリストに無いので開放
      switch(EntityManager.entityList[0].name){
        case "bulletblur" :
        case "fire" : 
        case "smoke" :
        case "sonic" : 
        case "flash" : 
        case "missile" :
        case "stone":
          Pool.Remove(EntityManager.entityList[0]);
          break;
        default:
          EntityManager.removeEntity(EntityManager.entityList[0]);
      }
    }
    StageGen.Init();
  }
  static MapToWorldPos(x,y){
    return new Vec2(16*x , 16*y);
  }
  //壁タイルの対応
  //タイルIDを渡すとテクスチャを返す
  static WallData(i,layer,x,y){
    //エイリアス
    let wall = Art.wallPattern;
    let adaptive = Art.wallPattern.edge.adapt;
    let out = Art.wallPattern.edge.out;
    let inner = Art.wallPattern.edge.inner;
    let backOut = Art.wallPattern.edge.back.out;
    let backInner = Art.wallPattern.edge.back.inner;
    let steel = Art.wallPattern.steel;
    let needle = Art.wallPattern.needle;
    //戻り値データ
    let tex;//テクスチャ
    let material = "wall";//材質
    let colType = "wall";//すり抜け床かどうか
    let isBreakable = false;//壊せるか
    switch(i){
      //Bigblock
      case 82 : tex = wall.bigBlock[0];break;
      case 83 : tex = wall.bigBlock[1];break;
      case 90 : tex = wall.bigBlock[2];break;
      case 91 : tex = wall.bigBlock[3];break;
      //block
      case 84 : tex = wall.block;break;
      case 85 : tex = wall.HPBlock;break;
      case 86 : tex = wall.bulletBlock;break;
      //adaptive wall
      case 58 : return this.WallData(this.AdaptMap(layer,x,y,wallTileInfo));break;
      //adaptive wall
      case 34 : return this.WallData(this.AdaptMap(layer,x,y,backTileInfo));break;
      //edge in
      case 49 : tex = inner[0];break;
      case 51 : tex = inner[1];break;
      case 65 : tex = inner[2];break;
      case 67 : tex = inner[3];break;
      //edge out
      case 52:tex = out[0];break;
      case 53:tex = out[1];break;
      case 54:tex = out[2];break;
      case 60:tex = out[3];break;
      case 61:tex = out[4];break;
      case 62:tex = out[5];break;
      case 68:tex = out[6];break;
      case 69:tex = out[7];break;
      case 70:tex = out[8];break;
      //edge in back
      case 25 : tex = backInner[0];break;
      case 27 : tex = backInner[1];break;
      case 41 : tex = backInner[2];break;
      case 43 : tex = backInner[3];break;
      //edge out back
      case 28:tex = backOut[0];break;
      case 29:tex = backOut[1];break;
      case 30:tex = backOut[2];break;
      case 36:tex = backOut[3];break;
      case 37:tex = backOut[4];break;
      case 38:tex = backOut[5];break;
      case 44:tex = backOut[6];break;
      case 45:tex = backOut[7];break;
      case 46:tex = backOut[8];break;
      //steel
      case 72:tex = steel.entity[0];material = "steel";break; 
      case 73:tex = steel.entity[1];material = "steel";break; 
      case 74:tex = steel.entity[2];material = "steel";break; 
      case 75:tex = steel.entity[3];material = "steel";break; 
      case 76:tex = steel.back[0];break;
      case 77:tex = steel.back[1];break;
      case 78:tex = steel.back[2];break;
      case 79:tex = steel.back[3];break;
      //needle
      case 0 : case 1 : case 2 : case 3 :
        tex = needle[i];
        isBreakable = true;
        break;
      case 8 : case 9 : case 10 : case 11 :
        tex = needle[i-4];break;
      //through
      case 96 :
        tex = wall.through[0];
        colType="through";
        material = "steel";
        break;
  }
    return {
      colType : colType,
      material : material,
      texture : tex,
      isBreakable : isBreakable,
    }
  }
  //エッジを自動的にいい感じに対応させるやつ
  //IDが帰ってくる
  static AdaptMap(layer,x,y,tileInfo){
    /* 隣接項
     * 0 1 2
     * 3 4 5 < 4は自分なので冗長であるが入れている
     * 6 7 8
     * */
    let adj = this.GetIsAdjacent(layer,x,y,tileInfo);
    /* 外枠(非背景)のTiled上のID
     * 0 1 2
     * 3 4 5
     * 6 7 8
     * */
    // 外側の辺
    // 上
    if(!adj[1]){
      if(!adj[3]) return tileInfo.outer[0];//左上
      if(!adj[5]) return tileInfo.outer[2];//右上
      else return tileInfo.outer[1];//真上
    }
    // 下
    if(!adj[7]){
      if(!adj[3]) return tileInfo.outer[6]; //左下
      if(!adj[5]) return tileInfo.outer[8]; //右下
      else return  tileInfo.outer[7]; //ました
    }
    //左
    if(!adj[3]) return tileInfo.outer[3];
    //右
    if(!adj[5]) return tileInfo.outer[5];

    /* 内枠(非背景)のTiled上のID
     * 01
     * 23
     * */

    // 内側
    if(adj[1] &&adj[3]&&adj[5] &&adj[7]){
      if(!adj[0]) return tileInfo.inner[0];//左上
      if(!adj[2]) return tileInfo.inner[1];//
      if(!adj[6]) return tileInfo.inner[2];//
      if(!adj[8]) return tileInfo.inner[3];//
      return tileInfo.outer[4]　//中央

    };
    console.error("invalid tile");
  }

  //背景を追加
  static AddBackGround(BG){
    let back;
    let w = 24;
    let h = 16;
    for(let y = 0;y<h;y++){
      for(let x = 0;x<w;x++){
        let tex = Art.wallPattern.backGround[BG];
        let p = {
          x : (x - w/2)*32,
          y : (y - h/2)*32
        }
        EntityManager.addEntity(new BackGround(CPV(p),tex));
      }
    }
  }
}
