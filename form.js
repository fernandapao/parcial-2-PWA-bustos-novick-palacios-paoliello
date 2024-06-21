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
          option.textContent = Temporada ${temporada};
          temporadaSelect.appendChild(option);
        });
        M.FormSelect.init(temporadaSelect);
      } catch (error) {
        M.toast({html: 'Error al cargar las temporadas', classes: 'toast'});
      }
    }