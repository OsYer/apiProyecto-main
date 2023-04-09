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
router.post('/loginad', async (req, res) => {
  const { correo, pwd } = req.body;

  try {
    const user = await User.findOne({
      correo,
      nombreTipoUser: {
        $elemMatch: { _id: '642b4184d270aa4a64ba286b' },
      },
    });
    if (!user) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const isMatch = user.pwd === pwd;
    if (!isMatch) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    res.json({ message: 'Autenticación exitosa' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
//exportar
module.exports = router ;
