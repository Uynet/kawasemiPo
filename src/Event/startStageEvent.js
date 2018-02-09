import Event from './event.js';
import UIManager from '../UI/uiManager.js';
import Game from '../Game.js';
import EventManager from './eventmanager.js';
import MapData from '../Stage/mapData.js';

/*タイトル画面からゲーム開始画面に移行するイベント
 * (UIの退避)
 * UIのセット
 */
export default class StartStageEvent extends Event{
  constructor(){
    super(1);
    function* po(){
      Game.scene.ChangeState(STATE.TITLE,STATE.STAGE);
      MapData.CreateStage(Game.stage);
      yield ;
    }
    let itt = po();
    this.func = itt;
  }
}
