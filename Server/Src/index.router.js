import morgan from "morgan";
import cors from "cors";
import { globalErrorHandling } from "./utils/errorHandling.js";
import connectionDB from "./DB/connection.js";
import i18next from "i18next";
import i18nextFsBackend from "i18next-fs-backend";
import i18nextHttpMiddleware from "i18next-http-middleware";
import path from "path";
import { fileURLToPath } from "url";
// import Routers
import authRouter from "./modules/Auth/auth.router.js";
import eventRouter from "./modules/Event/event.router.js";
import bookingRouter from "./modules/Booking/booking.router.js";
import categoriesRouter from "./modules/Category/category.router.js";
import adminRouter from "./modules/Admin/admin.router.js";
import userRouter from "./modules/User/user.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

i18next
  .use(i18nextFsBackend)
  .use(i18nextHttpMiddleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    backend: {
      loadPath: path.join(__dirname, "locales/{{lng}}/translation.json"),
    },
    detection: {
      order: ["header"],
    },
  });

const initApp = (app, express) => {
  app.use(i18nextHttpMiddleware.handle(i18next));
  app.use(morgan("dev"));

  // Handle Stripe Webhook Raw Body
  app.use((req, res, next) => {
    if (req.originalUrl.includes("/booking/webhook")) {
      next();
    } else {
      express.json()(req, res, next);
    }
  });
  app.use("/booking/webhook", express.raw({ type: "application/json" }));

  app.use(cors()); // Allow all origins for dev simplicity or configure specifically

  app.use("/auth", authRouter);
  app.use("/event", eventRouter);
  app.use("/booking", bookingRouter);
  app.use("/categories", categoriesRouter);
  app.use("/admin", adminRouter);
  app.use("/user", userRouter);

  // app.get("*", (req, res, next) => {
  //   res.status(404).send("In-valid Routing Please check url or method");
  // });
  app.use(globalErrorHandling);
  connectionDB();
};

export default initApp;
