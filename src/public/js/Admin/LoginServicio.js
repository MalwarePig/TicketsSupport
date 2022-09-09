function Login() {
    let planta = document.querySelector("#Planta").value;
    let nomina = document.querySelector("#Nomina").value;
    let Argumento = planta + nomina
    $.ajax({
        url: '/LoguearServicio/' + Argumento,
        success: function (data) {
            if (data) {

                localStorage.clear();
                localStorage.setItem('Nomina', data[0].Nomina);
                localStorage.setItem('Nombre', data[0].Nombre);
                localStorage.setItem('Planta', data[0].Planta);
                Cookies(data[0].Nomina,data[0].Planta);
                var pagina = "/HomeServicios";
                location.href = pagina;

            } else {
                alert("sin datos")
            }
        } //Funcion success
    }); //Ajax 
}

function Cookies(usuario,contrasena){
    let Usuario = usuario
    let Contrasena = contrasena
    document.cookie = "Usuario= "+Usuario+";Contrasena= "+Contrasena+";expires = viernes, 9 de septiembre de 2025; path =/;";
}

function CargarCookie(){
    var MyCookie = document.cookie;
    let Nomina = MyCookie.substring(9,11)
    console.log(MyCookie.substring(9,11)); 

    document.querySelector("#Nomina").value = Nomina;
}
