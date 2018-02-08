import UI from './ui.js';
import UIManager from './uiManager.js';
import Art from '../art.js';
import Input from '../input.js';
import Timer from '../timer.js';
import Util from '../util.js';

 export default class UIWeaponIcon extends UI{
   constructor(pos,name){
    super(pos); 
    /*基本情報*/
    this.name = name;
    this.type = UI_.WEQUIP;
    /*スプライト*/
    this.tex = Art.UIPattern.wEq1,UI_.WEQUIP; 
    this.sprite = Art.SpriteFactory(this.tex);
    this.sprite.position = this.pos;
    cl(this.pos);
   }
 }
