let currentNews;

window.onload = async function () {
    let wrapper = $("#wrapper");


        // Recupera le notizie dal server
        let news = await inviaRichiesta("GET", "/api/elenco");

        // Controlla se 'news' è definito e se è un array
        if (news) {

            news.forEach(singleNews => {
                let singleParsedNews = JSON.parse(singleNews)
                console.log(singleParsedNews)
                currentNews = $(this).text();
                let paragraph = `
                    <span class="titolo">${singleParsedNews.titolo}</span> <!-- Usa 'titolo' come proprietà -->
                    <a href="#" onclick="showDetails(${currentNews})">Leggi</a>
                    <span class="nVis">[visualizzato ${singleParsedNews.visualizzazioni} volte]</span> <!-- Assicurati che 'visualizzazioni' esista -->
                    <br>
                `;

                wrapper.append(paragraph)
            });
        }
        
    
};

async function showDetails(fileName) {
    try {
        let details = await inviaRichiesta("GET", "/api/dettagli", { file: fileName });
        console.log("Dettagli ricevuti:", details);
        // Aggiungi logica per mostrare i dettagli nella tua UI
    } catch (error) {
        console.error("Errore durante il recupero dei dettagli:", error);
    }
}
