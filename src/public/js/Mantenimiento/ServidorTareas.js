
async function CerrarFormularioNewTarea() {
    const ModalFormNuevaTarea = document.querySelector('#ModalFormNuevaTarea');

    await ModalFormNuevaTarea.dismiss({
        'dismissed': true
    });
}

function ActualizarTareas() {
    /* let Proyecto = localStorage.getItem('ProyectoActual'); */
    let Servidor_Respuesta = document.querySelector("#Servidor_Respuesta").value;
    let FechaLabel = document.querySelector("#labelCierre").innerHTML.substring(15).replaceAll('-', '/')
    let Anio = FechaLabel.substring(7);
    let Mes = FechaLabel.substring(4, 6);
    let Dia = FechaLabel.substring(1, 3);

    let Cierre = moment(Anio + "-" + Mes + "-" + Dia).format('YYYY-MM-DD');
    let id = localStorage.getItem("ProyectoActual");

    console.log(Anio)
    console.log(FechaLabel)

    let est_Minutos = document.querySelector("#est_Minutos").value;

    let Registro = {
        Servidor_Respuesta: Servidor_Respuesta,
        Cierre: Cierre,
        id: id,
        est_Minutos:est_Minutos
    }

    console.log(Registro)

    $.post("/ActualizarTareasMantenimiento", // url
        {
            Registro
        }, // data to be submit
        function (objeto, estatus) { // success callback
           window.location.href = "/ListaServicioMantenimiento";
        }); 
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
        url: '/TareasAbiertasServidorMantenimiento/' + localStorage.getItem('Nomina'),
        success: function (data) {
            /* $("#CuerpoRegistros tr").remove(); */

            let TotalRegistros = data.length;
            document.getElementById("total").innerText = TotalRegistros;

            for (let index = 0; index < TotalRegistros; index++) {
                var Lista = document.querySelector("#ListaMaestra");

                const div = document.createElement("div"); //Creo un nuevo div para la nueva tarjeta
                div.innerHTML = ItemOriginal;
                Lista.appendChild(div);

                let Tarjeta = document.querySelector("#Tarjeta");
                let Tarjeta_Subtitulo = document.querySelector("#Tarjeta-Subtitulo");

                if(data[index].Impacto == 'Total'){
                    Tarjeta.setAttribute('color', 'warning');
                    Tarjeta.id = 'Tarjeta' + index;

                    Tarjeta_Subtitulo.setAttribute('color', 'warning');
                    Tarjeta_Subtitulo.id = 'Tarjeta-Subtitulo' + index;
                }else{
                    Tarjeta.setAttribute('color', 'dark');
                    Tarjeta.id = 'Tarjeta' + index;

                    Tarjeta_Subtitulo.setAttribute('color', 'dark');
                    Tarjeta_Subtitulo.id = 'Tarjeta-Subtitulo' + index;
                }

                var Titulo = document.querySelector("#Titulo-Borrador");
                Titulo.innerHTML = data[index].Usuario;
                Titulo.id = 'Titulo' + index;
                //ListaTareas.push(data[index].Proyecto);
                //console.log('TotalRegistros: ' +data[index].Tareas)
                //TotalTareas.push((data[index].Tareas-1))

                var SubTitulo = document.querySelector("#SubTitulo-Borrador");
                SubTitulo.innerHTML = data[index].Equipo + " | Impacto: " + data[index].Impacto;
                SubTitulo.id = 'SubTitulo' + index;

                var Contenido = document.querySelector("#Contenido-Borrador");
                Contenido.innerHTML = data[index].Nota;
                Contenido.id = 'Contenido' + index;


                if (data[index].Respuesta) {
                    var Badge = document.querySelector("#Badge-Borrador");
                    Badge.innerHTML = '✔';
                    Badge.id = 'Contenido' + index;
                }

 
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
    document.querySelector("#ModalEstatusMantenimiento").present()
    console.log("sigo jalando")
    EscribirModalStatus();
}

//Para cerrar el modal de estatus 
async function CerrarModalEstatusMantenimiento() {
    const ModalFormNuevaTarea = document.querySelector('#ModalEstatusMantenimiento');

    await ModalFormNuevaTarea.dismiss({
        'dismissed': true
    });
}

function EscribirModalStatus() {
    var idTarea = localStorage.getItem('ProyectoActual');

    $.ajax({
        url: '/CargarTareaMantenimientoid/' + idTarea,
        success: function (data) {
            document.querySelector("#est_Nombre").innerHTML = data[0].Usuario;
            document.querySelector("#est_Maquina").innerHTML = data[0].Equipo;
            document.querySelector("#est_FechaResgistro").innerHTML = 'Fecha registro: ' + moment(data[0].FechaRegistro).format('DD-MM-YYYY');
            document.querySelector("#est_Estatus").innerHTML = data[0].Estatus;
            document.querySelector("#est_Nota").innerHTML = data[0].Nota;
            document.querySelector("#Servidor_Respuesta").value = data[0].Respuesta;

            if(data[0].FechaPromesa){
                document.querySelector("#labelCierre").innerHTML = 'Fecha promesa ' + moment(data[0].FechaPromesa).format('DD-MM-YYYY');
            }
            
        } //Funcion success
    }); //Ajax 
}

function MostrarFecha() {
    document.querySelector("#labelCierre").innerHTML = "Fecha promesa : " + moment(document.querySelector("#CalendarioCierre").value).format("DD-MM-YYYY");
}

async function ModalCerrarTarea() {
    console.log("Estoy dentro")
    const handlerOutput = document.querySelector('#handlerResult');
    const roleOutput = document.querySelector('#roleResult');

    const alert = document.createElement('ion-alert');
    alert.header = 'Finalizar tarea?';
    alert.buttons = [
        {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => { CerrarModalEstatusMantenimiento(); }
        },
        {
            text: 'OK',
            role: 'confirm',
            handler: () => {  CerrarTareasMantenimiento(); }
        }
    ];

    document.body.appendChild(alert);
    await alert.present();

    const { role } = await alert.onDidDismiss(); 
}

 

function CerrarTareasMantenimiento() {  

    let Registro = {
        idTarea: localStorage.getItem("ProyectoActual"), 
        Respuesta: document.querySelector("#Servidor_Respuesta").value,
        Cierre: moment().format('YYYY-MM-DD')
    } 

    $.post("/CerrarTareasMantenimiento", // url
        {
            Registro
        }, // data to be submit
        function (objeto, estatus) { // success callback
            window.location.href = "/ListaServicioMantenimiento";
        });
}