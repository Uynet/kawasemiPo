import Art from "../../art.js";
import Box from "../../Collision/box.js";
import Collider from "../../Collision/collider.js";
import Collision from "../../Collision/collision.js";
import EventManager from "../../Event/eventmanager.js";
import GameClearEvent from "../../Event/gameClearEvent.js";
import EntityManager from "../../Stage/entityManager.js";
import Entity from "../entity.js";

export default class Goal extends Entity {
  constructor(pos) {
    super(pos);
    this.name = "goalTrigger";
    this.layer = "ENTITY";
    this.sprite = Art.Sprite(Art.wallPattern.goal);
    this.sprite.position = pos;
    this.collider = new Collider(SHAPE.BOX, new Box(pos, 16, 16)); //衝突判定の形状
    /*固有*/
    this.isgoal = false; //??
    this.isUpdater = true;
  }
  Update() {
    if (Collision.on(this, EntityManager.player).isHit) {
      /*ステージ遷移処理*/
      if (!this.isgoal) {
        EntityManager.Find(this.name).forEach(e => {
          e.isgoal = true;
        });
        let g = new GameClearEvent();
        EventManager.eventList.push(g);
        this.isgoal = true;
        this.Delete();
      }
    }
  }
}
