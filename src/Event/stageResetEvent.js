import Event from './event.js';
import UIManager from '../UI/uiManager.js';
import MapData from '../Stage/mapData.js';
import EventManager from '../Event/eventmanager.js';

//現在未使用
export default class StageResetEvent extends Event{
  //「マップをリセットする関数」を返す
  constructor(){
    super(1);
    function* po(){
      cl("po");
      //EventManager.eventList.pop();
    }
    let itt = po();
    this.func = itt;
  }
}
