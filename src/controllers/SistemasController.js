const Controller = {}; 
const express = require('express'); //guardar express en una variable de servidor 


Controller.NuevaTarea = (req, res) => {
    req.getConnection((err, conn) => {
        const data = req.body; //TRAE TODO EL OBJETO

        let Nombre = Object.values(data)[0].Nombre;
        let Planta = Object.values(data)[0].Planta;
        let Falla = Object.values(data)[0].Falla;
        let Notas = Object.values(data)[0].Notas;
        let Rama = Object.values(data)[0].Rama; 
        let Nomina = Object.values(data)[0].Nomina; 
        let Impacto = Object.values(data)[0].Impacto;
  
        conn.query("INSERT INTO TareaSistemas(Usuario,Planta,Equipo,Nota,Rama,Nomina,Impacto)VALUES" +
            "('" +Nombre + "','" + Planta + "','" + Falla + "','" + Notas + "','"+Rama+"','"+Nomina+"','"+Impacto+"')", (err, Herramientas) => {
                if (err) {
                    console.log('Error de lectura' + err);
                    res.json(false);
                }else{
                      console.log('Listo' )
                    res.json(true);
                }
               
            });
    }); 
};

Controller.TareasAbiertasSistemas = (req, res) => {
  
    //res.send('Metodo Get list');
    req.getConnection((err, conn) => {
        const {
            Argumento
        } = req.params;
        console.log("Nomina Man: "+Argumento)
        conn.query("SELECT * FROM TareaSistemas WHERE Nomina = '"+Argumento+"' order by Estatus", (err, data) => {
            if (err) {
                //res.json("Error json: " + err);
                console.log('Error al registrar recepcion ' + err);
            } else {
                console.log(data);
                res.json(data)
            }
        });
    }); 
};




Controller.CargarTareaSistemasid = (req, res) => {
  
    //res.send('Metodo Get list');
    req.getConnection((err, conn) => {
        const {
            Argumento
        } = req.params;

        conn.query("SELECT * FROM TareaSistemas WHERE id = "+Argumento, (err, data) => {
            if (err) {
                //res.json("Error json: " + err);
                console.log('Error al registrar recepcion ' + err);
            } else {
                console.log(data);
                res.json(data)
            }
        });
    }); 
};



Controller.TareasAbiertasServidorSistemas = (req, res) => {

    //res.send('Metodo Get list');
    req.getConnection((err, conn) => {
        const {
            Argumento
        } = req.params;

        conn.query("SELECT * FROM TareaSistemas WHERE Estatus != 'Cerrada' " , (err, data) => {
            if (err) {
                //res.json("Error json: " + err);
                console.log('Error al registrar recepcion ' + err);
            } else {
                //console.log(data);
                res.json(data)
            }
        });
    });
};


Controller.ActualizarTareasSistemas = (req, res) => {
    req.getConnection((err, conn) => {
        const data = req.body; //TRAE TODO EL OBJETO

        let Servidor_Respuesta = Object.values(data)[0].Servidor_Respuesta;
        let Cierre = Object.values(data)[0].Cierre;
        let id = Object.values(data)[0].id;  
        
         console.log(Cierre)
        conn.query("UPDATE TareaSistemas SET Respuesta = '"+Servidor_Respuesta+"', FechaPromesa = '"+ Cierre +"' WHERE id = "+id, (err, Herramientas) => {
                if (err) {
                    console.log('Error de lectura' + err);
                    res.json(false);
                } else {
                    console.log('Listo')
                    res.json(true);
                }
            });
    });
};


Controller.CerrarTareasSistemas = (req, res) => {
    req.getConnection((err, conn) => {
        const data = req.body; //TRAE TODO EL OBJETO

        let idTarea = Object.values(data)[0].idTarea; 
        let Respuesta = Object.values(data)[0].Respuesta;  
        let Cierre = Object.values(data)[0].Cierre;

        conn.query("UPDATE TareaSistemas SET Respuesta = '"+Respuesta+"', FechaCierre = '"+ Cierre +"', Estatus = 'Cerrada' WHERE id = "+idTarea, (err, Herramientas) => {
                if (err) {
                    console.log('Error de lectura' + err);
                    res.json(false);
                } else {
                    console.log('Listo')
                    res.json(true);
                }
            });
    });
};








module.exports = Controller;