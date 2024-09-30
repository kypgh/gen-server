import { EventEmitter } from "events";

const blogEvents = new EventEmitter();

blogEvents.setMaxListeners(10);

export default blogEvents;
