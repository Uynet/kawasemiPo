import EntityManager from './entityManager.js'
import Entity from '../Entity/entity.js'
import Wall from '../Entity/wall.js'
import Background from '../Entity/background.js';
import Signboard from '../Entity/signboard.js';
import Player from '../Entity/player.js'
import Enemy1 from '../Entity/enemy1.js'
import Goal from '../Entity/goal.js'
import Game from '../Game.js'
import Art from '../art.js'
import Drawer from '../drawer.js';
import WeaponManager from '../Weapon/weaponManager.js';
import Woodbox from '../Entity/woodbox.js';
import Needle from '../Entity/needle.js';
/*マップデータ*/
export default class MapData{
  constructor(){
    this.stageNo;
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
        this.entityData = this.jsonObj.layers[0].data;
        //objの読み込み(今は看板だけ)
        this.objData = this.jsonObj.layers[1].objects;
        this.width = this.jsonObj.layers[0].width;
        this.height = this.jsonObj.layers[0].height;
        resolve();
      }
      xhr.send(null);
      this.stageNo = stageNo;
    });
  }

  static async CreateStage(stageNo){
    await this.Load(stageNo);

    //entityの生成
    /*タイルに割り当てるtype
     * 1 : 壁
     * 2 : 背景*/
    let wallTiletype = this.jsonObj.tilesets[0].tileproperties;
    let moverTiletype = this.jsonObj.tilesets[1].tileproperties;
    let entity;
    let ID;//tiledに対応漬けられているID

    for(let y = 0;y<this.height;y++){
      for(let x = 0;x<this.width;x++){
        ID = this.entityData[this.width*y + x]-1;
        //tiledのIDがjsonデータより1小さいので引く
        if(ID == -1)continue;//空白はjsonで0なので(引くと)-1となる
        switch(wallTiletype[ID].type){
          case TILE.WALL :
            //直せ
            if(wallTiletype[ID].name == "woodbox"){
              entity = new Woodbox({x:16*x,y:16*y});
            }else{
              entity = new Wall({x:16*x,y:16*y},MapData.WallTile(ID));
            }
            EntityManager.addEntity(entity);
            break;
          case TILE.BACK :
            entity = new Background({x:16*x,y:16*y},MapData.WallTile(ID));
            EntityManager.addEntity(entity); break;
          case TILE.SIGN : EntityManager.addEntity(new Signboard({x:16*x,y:16*y})); break;
          case TILE.GOAL : EntityManager.addEntity(new Goal({x:16*x,y:16*y})); break;
          case TILE.NEEDLE :
            entity = new Needle({x:16*x,y:16*y},MapData.WallTile(ID));
            EntityManager.addEntity(entity);
            break;
          default : 
            console.warn("タイルセットに未実装のチップが使用されています ID : " + wallTiletype[ID].type);
        }
      }
    }
    let obj;
    //objectの生成
    for(let i = 0;i < this.objData.length;i++){
      ID = this.objData[i].gid;
        let objx = this.objData[i].x;
        let objy = this.objData[i].y -16 ;//なぜかyだけずれるので引く
        let p = {x:objx , y:objy};
        switch(ID){
          case 161 :
            obj = new Player(p);
            EntityManager.addEntity(obj);
            break;
          case 162 :
            let text = this.objData[i].properties.text;
            obj = new Signboard(p,text);
            EntityManager.addEntity(obj);
            break;
          case 169 :
            obj = new Enemy1(p);
            EntityManager.addEntity(obj);
            break;
          case 170 :
            obj = new Enemy1(p);
            EntityManager.addEntity(obj);
            break;
      }
    }
    Drawer.ScrollSet(EntityManager.player.pos);
  }

  /*マップデータを消して作り直す*/
  static RebuildStage(){
    MapData.DeleteStage();
    MapData.CreateStage(Game.stage);
  }

  /*現在開かれているステージを削除*/
  static DeleteStage(){
    while(EntityManager.entityList.length > 0){
      EntityManager.removeEntity(EntityManager.entityList[0]);
    }
  }
  //壁タイルの対応
  //タイルIDを渡すとテクスチャを返す
  static WallTile(i){
    let out = Art.wallPattern.edge.out;
    let inner = Art.wallPattern.edge.inner;
    let steel = Art.wallPattern.steel;
    let needle = Art.wallPattern.needle;
    switch(i){
      //edge in
      case 49 : return inner[0];
      case 51 : return inner[1];
      case 65 : return inner[2];
      case 67 : return inner[3];
      //edge out
      case 52:return out[0];
      case 53:return out[1];
      case 54:return out[2];
      case 60:return out[3];
      case 62:return out[4];
      case 68:return out[5];
      case 69:return out[6];
      case 70:return out[7];
      //steel
      case 72:return steel.entity[0]; 
      case 73:return steel.entity[1]; 
      case 74:return steel.entity[2]; 
      case 75:return steel.entity[3]; 
      case 76:return steel.back[0];
      case 77:return steel.back[1];
      case 78:return steel.back[2];
      case 79:return steel.back[3];
      //signboard
      case 4 :return Art.wallPattern.signboard;
        //needle
      case 8 : return needle[0];
      case 9 : return needle[1];
      case 10 : return needle[2];
      case 11 : return needle[3];
  }
    console.warn(i);
    return Art.wallPattern.block;
  }
}
