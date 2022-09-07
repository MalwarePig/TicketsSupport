
function Nuevatareas() {
    document.querySelector("#Nombre").value = localStorage.getItem("Nombre")
    document.querySelector("#FechaRegistro").value = moment().format("DD-MM-YYYY");
}

async function CerrarFormularioNewTarea() {
    const ModalFormNuevaTarea = document.querySelector('#ModalFormNuevaTarea');

    await ModalFormNuevaTarea.dismiss({
        'dismissed': true
    });
}


function Registrar() {
    /* let Proyecto = localStorage.getItem('ProyectoActual'); */
    let FechaRegistro = document.querySelector("#FechaRegistro").value;
    let Nombre = document.querySelector("#Nombre").value;
    let Planta = document.querySelector("#Planta").value || '';
    let Falla = document.querySelector("#Falla").value || '';
    let Notas = document.querySelector("#Notas").value || '';
    let Rama = document.querySelector("#Rama").value || '';
    let Nomina = localStorage.getItem("Nomina");
    let Impacto = document.querySelector("#Impacto").value || '';
    
    var Arreglo = [Nombre,Planta,Falla,Notas,Rama,Nomina,Impacto]; 
    var Condicion = true; //para campos vacios
    for (var a in Arreglo) { //recorrer arreglo en busca de campos vacios
        console.log(a)
        console.log(Arreglo[a])
        if (Arreglo[a].length == 0 || Arreglo[a] == undefined) {
            Condicion = false; //si algun campo esta vacio cambia a falso
        }
    }

    let Registro = {
        Nombre: Nombre,
        Planta: Planta,
        Falla: Falla,
        Notas: Notas,
        Rama: Rama,
        Nomina: Nomina,
        Impacto:Impacto
    }

    console.log(Registro)

    if (Condicion == true) { //si todos los campos estan llenos avanza
        $.post("/registrarTareaElectrica", // url
            {
                Registro
            }, // data to be submit
            function (objeto, estatus) { // success callback
                window.location.href = "/ListaElectrico";
            });
    } else {
        alert("Faltan campos por llenar")
    } 
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
        url: '/TareasAbiertasElectrico/'+ localStorage.getItem('Nomina'),
        success: function (data) {
            /* $("#CuerpoRegistros tr").remove(); */

            let TotalRegistros = data.length;
            document.getElementById("total").innerText = TotalRegistros;

            for (let index = 0; index < TotalRegistros; index++) {
                var Lista = document.querySelector("#ListaMaestra");

                const div = document.createElement("div"); //Creo un nuevo div para la nueva tarjeta
                div.innerHTML = ItemOriginal;
                Lista.appendChild(div);

                var Titulo = document.querySelector("#Titulo-Borrador");
                Titulo.innerHTML = data[index].Usuario;
                Titulo.id = 'Titulo' + index;
                //ListaTareas.push(data[index].Proyecto);
                //console.log('TotalRegistros: ' +data[index].Tareas)
                //TotalTareas.push((data[index].Tareas-1))

                var SubTitulo = document.querySelector("#SubTitulo-Borrador");
                SubTitulo.innerHTML = data[index].Equipo;
                SubTitulo.id = 'SubTitulo' + index;

                var Contenido = document.querySelector("#Contenido-Borrador");
                Contenido.innerHTML = data[index].Nota;
                Contenido.id = 'Contenido' + index;

                document.querySelector("#indiceProyecto").setAttribute('onclick', 'AsignarLocalStorage("' + data[index].id + '")');
       
                //document.querySelector("#indiceProyecto").setAttribute('href', '/MostrarFormulario');
                var indiceProyecto = document.querySelector("#indiceProyecto");
                indiceProyecto.id = 'indiceProyecto' + data[index].id;


                /* var BarraCumplimiento = document.querySelector("#BarraCumplimiento");
                BarraCumplimiento.id = 'BarraCumplimiento' + index; */
 
                var FechasProyecto = document.querySelector("#FechasProyecto"); 
                FechasProyecto.id = 'FechasProyecto' + index;
                let Inicio = moment(data[index].FechaRegistro).format("DD/MM/YYYY") 
                FechasProyecto.innerHTML = Inicio;
            }
            //AjustarBarras()
        } //Funcion success
    }); //Ajax 
}

//Guardar id del proyecto en revision actual
function AsignarLocalStorage(params) {
    localStorage.setItem('ProyectoActual', params);
    document.querySelector("#ModalEstatusElectrico").present()
    console.log("sigo jalando")
    EscribirModalStatus();
}

//Para cerrar el modal de estatus 
async function CerrarModalEstatusElectrico() {
    const ModalFormNuevaTarea = document.querySelector('#ModalEstatusElectrico');

    await ModalFormNuevaTarea.dismiss({
        'dismissed': true
    });
}

function EscribirModalStatus() {
    var idTarea = localStorage.getItem('ProyectoActual');

    $.ajax({
        url: '/CargarTareaElectricoid/'+idTarea,
        success: function (data) {
            document.querySelector("#est_Nombre").innerHTML = data[0].Usuario;
            document.querySelector("#est_Maquina").innerHTML = data[0].Equipo;
            document.querySelector("#est_FechaResgistro").innerHTML ='Fecha registro: ' + moment(data[0].FechaRegistro).format('DD-MM-YYYY');
            document.querySelector("#est_Estatus").innerHTML = data[0].Estatus; 
            document.querySelector("#est_Respuesta").innerHTML = data[0].Respuesta == null ? "Sin Respuesta" : data[0].Respuesta; 

            if(data[0].FechaPromesa){
                document.querySelector("#est_FechaPromesa").innerHTML = data[0].FechaPromesa == null ? "Sin Respuesta" : "Fecha promesa: " + moment(data[0].FechaPromesa).format("DD-MM-YYYY");
            } 
        }//Funcion success
    }); //Ajax 
    
}