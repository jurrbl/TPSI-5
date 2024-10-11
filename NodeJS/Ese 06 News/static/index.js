let currentNews;
let wrapper;
window.onload = async function () {

    wrapper = $("#wrapper");

    let elenco = await inviaRichiesta("GET", "/api/elenco")
    if(elenco)
        console.log(elenco)

    elenco.forEach(singleNews => {
        $("<span>").addClass("titolo").text(singleNews.titolo).appendTo(wrapper)
        $("<a>").prop("href", "#").text(" Leggi ").appendTo(wrapper)
        .on("click", async function()
        {
            let selectedNews = $(this).text();
            
           /*  let news = await inviaRichiesta("POST", "/api/dettagli", {'file' : singleNews.file})
            if(news)
                console.log(JSON.stringify(news)) */

        })
        $("<span>").addClass("nVis").text(" [Visualizzato : " + singleNews.visualizzazioni + " volte]").appendTo(wrapper)
        $("<br>").appendTo(wrapper)
    });

};
