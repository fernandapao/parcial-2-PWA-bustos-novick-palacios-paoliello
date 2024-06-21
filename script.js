const URL_EPISODES = "https://api.sampleapis.com/simpsons/episodes";

fetch(URL_EPISODES)
    .then((data) => data.json())
    .then((result) => {
        const results = result.slice(0, 100);
        //console.log(results);

        const listado = document.getElementById("listado_items");

        results.forEach((episode) => {

        });


    });



    const temporadaSelect = document.getElementById("temporada_select");
const episodiosDiv = document.getElementById("listado_items");

// Función para obtener los datos de la API
async function obtenerEpisodios() {
    try {
        const response = await fetch(URL_EPISODES);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener los episodios:", error);
    }
}

// Función para mostrar los episodios según la temporada seleccionada
async function mostrarEpisodiosPorTemporada(temporadaSeleccionada) {
    const episodios = await obtenerEpisodios();
    let episodiosFiltrados = [];

    if (temporadaSeleccionada === "todos") {
        episodiosFiltrados = episodios;
    } else {
        episodiosFiltrados = episodios.filter(episodio => episodio.season == temporadaSeleccionada);
    }

    mostrarEpisodios(episodiosFiltrados);
}

// Función para mostrar los episodios en el HTML
function mostrarEpisodios(episodiosAMostrar) {
    episodiosDiv.innerHTML = "";

    const listado = document.getElementById("listado_items");

    episodiosAMostrar.forEach(episodio => {

        const div = document.createElement("div");

        // Agregar la clase "col-md-4" al elemento <div>
        div.classList.add("col-md-4");
        div.classList.add("col-sm-6");
        div.classList.add("mb-2");

        // Crear el elemento <div> con la clase "card"
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        cardDiv.style.border = "none";
        cardDiv.style.minHeight = "400px";

        // Crear el elemento <img> con las clases necesarias
        const img = document.createElement("img");


        // Verificar si la imagen existe en el origen
        checkImageExists(episodio.thumbnailUrl, function (exists) {
            if (exists) {
                // Si la imagen existe, asignar la URL de la imagen al elemento de imagen
                img.src = episodio.thumbnailUrl;
                //console.log("MOSTRAR ")
            } else {
                // Si la imagen no existe, asignar una imagen de placeholder
                img.src = "img/placeholder_image.jpg";
                //console.log("MOSTRAR 22")
            }
        });


        img.classList.add("card-img-top");
        img.alt = episodio.name;

        // Crear el elemento <div> con la clase "card-body"
        const cardBodyDiv = document.createElement("div");
        cardBodyDiv.classList.add("card-body");

        // Crear el elemento <h2> con la clase "card-title"
        const cardBodyTitle = document.createElement("h2");
        cardBodyTitle.classList.add("card-title");
        cardBodyTitle.textContent = `${episodio.id} - ${episodio.name}`;

        const boton = document.createElement("button");
        boton.type = "button";
        boton.classList.add("btn");
        boton.classList.add("btn-primary");
        boton.classList.add("custom-button");
        boton.setAttribute("data-bs-toggle", "modal");
        boton.setAttribute("data-bs-target", "#exampleModal");
        boton.setAttribute("data-capitulo", `${episodio.id}`);
        boton.textContent = "Ver más";
        boton.style.position = "absolute";
        boton.style.bottom = "20px";

        // Agregar la imagen y el cuerpo de la tarjeta al div de la tarjeta
        cardDiv.appendChild(img);
        cardDiv.appendChild(cardBodyDiv);
        cardBodyDiv.appendChild(cardBodyTitle);
        cardBodyDiv.appendChild(boton);
        // Agregar el div de la tarjeta al elemento <li>
        div.appendChild(cardDiv);

        // Agregar el elemento <div> a la lista
        listado.appendChild(div);

        // Agregar un event listener al botón después de crearlo
        boton.addEventListener("click", function () {
            // Eliminar  clase 'deactivate' al div con id 'contenido'
            document.getElementById("loading").classList.remove("deactivate");

            // Obtén el valor del atributo data-capitulo
            const capitulo = this.getAttribute("data-capitulo");
            //console.log('Capítulo:', capitulo);

            // Almacena el valor de capitulo en localStorage

            //leer detalle en modal
            const URL_CAP =
                "https://api.sampleapis.com/simpsons/episodes/" + capitulo;

            fetch(URL_CAP)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);

                    // Obtener los elementos del modal
                    const titleElement = document.getElementById("titulo");
                    const imgElement = document.getElementById("img");
                    const tempElement = document.getElementById("temporada");
                    const capElement = document.getElementById("episodio");
                    const ratingElement = document.getElementById("rating");
                    const contentElement = document.getElementById("descripcion");


                    // Asignar la información de la API a los elementos del modal
                    titleElement.textContent = data.name;

                    // Verificar si la imagen existe en el origen
                    checkImageExists(data.thumbnailUrl, function (exists) {
                        if (exists) {
                            // Si la imagen existe, asignar la URL de la imagen al elemento de imagen
                            imgElement.src = data.thumbnailUrl;
                            console.log("MOSTRAR ")
                        } else {
                            // Si la imagen no existe, asignar una imagen de placeholder
                            imgElement.src = "img/placeholder_image.jpg";
                            console.log("MOSTRAR 22")
                        }
                    });


                    tempElement.innerHTML =
                        "<strong>Temporada:</strong> " + data.season;
                    capElement.innerHTML = "<strong>Capitulo:</strong> " + data.episode;
                    ratingElement.innerHTML = "<strong>Rating:</strong> " + data.rating;
                    contentElement.textContent = data.description;

                    // Paso 1: Verificar si ya existe un array en el localStorage
                    let dataArray = JSON.parse(localStorage.getItem("myDataArray"));

                    // Paso 2: Si no existe, crear un nuevo array
                    if (!dataArray) {
                        dataArray = [];
                    }

                    // Paso 3: Realizar operaciones en el array (por ejemplo, agregar un nuevo elemento)
                    dataArray.push({ id: data.id, name: data.name });

                    // Paso 4: Guardar el array actualizado en el localStorage
                    localStorage.setItem("myDataArray", JSON.stringify(dataArray));

                    // Agregar clase 'placeholder' después de cierto tiempo
                    setTimeout(function () {
                        document.getElementById("loading").classList.add("deactivate");
                        //document.getElementById('loading').classList.remove('deactivate');
                    }, 1000); // Change 3000 to the desired delay in milliseconds
                });
        });


    });
}

// Event listener para cambios en la selección de temporada
temporadaSelect.addEventListener("change", function () {
    mostrarEpisodiosPorTemporada(temporadaSelect.value);
});

// Mostrar todos los episodios al cargar la página
mostrarEpisodiosPorTemporada("todos");

/*******/

// Capturando el botón y el elemento ul
const btnMostrarHistorial = document.getElementById("mostrarHistorial");
const ulListado = document.getElementById("capitulos_vistos");

// Añadiendo un event listener al botón para capturar el click
btnMostrarHistorial.addEventListener("click", function () {
    // Paso 1: Cargar el array del localStorage
    let dataArray = JSON.parse(localStorage.getItem("myDataArray"));

    // Paso 2: Verificar si el array se ha cargado correctamente
    if (dataArray) {
        document.getElementById("resultado").textContent = dataArray.length;

        // Paso 3: Ordenar el array en orden inverso (de último a primero)
        dataArray.reverse();

        // Paso 4: Limpiar el contenido previo del ul
        ulListado.innerHTML = "";

        // Paso 5: Recorrer el array y crear elementos li para cada elemento
        dataArray.forEach(function (element) {
            const li = document.createElement("li");
            //li.textContent = JSON.stringify(element); // Convertir el elemento a texto
            li.textContent = element.id + ") " + element.name;
            ulListado.appendChild(li); // Agregar el elemento li al ul
        });
    } else {
        document.getElementById("resultado").textContent = 0;
        ulListado.innerHTML = "<li>No hay datos en el historial</li>";
    }
});

//Borrar el historial de la modal
document.getElementById('vaciarLocalStorage').addEventListener('click', function () {
    // Vaciar localStorage
    localStorage.clear();
    alert('Está seguro que quiere borrar los datos?');
});




function checkImageExists(url, callback) {
    var img = new Image();
    img.onload = function () {
        callback(true);
    };
    img.onerror = function () {
        callback(false);
    };
    img.src = url;
}

//--------------------------------------------------------Service Worker
if (navigator.serviceWorker){
    navigator.serviceWorker.register('./sw.js')
    .then(() => {
        console.log("registrado");
    })
    .catch(() => {
        console.error("falló");
    });
}



//--------------------------------------------------------Index db
const db = new Dexie("Visitas");

const dbVersion = db.version(1).stores({
    usuarios: "++id, date"
});

const mostrarLista = (usuarios) => {
    const lista = document.getElementById('lista');
    logs.forEach(log => {
        lista.innerHTML += `<li>${new Date(log.date).toISOString()}</li>`
    });
}

db.usuarios
    .add({
        date: new Date().getTime()
    })
    .then(() => db.usuarios
            .where('date')
            .below(new Date(2024, 4, 21).getTime())
            .toArray()
    )
    .then((usuarios) => {
        mostrarLista(usuarios)
    })



     //instalacion

     let eventoDeInstalacion = null;

     // Escucha el evento 'beforeinstallprompt'
     window.addEventListener("beforeinstallprompt", (e) => {
         console.log("beforeinstallprompt", e);
         eventoDeInstalacion = e;
     });
     
     // Manejador para el botón de instalación
     const installButton = document.getElementById("installButton");
     installButton.addEventListener("click", () => {
         console.log("eventoDeInstalacion", eventoDeInstalacion);
         
         // Verifica si el evento de instalación está disponible y puede ser activado
         if (eventoDeInstalacion && eventoDeInstalacion.prompt) {
             eventoDeInstalacion.prompt()
             .then((resultado) => {
                 const opcionesElegida = resultado.outcome;
                 console.log("opcionesElegida", opcionesElegida);
                 
                 // Maneja las opciones elegidas por el usuario
                 if (opcionesElegida === "dismissed") {
                     console.log("Instalación cancelada");
                 } else if (opcionesElegida === "accepted") {
                     console.log("Instalación completa");
                     ocultarBotonInstalacion();
                 }
             })
             .catch((error) => console.log("Error al intentar instalar"));
         }
     });
     
     // Oculta el botón de instalación
     const ocultarBotonInstalacion = () => {
         installButton.style.display = "none";
     };
     
     
     
     
     
     document.addEventListener("DOMContentLoaded", () => {
         const toastOnline = document.querySelector('.toast-online');
         const toastOffline = document.querySelector('.toast-offline');
     
         const bsToastOnline = new bootstrap.Toast(toastOnline);
         const bsToastOffline = new bootstrap.Toast(toastOffline);
     
         // Mostrar el toast cuando esté online
         window.addEventListener('online', () => {
             bsToastOffline.hide();
             bsToastOnline.show();
         });
     
         // Mostrar el toast cuando esté offline
         window.addEventListener('offline', () => {
             bsToastOnline.hide();
             bsToastOffline.show();
         });
     
         // Verificar el estado inicial
         if (navigator.onLine) {
             bsToastOffline.hide();
             bsToastOnline.show();
         } else {
             bsToastOnline.hide();
             bsToastOffline.show();
         }
     });
     