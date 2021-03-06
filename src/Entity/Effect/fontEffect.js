import EFFECT from "./effect.js";
import Art from "../../art.js";
/*文字*/
export default class FontEffect extends EFFECT {
  //strは表示する文字(今は数字のみ)
  constructor(pos, str, fonttype) {
    let v = {
      x: Rand(1.5),
      y: -2
    };
    super(copy(pos), v);
    /*基本情報*/
    this.fonttype = fonttype;
    this.name = "FontEffect";
    this.isAlive = true; //消えたらfalse
    this.isMultiple = true; //このEntityは複数スプライトを持つか
    /*スプライト*/
    this.str = str; //0~9
    this.container = new PIXI.Sprite();
    this.strLength = this.str.length; //桁数
    for (let i = 0; i < this.strLength; i++) {
      let spid = this.str[i] + ""; //str型にすること
      let texture;
      //popが使われているのは現状弾薬不足エフェクトのみ?
      switch (this.fonttype) {
        case "player":
          texture = Art.font[spid + "r"];
          break;
        case "enemy":
          texture = Art.font[spid];
          break;
        case "pop":
          texture = Art.font[spid];
          break;
        default:
          console.warn(this.fonttype);
      }

      let fontSprite = Art.CreateSprite(texture);
      if (this.str > "z") fontSprite.position.x = i * 10;
      else fontSprite.position.x = i * 6;
      this.container.addChild(fontSprite);
    }
    this.gravity = 0.2;
  }

  Update() {
    this.ExecuteAI();
    if (this.frame > 30) this.container.alpha -= 0.05;
    if (this.frame > 90) this.Delete();
  }
}
