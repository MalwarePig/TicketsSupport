const Controller = {};
const express = require('express'); //guardar express en una variable de servidor 

Controller.Login = (req, res) => {

    //res.send('Metodo Get list');
    req.getConnection((err, conn) => {
        const {
            Argumento
        } = req.params;
        console.log("Debe buscar:" + Argumento)
        conn.query("SELECT * FROM empleados WHERE Nomina = '" + Argumento + "'", (err, data) => {
            req.session.planta = data[0].Planta;
            if (err) {
                //res.json("Error json: " + err);
                console.log('Error al buscar empleados ' + err);
            } else {
                console.log(data)
                if (data.length > 0) {
                    res.json(data)
                    console.log(data)
                    req.session.planta = data[0].Planta;
                } else {
                    res.json(false)
                }
            }
        });
    });
};


Controller.Reporte = (req, res) => {

    //res.send('Metodo Get list');
    req.getConnection((err, conn) => {
        const {
            Argumento
        } = req.params;
        let Planta = Argumento.split('|')[0];
        let Departamento = Argumento.split('|')[1];
        let FechInicio = Argumento.split('|')[2];
        let FechFin = Argumento.split('|')[3];
        let Tabla = "";

        switch (Departamento) {
            case 'Electrico': Tabla = 'TareaElectrico';
                break;
            case 'Mantenimiento': Tabla = 'TareaMantenimiento';
                break;
            case 'Sistemas': Tabla = 'TareaSistemas';
                break;
            default:
                break;
        }

        console.log(Planta + Departamento + FechInicio + FechFin)
        conn.query("SELECT * FROM "+Tabla+" WHERE Planta = '"+Planta+"' AND FechaRegistro between '"+FechInicio+"' AND '"+FechFin+"' Order by Estatus,FechaRegistro", (err, data) => {
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


Controller.ReporteUnitario = (req, res) => { 
    req.getConnection((err, conn) => {
        const {
            Argumento
        } = req.params;

        let Planta = Argumento.split('|')[0];
        let Departamento = Argumento.split('|')[1];
        let indice = Argumento.split('|')[2]; 
        let Tabla = "";

        switch (Departamento) {
            case 'Electrico': Tabla = 'TareaElectrico';
                break;
            case 'Mantenimiento': Tabla = 'TareaMantenimiento';
                break;
            case 'Sistemas': Tabla = 'TareaSistemas';
                break;
            default:
                break;
        }

        console.log("Nomina Man: "+Argumento)
        conn.query("SELECT * FROM "+Tabla+" WHERE id = "+indice, (err, data) => {
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


module.exports = Controller;