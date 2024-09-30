import { Server, Socket } from "socket.io";
import blogEvents from "../config/blogEvents";
import { getGenerateProcessProgress } from "../controller/blogs.controller";
/**
 *
 * @param {Server} io
 * @param {Socket} socket
 */
const blogsHandler = (io, socket) => {
  socket.on("blogs", (data, cb) => {
    socket.join("blogs");
    if (typeof cb === "function") cb(getGenerateProcessProgress());
  });

  socket.on("blogs:stop", () => {
    blogEvents.emit("stop");
  });
};

export default blogsHandler;
