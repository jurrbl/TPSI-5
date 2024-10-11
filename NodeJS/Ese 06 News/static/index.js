window.onload = async function () { 
    let wrapper = $("#wrapper");  // Inizializzazione corretta
    mostraBody(wrapper);  // Passiamo wrapper come argomento
    wrapper.text("")
  };

  async function mostraBody(wrapper) {
    try {
      let elenco = await inviaRichiesta("GET", "/api/elenco");
      if (elenco) {
        
        console.log(elenco);

        elenco.forEach(singleNews => {
          // Creazione dinamica degli elementi con jQuery
          $("<span>").addClass("titolo").text(singleNews.titolo).appendTo(wrapper);
          $("<a>")
            .prop("href", "#")
            .text(" Leggi ")
            .appendTo(wrapper)
            .on("click", async function() {
              // Evita di usare $(this).text(), usa il riferimento corretto
              await mostraTesto(singleNews.file); 
            });

          $("<span>")
            .addClass("nVis")
            .text(" [Visualizzato : " + singleNews.visualizzazioni + " volte]")
            .appendTo(wrapper);

          $("<br>").appendTo(wrapper);  // Aggiungi il br
        });
      }
    } catch (error) {
      console.error("Errore durante il caricamento delle notizie:", error);
    }
  }

  async function mostraTesto(file) {
    try {
      let text = await inviaRichiesta("POST", "/api/dettagli", { file });
      if (text) {
        $("#news").text(text);
       $
        mostraBody();

      }
    } catch (error) {
      console.error("Errore durante il caricamento del testo:", error);
    }

  }
