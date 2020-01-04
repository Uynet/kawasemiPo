import Scene from "./scene.js";
import UIManager from "../UI/uiManager.js";
import Game from "../game.js";

export default class LoadingScene extends Scene {
  constructor() {
    super();
    this.name = "loading";
  }
  Init() {
    this.frame = 0;
    UIManager.SetLoading();
  }
  Update() {
    if (isDebugMode && this.frame == 10) Game.state.dispatch("loadComplete");
    UIManager.Update();
    if (this.frame == 100) {
      UIManager.Clean();
      Game.state.dispatch("loadComplete");
    }
    this.frame++;
  }
}
