import express from "express";
import initApp from "./Src/index.router.js";
const app = express();
const port = process.env.PORT || 8000;

initApp(app, express);

app.listen(port, () => {
  console.log(`Server Ruuning On Port : ${port}`);
});
