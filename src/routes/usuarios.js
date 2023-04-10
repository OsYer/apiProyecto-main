const express = require("express");
const usuarios = require("../models/usuarios");

const router = express.Router();

//crear usuarios
router.post("/usuarios",(req,res)=>{
    const {nombre,apellidopa,apellidoma,correo,pwd,telefono,nombreTipoUser}=req.body;

    const user=new usuarios({
        nombre:nombre,
        apellidopa:apellidopa,
        apellidoma:apellidoma,
        correo:correo,
        pwd:pwd,
        telefono:telefono,
        nombreTipoUser:'642b4197d270aa4a64ba286d'
    });

    user.save()
                .then((data)=> res.json(data))
                .catch((error)=>res.json({message:error}));
});

//consultar
router.get('/usuarios',(req,res)=>{
    usuarios.aggregate([
        {
            $lookup:{
                from:'tipousuarios',
                localField:'nombreTipoUser',
                foreignField:'_id',
                as:'nombreTipoUser'
            }
        }
    ])
    .then((data)=>res.json(data))
    .catch((error)=>res.json({message:error}));
});

///actualizar
router.put('/usuarios/:id',(req,res)=>{
    const {id} = req.params;
    const {nombre,apellidopa,apellidoma,correo,pwd,telefono,nombreTipoUser}=req.body;

    usuarios
    .updateOne({_id:id},{$set:{nombre,apellidopa,apellidoma,correo,pwd,telefono,nombreTipoUser}})
    .then((data)=>res.json(data))
    .catch((error)=>res.json({message:error}));
});

//eliminar 
router.delete('/usuarios/:id',(req,res)=>{
    const {id} = req.params;
    usuarios.deleteOne({_id:id})
    .then((data)=>res.json(data))
    .catch((error)=>res.json({message:error}));
});
//iniciar sesión
router.post("/login",(req,res)=>{
    const {correo,pwd}=req.body;

    usuarios.findOne({correo: correo, pwd: pwd})
    .then((data)=>{
        if(data){
            res.json({message: "Inicio de sesión exitoso!"})
        } else {
            res.status(401.1).json({message: "Correo o contraseña incorrectos."})
        }
    })
    .catch((error)=>res.json({message:error}));
});
//iniciar sesión
router.post("/login",(req,res)=>{
    const {correo,pwd}=req.body;

    usuarios.findOne({correo: correo, pwd: pwd})
    .populate('nombreTipoUser')
    .then((data)=>{
        if(data){
            res.json({message: "Inicio de sesión exitoso!", usuario: data})
        } else {
            res.status(401).json({message: "Correo o contraseña incorrectos."})
        }
    })
    .catch((error)=>res.json({message:error}));
});

router.get("/clientes", (req, res) => {
  Usuarios.find({ nombreTipoUser: "642b4197d270aa4a64ba286d" })
    .populate("nombreTipoUser")
    .then((usuarios) => {
      const clientes = usuarios.filter(
        (usuario) => usuario.nombreTipoUser.nombreTipoUser === "Cliente"
      );
      const clientesSimplificados = clientes.map(
        (cliente) => cliente.nombre + " " + cliente.apellidoPa
      );
      res.json(clientesSimplificados);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Hubo un error en el servidor" });
    });
});
//consultar usuarios
router.get('/usuarios',(req,res)=>{
    usuarios.aggregate([
        {
            $lookup:{
                from:'tipousuarios',
                localField:'nombreTipoUser',
                foreignField:'_id',
                as:'nombreTipoUser'
            }
        },
        {
            $project:{
                _id: 1,
                nombre: 1,
                apellidopa: 1,
                apellidoma: 1,
                correo: 1,
                pwd: 1,
                telefono: 1,
                nombreTipoUser: { $arrayElemAt: [ "$nombreTipoUser.nombre", 0 ] }
            }
        }
    ])
    .then((data)=>res.json(data))
    .catch((error)=>res.json({message:error}));
});

//exportar
module.exports = router ;
