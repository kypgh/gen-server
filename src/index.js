import express, { ErrorRequestHandler } from "express";
import { PORT } from "./config/envs";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import apiRoutes from "./routes/api/requestHandlers";
import blogsHandler from "./handler/blogs.handler";
import blogEvents from "./config/blogEvents";
import HTTPError from "./utils/HTTPError";
import statusPageService from "./services/statusPage.service";
import { filter } from "./services/extractAi.service";

async function main() {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ status: true, message: "Our node.js app works" });
  });

  app.use("/api", apiRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ message: "Route Not Found" });
  });

  app.use(
    /** @type {ErrorRequestHandler} */
    (err, req, res, next) => {
      if (err instanceof HTTPError) {
        res.status(err.status).json(err.responseBody);
        return;
      }

      if (err instanceof URIError) {
        return res.status(400).json({ message: "Invalid URI" });
      }

      if (typeof err.toJSON === "function") {
        console.error(err.toJSON());
      }

      statusPageService.createEndpointIncident({
        method: req.method,
        path: req.path,
        message: err.message,
      });
      res.status(500).json({ message: "Internal Server Error" });
    }
  );

  io.on("connection", (socket) => {
    blogsHandler(io, socket);
  });

  blogEvents.on("progress", (data) => {
    io.in("blogs").emit("blogs:progress", data);
  });

  server.listen(PORT, () =>
    console.log(`App listening at port http://localhost:${PORT}`)
  );
}
main();

filter(
  "https://www.myfxbook.com/news/softer-pce-data-dims-dollars-dazzle/29264"
);
