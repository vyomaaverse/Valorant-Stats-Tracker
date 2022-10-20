import { Events } from "discord.js";

export interface EventInterface {
  name: Events;
  execute: (...args: any) => any;
}
