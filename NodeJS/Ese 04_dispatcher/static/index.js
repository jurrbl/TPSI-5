$(document).ready(function() {

    $("#btnInvia1").on("click", async function() {
        let data = await inviaRichiesta("get", "/api/servizio1", {"nome":"pippo"})
        if (data)
            alert(JSON.stringify(data));
    });

    $("#btnInvia2").on("click", async function() {
        let data = await inviaRichiesta("post", "/api/servizio2", {"nome":"pluto"})
        if (data)
            alert(JSON.stringify(data));
    });
	
});