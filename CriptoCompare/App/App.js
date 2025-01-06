const criptomonedasSelect = document.getElementById("criptomoneda");
const monedaSelect = document.getElementById("moneda");
const formulario = document.querySelector("#cotizador-form");
const resultado = document.getElementById("resultado")

const objBusqueda = {
    moneda : "",
    cripto :""
}


const obtenerCriptos = criptos => new Promise(resolve =>{
    resolve(criptos);
})

document.addEventListener("DOMContentLoaded",()=>{
    consultarCriptomonedas();
    formulario.addEventListener("submit",submitFormulario)

    monedaSelect.addEventListener('change',leerValor)
    criptomonedasSelect.addEventListener('change',leerValor)

})

function consultarCriptomonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url).
    then(respuesta => respuesta.json()  
).
    then(resultado => obtenerCriptos(resultado.Data)).
    then(criptomonedas => selectCriptos(criptomonedas)).
    catch(error => console.log(error))
}


function selectCriptos(criptomonedas){
    criptomonedas.forEach(moneda => {
       const {FullName,Name} = moneda.CoinInfo;
       
       const option = document.createElement("option");
       option.value = Name;
       option.textContent = FullName;
       criptomonedasSelect.appendChild(option);
        
    });
}
function submitFormulario(e){
    e.preventDefault();

    const {moneda,cripto} = objBusqueda;
    if(moneda === '' || cripto === ''){
        mostrarAlerta("Ambos campos son obligatorios","danger");
        return;
    }

    consultarApi()



}

function leerValor(e){
   objBusqueda[e.target.name] = e.target.value
}


function mostrarAlerta(mensaje,tipo ="danger"){
    const alertaprevia = document.querySelector(".alert");
    if (alertaprevia) {
        alertaprevia.remove();
    }


    const alerta = document.createElement("div")
    alerta.className = `alert alert-dismissible alert-${tipo} fade show`
    alerta.role = "alert"

    alerta.innerHTML = `
    ${mensaje}
    <button id="alerta" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
`;

    formulario.parentElement.insertBefore(alerta,formulario)

    setTimeout(() => {
        if(alerta){
            alerta.remove();
        }
    }, 5000);

}


function consultarApi(){
    const {moneda,cripto} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cripto}&tsyms=${moneda}`
    console.log(url)


    mostrarSpinner();

    fetch(url).then(respuesta => respuesta.json())
    .then(cotizacion => mostrarCotizacionHtml(cotizacion.DISPLAY[cripto][moneda]))

}

function mostrarCotizacionHtml(cotizacion){
    const {PRICE,HIGHDAY,LOWDAY,CHANGEPCT24HOUR,LASTUPDATE} = cotizacion;
    const resultadoDiv = document.createElement("div");
    resultadoDiv.classList.add("resultado-cotizacion", "card", "shadow-lg", "mt-4");

    const contenido = `
    <div class="card-body">
        <h5 class="card-title">Resultado de Cotización</h5>
        <p class="card-text">Precio Actual: <span class="text-success">${PRICE}</span></p>
        <p class="card-text">Precio más alto del día: <span class="text-warning">${HIGHDAY}</span></p>
        <p class="card-text">Precio más bajo del día: <span class="text-danger">${LOWDAY}</span></p>
        <p class="card-text">Cambio en las últimas 24 horas: <span class="${CHANGEPCT24HOUR > 0 ? 'text-success' : 'text-danger'}">${CHANGEPCT24HOUR}%</span></p>
        <p class="card-text">Última actualización: <span class="text-muted">${LASTUPDATE}</span></p>
    </div>
`;
resultadoDiv.innerHTML = contenido;

// Insertar el contenedor al DOM
const contenedorResultado = document.getElementById("resultado");
contenedorResultado.innerHTML = ""; // Limpiar cualquier contenido anterior
contenedorResultado.appendChild(resultadoDiv);
}

function mostrarSpinner(){
    resultado.innerHTML = ""
    const spinner = document.createElement("div")
    spinner.classList.add("spinner");
    spinner.innerHTML = ` 
    <div class="rect1"></div>
    <div class="rect2"></div>
    <div class="rect3"></div>
  <div class="rect4"></div>
  <div class="rect5"></div>`;

   resultado.appendChild(spinner)
}