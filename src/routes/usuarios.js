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

///loginadmin
app.post("/api/loginad", async (req, res) => {
  const { correo, pwd } = req.body;
  const user = await User.findOne({ correo });
  if (!user) {
    return res.json({ error: "Correo o contraseña incorrectos" });
  }
  const pwdMatches = await bcrypt.compare(pwd, user.pwd);
  if (!pwdMatches) {
    return res.json({ error: "Correo o contraseña incorrectos" });
  }
  // Agrega el tipo de usuario a la respuesta
  res.json({ tipoUsuario: user.tipoUsuario });
});

//exportar
module.exports = router ;
