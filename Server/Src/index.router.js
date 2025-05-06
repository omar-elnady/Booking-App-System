import morgan from "morgan";
import cors from "cors";
import { globalErrorHandling } from "./utils/errorHandling.js";
import connectionDB from "./DB/connection.js";

// import Routers
import authRouter from "./modules/auth.router.js";
const initApp = (app, express) => {
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(cors());

  app.use("/auth", authRouter);

  // app.get("*", (req, res, next) => {
  //   res.status(404).send("In-valid Routing Please check url or method");
  // });
  app.use(globalErrorHandling);
  connectionDB();
};

export default initApp;
