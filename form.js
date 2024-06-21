let episodios = [];

    // Función para cargar las temporadas desde la API
    async function cargarTemporadas() {
      try {
        const response = await fetch('https://api.sampleapis.com/simpsons/episodes');
        episodios = await response.json();
        const temporadas = [...new Set(episodios.map(episodio => episodio.season))]; // Obtener temporadas únicas
        const temporadaSelect = document.getElementById('temporada');
        temporadaSelect.innerHTML = '<option value="">Seleccione una temporada</option>';
        temporadas.forEach(temporada => {
          const option = document.createElement('option');
          option.value = temporada;
          option.textContent = Temporada `${temporada}`;
          temporadaSelect.appendChild(option);
        });
        M.FormSelect.init(temporadaSelect);
      } catch (error) {
        M.toast({html: 'Error al cargar las temporadas', classes: 'toast'});
      }
    }

    // Función para cargar los capítulos según la temporada seleccionada
    function cargarCapitulos() {
      const temporadaSeleccionada = document.getElementById('temporada').value;
      const capituloSelect = document.getElementById('capitulo');
      capituloSelect.innerHTML = '<option value="">Seleccione un capítulo</option>';

      if (temporadaSeleccionada !== '') {
        const capitulos = episodios.filter(episodio => episodio.season === parseInt(temporadaSeleccionada, 10));
        capitulos.forEach(capitulo => {
          const option = document.createElement('option');
          option.value = capitulo.id;
          option.textContent = `${capitulo.name}`; 
          capituloSelect.appendChild(option);
        });
        M.FormSelect.init(capituloSelect);
      }
    }


    // Modificar la función de enviar solicitud para incluir el mensaje
document.getElementById('solicitudForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const temporada = document.getElementById('temporada').value;
  const capitulo = document.getElementById('capitulo').value;

  const data = { nombre, email, temporada, capitulo };

  try {
    const response = await fetch('https://api.sampleapis.com/simpsons/episodes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      // Mostrar mensaje de éxito con los datos seleccionados
      mostrarMensajeExito(temporada, capitulo);

      // Limpiar el formulario después del envío exitoso
      document.getElementById('solicitudForm').reset();

      // Ocultar el formulario después del envío exitoso
      document.getElementById('solicitudForm').style.display = 'none';

      // Mostrar el mensaje de éxito
      document.getElementById('mensajeExito').style.display = 'block';
    } else {
      throw new Error('Error en el envío');
    }
  } catch (error) {
    M.toast({html: 'no se envia', classes: 'toast'});
  }
});