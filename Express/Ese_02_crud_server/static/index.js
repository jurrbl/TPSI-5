"use strict"
let currentCollection = "";

$(document).ready(function() {
    let divIntestazione = $("#divIntestazione")
    let divFilters = $(".card").eq(0)
    let divCollections = $("#divCollections")
    let table = $("#mainTable")
    let divDettagli = $("#divDettagli")
    let btnAdd = $("#btnAdd").prop("disabled",true);
    currentCollection = "";
    let lstHair = $("#lstHair")


    divFilters.hide()
	$("#lstHair").prop("selectedIndex", -1);
    
	getCollections();

    async function getCollections(){
        let data = await inviaRichiesta("GET","/api/getCollections")
        if(data)
            {
                console.log(data)
                let label  = divCollections.children('label')
                for (const collection of data) {
                    const clonedLabel = label.clone().appendTo(divCollections)
                    clonedLabel.children('span').text(collection.name)
                    clonedLabel.children('input').val(collection.name).on("click",function(){
                        currentCollection = this.value;
                        btnAdd.prop("disabled",false)
                        getDataCollection();
                    })
                }
                label.remove();
            }
    }

    async function deleteRecord(id) {

        const data = await inviaRichiesta("DELETE", `/api/${currentCollection}/${id}`);
        if(data)
        {
            console.log(data)
            alert('Record rimosso correttamente')
            getDataCollection()
        }
    }

    async function updateRecord(id){
        divDettagli.empty()
        $("<textarea>").appendTo(divDettagli).prop("placeholder", '{"Name": "Pippo"}')
        $("<button>").appendTo(divDettagli).text("Aggiungi").addClass("btn btn-success btn-sm").on("click",async function(){
            let record = divDettagli.children("textarea").val()
            try {
                record = JSON.parse(record)
                let data = await inviaRichiesta("POST",`/api/${currentCollection}`,record)
                if(data)
                    {
                        console.log(data)
                        alert("Record inserito correttamente")
                        getDataCollection();
                    }
            } catch (error) {
                alert("JSON non valido\n"+error)
                return
            }
        })
    }
    
	


    async function getDataCollection(filter = {}){
        divDettagli.empty()
        const data = await inviaRichiesta("GET",`/api/${currentCollection}`,filter)
        if(data)
            {
                console.log(data)
                divIntestazione.find('strong').eq(0).text(currentCollection)
                divIntestazione.find('strong').eq(1).text(data.length)
                let tbody = table.children("tbody")
                tbody.empty()
                data.forEach((element,i) => {
                    let tr = $("<tr>").appendTo(tbody)
                    $("<td>").appendTo(tr).text(element["_id"]).on("click",function(){showDetails(element["_id"])})
                    let key = Object.keys(element)[1]
                    $("<td>").appendTo(tr).text(element[key]).on("click",function(){showDetails(element["_id"])})
                    let td = $("<td>").appendTo(tr)
                    $("<div>").appendTo(td).on("click", function()
                    {
                        updateRecord(element["_id"])
                    })
                    $("<div>").appendTo(td)
                    $("<div>").appendTo(td).on("click",function()
                    {
                        deleteRecord(element["_id"]);
                    })
                });
                if(currentCollection == 'unicorns')
                    {
                        divFilters.show()
                    }
                else{
                    divFilters.hide()
                    divFilters.find("input:checkbox").prop("checked",false)
                    lstHair.prop("selectedIndex",-1)
                }
            }
    }


    $("#btnFind").on("click",function(){
        let hair = lstHair.val();
        let gender = "";
        if(divFilters.find("input:checkbox:checked").length == 1)
            {
                gender = divFilters.find("input:checkbox:checked").val()
            }
        let filters = {}
        if(hair)
            {
                filters["hair"] = hair.toLowerCase()
            }
        if(gender)
            {
                filters["gender"] = gender.toLowerCase()
            }
            getDataCollection(filters)
    })

    btnAdd.on("click",function(){
        divDettagli.empty()
        $("<textarea>").appendTo(divDettagli).prop("placeholder", '{"Name": "Pippo"}')
        $("<button>").appendTo(divDettagli).text("Aggiungi").addClass("btn btn-success btn-sm").on("click",async function(){
            let record = divDettagli.children("textarea").val()
            try {
                record = JSON.parse(record)
                let data = await inviaRichiesta("POST",`/api/${currentCollection}`,record)
                if(data)
                    {
                        console.log(data)
                        alert("Record inserito correttamente")
                        getDataCollection();
                    }
            } catch (error) {
                alert("JSON non valido\n"+error)
                return
            }
        })
    })
    async function showDetails(id){
        let data = await inviaRichiesta("GET",`/api/${currentCollection}/${id}`)
        if(data)
        {
            console.log(data)
            divDettagli.empty()
            for (const key in data) {
                $("<strong>").appendTo(divDettagli).text(`${key}:`)
                $("<span>").appendTo(divDettagli).text(`${JSON.stringify(data[key])}`)
                $("<br>").appendTo(divDettagli)
            }
        }
    }
	
});

