const express = require ("express");
const mongoose = require("mongoose");
require("dotenv").config();

//se agregan los enlaces de rutas de la carpeta ROUTERS
const  categorias =  require("./src/routes/categorias");
const  preguntas =  require("./src/routes/preguntas");
const  presentacion =  require("./src/routes/presentacion");
const  productos =  require("./src/routes/productos");
const  tipousuarios =  require("./src/routes/tipousuarios");
const  usuarios =  require("./src/routes/usuarios");
const respuestas = require("./src/routes/respuestas");

//settings
const app = express();
const port = process.env.PORT || 9000;

//middle
app.use(cors());
app.use(express.json());
app.use("/api", categorias);
app.use("/api", preguntas);
app.use("/api", presentacion);
app.use("/api", productos);
app.use("/api", tipousuarios);
app.use("/api", usuarios);
app.use("/api", respuestas);

//routes
app.get("/",(req,res)=>{
    res.send("Bienvenido a mi API");
}); 
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
//conectarse a la base de datos de mongo\
mongoose.connect("mongodb+srv://WasakaBegein:wasakabegein@clusteralan.rnfab7j.mongodb.net/ProyectoFinal?retryWrites=true&w=majority")
        .then(()=> console.log("Conectado a la Base de Datos MongoDB"))
        .catch((error)=>console.error(error));


        //servidor arrancando
app.listen(port , ()=> console.log("Servidor arrancando en el puerto :",port));