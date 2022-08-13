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

                var pagina = "/HomeServicios";
                location.href = pagina;

            } else {
                alert("sin datos")
            }
        } //Funcion success
    }); //Ajax 
}

