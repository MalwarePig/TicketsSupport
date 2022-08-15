var Planta = "Bravo";
var Fechas;
var Departamento = "Electrico";
var DataReporte;

function SetPlanta(Argumento) {
    Planta = Argumento
}

function MostrarFecha() {
    var fecha = document.querySelector("#Calendario").value;
    if (fecha && (fecha.length > 1) && (Planta != '')) {
        document.getElementById("labelRangoFechas").innerHTML = Planta + ": " + fecha[0] + " / " + fecha[1];
        Fechas = fecha;
    }
}

function SetDepartamento(Argumento) {
    Departamento = Argumento;
    MostrarProyectos()
}



//Mostrar Tareas Activas
var ListaTareas = []
var TotalTareas = []
function MostrarProyectos() {

    //Limpiar Lista Maestra
    var Lista = document.querySelector("#ListaMaestra");
    while (Lista.firstChild) {
        //The list is LIVE so it will re-index each call
        Lista.removeChild(Lista.firstChild);
    }

    //Construir Lista Maestra con tarjetas
    var ItemOriginal = document.querySelector("#Item-Borrador").innerHTML;
    $.ajax({
        url: '/Reporte/' + Planta + '|' + Departamento + '|' + Fechas[0] + '|' + Fechas[1],
        success: function (data) {
            DataReporte = data;
            /* $("#CuerpoRegistros tr").remove(); */

            let TotalRegistros = data.length;

            for (let index = 0; index < TotalRegistros; index++) {
                var Lista = document.querySelector("#ListaMaestra");

                const div = document.createElement("div"); //Creo un nuevo div para la nueva tarjeta
                div.innerHTML = ItemOriginal;
                div.setAttribute('onclick', 'MostrarInforme("' + data[index].id + '")');

                Lista.appendChild(div);

                var Usuario = document.querySelector("#Nombre");
                Usuario.innerHTML = data[index].Usuario;
                Usuario.id = 'Nombre' + index;

                var Equipo = document.querySelector("#Equipo");
                Equipo.innerHTML = data[index].Equipo;
                Equipo.id = 'Equipo' + index;

                var Estatus = document.querySelector("#Estatus");
                Estatus.innerHTML = 'Estatus: ' + data[index].Estatus;
                Estatus.id = 'Estatus' + index;

                var FechaRegistro = document.querySelector("#FechaRegistro");
                FechaRegistro.id = 'FechaRegistro' + index;
                let Inicio = 'Registrado: ' + moment(data[index].FechaRegistro).format("DD/MM/YYYY")
                FechaRegistro.innerHTML = Inicio;
            }
        } //Funcion success
    }); //Ajax 
}





//Clave,Producto,almacen,Stock,StockMin,StockMax,StockUsado,Ubicacion
function ExportarReporte() {

    var limite = DataReporte.length;
    var sheet_1_data = [['Usuario', 'Planta', 'Equipo', 'Nota', 'Rama', 'FechaRegistro', 'FechaPromesa','FechaCierre','Respuesta','Estatus']];

    for (var i = 0; i < limite; i++) {
        var Usuario = DataReporte[i].Usuario;
        var Planta = DataReporte[i].Planta;
        var Equipo = DataReporte[i].Equipo;
        var Nota = DataReporte[i].Nota;
        var Rama = DataReporte[i].Rama;
        var FechaRegistro = DataReporte[i].FechaRegistro;
        var FechaPromesa = DataReporte[i].FechaPromesa;
        var FechaCierre = DataReporte[i].FechaCierre;
        var Respuesta = DataReporte[i].Respuesta;
        var Estatus = DataReporte[i].Estatus;

        var Fila = [Usuario, Planta,Equipo ,Nota ,Rama ,FechaRegistro ,FechaPromesa ,FechaCierre ,Respuesta , Estatus];

        sheet_1_data.push(Fila);
    } //fin de for de filas

    var opts = [{
        sheetid: 'Hoja1',
        header: false
    }];
    var result = alasql('SELECT * INTO XLSX("'+Departamento+'.xlsx",?) FROM ?', [opts, [sheet_1_data]]); 
}

function MostrarInforme(indice){
    
    $.ajax({
    url: '/ReporteUnitario/' + Planta + '|' + Departamento + '|' + indice,
    success: function (data) { 
        document.querySelector("#est_Nombre").innerHTML = data[0].Usuario;
        document.querySelector("#est_Maquina").innerHTML = data[0].Equipo;
        document.querySelector("#est_FechaResgistro").innerHTML = data[0].FechaRegistro;
        document.querySelector("#est_Estatus").innerHTML = data[0].Estatus;
        document.querySelector("#est_Respuesta").innerHTML = data[0].Respuesta;

        if(data[0].FechaPromesa){
            document.querySelector("#est_FechaPromesa").innerHTML = 'Fecha promesa ' + moment(data[0].FechaPromesa).format('DD-MM-YYYY');
        }
        document.querySelector("#ModalEstatus").present()
    } //Funcion success
}); //Ajax 


   
}


async function CerrarInforme() {
    const ModalFormNuevaTarea = document.querySelector('#ModalEstatus');

    await ModalFormNuevaTarea.dismiss({
        'dismissed': true
    });
}