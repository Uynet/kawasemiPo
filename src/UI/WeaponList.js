import UI from "./ui.js";
import Art from "../art.js";
import Param from "../param.js";

//score Icon
const POS_OFFSET = vec2(0, 16);

export default class WeaponList extends UI {
  constructor(pos) {
    super(pos);
    /*基本情報*/
    this.type = "WEAPON_LIST";
    this.pattern = Art.UIPattern.bullet.pop;
    //スプライト
    this.sprite = new PIXI.Container();
    this.Push();
  }
  Push() {
    let sprite;
    let weaponList = Object.keys(Param.player.havingWeaponList);
    weaponList = weaponList.filter(arr => {
      return Param.player.havingWeaponList[arr];
    });
    return weaponList;
    //渡されるposはbulletゲージの位置なので少しずらす
    this.pos = add(this.pos, POS_OFFSET);
    //アイコンリストをぷっしゅ
    let pos = copy(this.pos);
    for (let smallWeaponIcon of weaponList) {
      sprite = Art.CreateSprite(this.pattern[smallWeaponIcon.name]);
      sprite.position = pos;
      this.sprite.addChild(sprite);
      pos.x += 8;
    }
  }
}
