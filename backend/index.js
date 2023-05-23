const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const sesion = require("express-session");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const upload = multer();
const app = express();

app.use(
  sesion({
    secret: "123456",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.none());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/setcookie", (req, res) => {
  res.cookie("my cookie name", "my cookie", {
    maxAge: 1000 * 10, //con tiempo de expiracion
    httpOnly: true, //que no pueda ser accedida a traves de javascript
    sameSite: "strict", //que solo puedan ser accedidas desde el mismo dominio
  });
  res.send("Cookie creada");
});

app.get("/getcookie", (req, res) => {
  res.send(req.cookies);
});
app.get("/clearCookie", (req, res) => {
  res.clearCookie("my cookie name")//limpiamos la cookie con el nombre que le dimos
  res.send('Cookie eliminada');
});

app.get("/session", (req, res) => {
  req.session.usuario = "Abel Llontop";
  req.session.rol = "Admin";
  req.session.visitas = req.session.visitas ? ++req.session.visitas : 1;
  res.send(
    `El usuario ${req.session.usuario} con rol ${req.session.rol} ha visitado la pagina ${req.session.visitas} veces`
  );
});

app.post("/post", (req, res) => {
  res.send(req.body);
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(3000, () => {
  console.log("Server Express is running on port 3000");
});
