$(document).ready(function() {

    $("#btnInvia1").on("click", async function() {
        let data = await inviaRichiesta("get", "/api/servizio1", {"nome":"pippo"})
		console.log(data)
		if (data) {
			alert ("ok")
		}
    });

    $("#btnInvia2").on("click", async function() {
        let data = await inviaRichiesta("post", "/api/servizio2", {"nome":"pluto"})
		console.log(data)
		if (data) {
			alert ("ok")
		}
    });
	
});