"use strict"

$(document).ready(function(){

    let table = $("#table");
	disegnaTabella()
	
    /* nell' url la risorsa NON deve cominciare con "/" 
	   altrimenti viene vista come url assoluta                  */	   
	function disegnaTabella(){
		table.empty()
		let request = inviaRichiesta("GET", "server/elencoDischi.php");
		request.catch(errore);
		request.then(function(response){
			// const disco = response.data
			// alert(disco);
			for (const disco of response.data) {
				$("<input [type=text]>").val(disco.id)
				.appendTo(table).prop("readonly", true)
				
				$("<input type=text>").val(disco.autore)
				.appendTo(table).on("input", abilita) 
				
				$("<input type=text>").val(disco.titolo)
				.appendTo(table).on("input", abilita)
				
				$("<input type=text>").val(disco.anno)
				.appendTo(table).on("input", abilita)
							
				let btn;
				btn = $("<button disabled>").addClass("btn btn-outline-dark")
				btn.html("salva").appendTo(table).on("click", salva)
				.prop({"discoId": disco.id, "disabled":true})
				
				btn = $("<button disabled>").addClass("btn btn-outline-dark")
				btn.html("annulla").appendTo(table).on("click", annulla)
				.prop({"disco": disco, "disabled":true})
				
				btn = $("<button>").addClass("btn btn-outline-dark");
				btn.html("elimina").appendTo(table).on("click", elimina)
				.prop("discoId", disco.id)
			} 
		})
	}
	
	function abilita(){
		$(this).nextAll("button").eq(0).prop("disabled", false)
		$(this).nextAll("button").eq(1).prop("disabled", false)
	}

	
	function elimina(){
		let param = {"id":$(this).prop("discoId")}
		let request = inviaRichiesta("GET", "server/elimina.php", param);
		request.catch(errore);
		request.then(function(response){	
			console.log(response.data)
			alert("record eliminato correttamente")
			disegnaTabella()
		})	
	}

	
	function annulla(){
		$(this).prevAll("input").eq(2).val($(this).prop("disco").autore)
		$(this).prevAll("input").eq(1).val($(this).prop("disco").titolo)
		$(this).prevAll("input").eq(0).val($(this).prop("disco").anno)
		
		$(this).prop("disabled", true)
		$(this).prev().prop("disabled", true)
	}	


	
	function salva(){
		let disco = {
			"id":$(this).prop("discoId"),
			"autore":$(this).prevAll("input").eq(2).val(),
			"titolo":$(this).prevAll("input").eq(1).val(),
			"anno":$(this).prevAll("input").eq(0).val()
		}
		let request = inviaRichiesta("GET", "server/salva.php", disco);
		request.catch(errore);
		request.then(function(response){
			if(response.data)	{		
				alert("record salvato correttamente")
				disegnaTabella()
			}
			else
				alert("errore salvataggio record")
		})	

	}	
	
})