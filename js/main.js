// Creacion de la lista.
let listaCiudades=[];

// ----------------------------------------------------------------------------------------

// Evento del boton guardar.

$("#btnGuardar").click(function(){

    guardarCiudad();

});

mostrarCiudad(listaCiudades);


$(document).ready( async function(){

    var newLista=getListaCiudades();

    listaCiudades=[];

    for(let x=0; x<newLista.length; x++){

        await $.ajax({ 

            method: "GET", 
    
            url: `https://api.openweathermap.org/data/2.5/weather?q=${newLista[x].cNombre}&appid=${apiKey}`, 
    
            success: function(respuesta){ 

                actualizarDatos(respuesta);
    
            }
    
        })

    }

    console.log("Actualizado.");
});

// ----------------------------------------------------------------------------------------

let apiKey='0deee9c7a166e5a9c50fd9471c4270f4';

// ----------------------------------------------------------------------------------------

function callAPI(city){
    let api= `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    $.get(api, function(respuesta, estado){
        if(estado=="success"){
            let misDatos=respuesta;
            agregarCiudad(misDatos);
        }
    })
}
// ----------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------

setInterval( async function(){

    var newLista=getListaCiudades();

    listaCiudades=[];

    for(let x=0; x<newLista.length; x++){

        await $.ajax({ 

            method: "GET", 
    
            url: `https://api.openweathermap.org/data/2.5/weather?q=${newLista[x].cNombre}&appid=${apiKey}`, 
    
            success: function(respuesta){ 

                actualizarDatos(respuesta);
    
            }
    
        })

    }

    console.log("Actualizado.");

}, 300000);//Se actualiza cada 5min.


// Función que actualiza los datos de las ciudades (ya cargadas) recreando la lista previa.
function actualizarDatos(info){
    
    var nuevaCiudad = {
        cNombre:info.name,
        cTemperatura:info.main.temp,
        cPresion:info.main.pressure,
        cHumedad:info.main.humidity,
        cViento:info.wind.speed,
        cVisibilidad:info.visibility,
        cSunIn:info.sys.sunrise,
        cSunOut:info.sys.sunset,
        cIcon: info.weather[0].icon
    };


    listaCiudades.push(nuevaCiudad);

    localStorageListaCiudad(listaCiudades);

    mostrarCiudad(listaCiudades);
}

// ----------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------

// Función que toma el nombre de la cidudad ingresada y verifica que sea correcto, si ya se encuantra en la lista o si hay espacio para agregarlo.
function guardarCiudad(){

    if(listaCiudades.length==4){

        $("#error").html("<p class='text-white bg-danger p-3'>Para agregar otra ciudad debe borrar una.</p>");

    }else{

        var cName=$("#validationCustom01").val();

        if((cName=="") || (cName.length<=3)){

            $("#error").html("<p class='text-white bg-danger p-3'>Ingrese una ciudad.</p>");

        }else{

            callAPI(cName);

            $("#error").html("");

            $("#validationCustom01").val("");

        }

    }

    mostrarCiudad(listaCiudades);
}
// ----------------------------------------------------------------------------------------

// Funcion que verifica si una ciudad ya se encuentra en la lista.
function verificacion(nombreCiudad){

    for (var i=0; i<listaCiudades.length; i++){
        
        if(nombreCiudad===listaCiudades[i].cNombre){
            return true;
        }
    }

    return false;
}

// ----------------------------------------------------------------------------------------

// Función que agrega una ciudad a la lista.
function agregarCiudad(info){

    if(verificacion(info.name)){

        $("#error").html("<p class='text-white bg-danger p-3'>Ciudad ya asignada.</p>");

    }else{

        var nuevaCiudad = {
            cNombre:info.name,
            cTemperatura:info.main.temp,
            cPresion:info.main.pressure,
            cHumedad:info.main.humidity,
            cViento:info.wind.speed,
            cVisibilidad:info.visibility,
            cSunIn:info.sys.sunrise,
            cSunOut:info.sys.sunset,
            cIcon: info.weather[0].icon
        };

        listaCiudades.push(nuevaCiudad);

        localStorageListaCiudad(listaCiudades);

    }

    mostrarCiudad(listaCiudades);
}

// ----------------------------------------------------------------------------------------

// Función que guarda la lista en el local storage.
function localStorageListaCiudad(cList){
    localStorage.setItem('localListaCiudad', JSON.stringify(cList));
    console.log(localStorage.getItem('localListaCiudad'));
}

// ----------------------------------------------------------------------------------------

// Función que verifica si la lista tiene elementos.
function getListaCiudades(){
    
    var storedList=localStorage.getItem('localListaCiudad');

    if(storedList == null){
        listaCiudades=[];
    }else{
        listaCiudades=JSON.parse(storedList);
    }

    return listaCiudades;
}

// ----------------------------------------------------------------------------------------

// Función para realizar el cambio de °K a °C.
function kelvinC(grados) {
    cambioUnid = parseFloat(grados) - 273.15;
    return cambioUnid;
}

// Función para realizar el cambio de °K a °F.
function kelvinF(grados) {
    cambioUnid = (parseFloat(grados) - 273.15)*(9/5)+32;
    return cambioUnid;
}

// ----------------------------------------------------------------------------------------

// Funcion que crea la carta donde se visualizaran los datos de la ciudad ingresada.
function mostrarCiudad(){
    let contenido='';

    var ciudades=getListaCiudades();

    for(let j=0; j<ciudades.length; j++){
        contenido += "<div class='col-lg-3'>";
        contenido += "<div id='cardCity"+j+"' class='card'>";
        contenido += "<div class='row'>";
        contenido += "<div class='col-lg-11 cardName'>"
        contenido += "<h2>"+ciudades[j].cNombre+"</h2>";
        contenido += "</div>";
        contenido += "<div class='col-lg-1 cardInput'>";
        contenido += "<input type='checkbox' name='localidad' value='"+ciudades.indexOf(ciudades[j])+"'></input>";
        contenido += "</div>";
        contenido += "</div>";
        contenido += "<div class='row'><div class='col-lg-12'><img src='img/"+ciudades[j].cIcon+".png'></div></div>";
        contenido += "<div class='row'>";
        contenido += "<div class='col-lg-6 cardP1 temp'>"
        contenido += "<img class='tempIcon' src='img/tempIcono.png'>"
        contenido += "<h3>"+Math.round(kelvinC(ciudades[j].cTemperatura))+"°C / "+Math.round(kelvinF(ciudades[j].cTemperatura))+"°F</h3>"
        contenido += "</div>";
        contenido += "<div class='col-lg-6 cardP1'>"
        contenido += "<img class='tempIcon' src='img/viento.png'>"
        contenido += "<h3>"+Math.round(ciudades[j].cViento)+"Km/h</h3>"
        contenido += "</div>";
        contenido += "</div>";
        contenido += "</div>";
        contenido += "<div class='btnInfo'><button id='btn"+j+"' class='btn btn-primary btnAdd' type='button'>Mas Información</button></div>"
        contenido += "<div id='infoCard"+j+"' class='cardInfo' style='display:none'>"
        contenido += "<div class='row'><h3>Humedad: "+ciudades[j].cHumedad+"%</h3></div>"
        contenido += "<div class='row'><h3>Presion Atmosferica: "+ciudades[j].cPresion+"mbar</h3></div>"
        contenido += "<div class='row'><h3>Salida de sol: "+unixFecha(ciudades[j].cSunIn)+" AM</h3></div>"
        contenido += "<div class='row'><h3>Puesta de sol: "+unixFecha(ciudades[j].cSunOut)+" PM</h3></div>"
        contenido += "</div>"
        contenido += "</div>";
    }

    $("#cardsCity").html(contenido);


    // Acciones que harán los botones que se creen con las tarjetas de información.
    $("#btn0").click(function(){

        $("#infoCard0").toggle();
    
    });
    
    $("#btn1").click(function(){
    
        $("#infoCard1").toggle();
    
    });
    
    $("#btn2").click(function(){
    
        $("#infoCard2").toggle();
    
    });
    
    $("#btn3").click(function(){
    
        $("#infoCard3").toggle();
    
    });
}

// ----------------------------------------------------------------------------------------

// Funciones que trabajan en conjunto para poder recopilar en un nuevo array aquellas ciudades seleccionadas y posteriormente llamar a la funcion borrarCiudad().

$("#btnBorrar").click( function(){
    
    borrarCiudad(getSelectedCheckboxValues('localidad'));
});

function getSelectedCheckboxValues(name) {
    const checkboxes = document.querySelectorAll(`input[name='localidad']:checked`);
    let values = [];
    checkboxes.forEach((checkbox) => {
        values.push(checkbox.value);
    });
    return values;
}

// ----------------------------------------------------------------------------------------

// Funcion que borra las ciudades seleccionadas.
function borrarCiudad(localidad){

    for(let i=0; i<localidad.length; i++){
        
        if(i==0){
            listaCiudades.splice(localidad[i], 1);
        }else{
            listaCiudades.splice(localidad[i]-i, 1);
        }
    }

    localStorageListaCiudad(listaCiudades);

}

// ----------------------------------------------------------------------------------------

// Funcion que convierte la marca de tiempo UNIX a FECHA.

function unixFecha(unixTime){

    var date = new Date(unixTime*1000);

    var fecha=("0"+date.getDate()).slice(-2)+
            "/"+("0"+(date.getMonth()+1)).slice(-2)+
            "/"+date.getFullYear()+
            " || "+("0"+date.getHours()).slice(-2)+
            ":"+("0"+date.getMinutes()).slice(-2);

    return fecha;

}


// ----------------------------------------------------------------------------------------

$("#localidadActual").click(function(){

    navigator.geolocation.getCurrentPosition(onSuccess);

});

function onSuccess(position){
    callCity(position.coords.latitude, position.coords.longitude);
}

function callCity(lat, long){
    let api= `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`;

    $.get(api, function(respuesta, estado){
        if(estado=="success"){
            let misDatos=respuesta;
            agregarCiudad(misDatos);
        }
    });
}