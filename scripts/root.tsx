import { dayjs } from "./bundles/dayjs";

export default class Root extends godot.Node2D {
  _ready() {
    let day = `${dayjs().format("{YYYY} MM-DDTHH:mm:ss SSS [Z] A")}`;
    console.log("hello world", day);
  }
}
