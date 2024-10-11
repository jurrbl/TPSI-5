let currentNews;

window.onload = async function () {
    let wrapper = $("#wrapper");


        // Recupera le notizie dal server
        let news = await inviaRichiesta("GET", "/api/elenco");

        // Controlla se 'news' è definito e se è un array
        if (news) {
            news.forEach(element => {
                console.log(element.titolo)
            });
        }
        
    
};
