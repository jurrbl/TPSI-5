let lstCategories;
let mainWrapper;
let btnInvia;
let selectedCheckboxes;
let newFact;
let btnAdd;
let selectedCategory;

window.onload = async function () {
    lstCategories = $("#lstCategories");
    lstCategories.on('change', function() {
        selectedCategory = $(this).val();
        getFactsForCategory(selectedCategory);
    });
    
    // Richiesta per ottenere le categorie
    let categories = await inviaRichiesta("GET", "/api/categories");
    
    if (categories && categories.length > 0) {
        categories.forEach(singleCategory => {
            let option = $("<option>").text(singleCategory).val(singleCategory);
            option.appendTo(lstCategories);
        });

   
        selectedCategory = categories[0];
        getFactsForCategory(selectedCategory);
    }

 
    btnAdd = $("#btnAdd");
    btnAdd.on("click", function() {
        let factText = $("#newFact").val();
        
      
        Send_Fact(selectedCategory, factText);
    });
};


async function getFactsForCategory(selectedCategory) {
    mainWrapper = $("#mainWrapper");
    mainWrapper.html("");

    let facts = await inviaRichiesta("POST", "/api/facts", { selectedCategory });
    if (facts) {
        facts.forEach(singleFact => {
            let input = $("<input>").attr("type", "checkbox").val(singleFact.id);
            let span = $("<span>").text(singleFact.value);
            let br = $("<br>");
            mainWrapper.append(input, span, br);
        });

 
        btnInvia = $("<button>").prop("id", "btnInvia").text("Invia");
        mainWrapper.append(btnInvia);


        btnInvia.on("click", function () {
            selectedCheckboxes = [];
            $("input[type='checkbox']:checked").each(function() {
                selectedCheckboxes.push($(this).val()); 
            });

            console.log(selectedCheckboxes);
            get_Rates(selectedCheckboxes); 
        });
    } else {
        alert('Nessun fatto trovato per questa categoria');
    }
}

// Funzione per inviare le selezioni al server
async function get_Rates(selectedIds) {
    let response = await inviaRichiesta("POST", "/api/rate", { selectedIds });
    console.log("Risposta del server: " + response);
    if(response)
        console.log('Ok');
}

async function Send_Fact(selectedCategory, factValue) {

    let response = await inviaRichiesta("POST", "/api/add", { selectedCategory, factValue });
    if(response)
        console.log(response)
        response.forEach(fact => {
            let checkbox = $("<input>").attr("type", "checkbox").text(fact.id)
            let span = $("<span>").text(fact.value);
            let br = $("<br>")
            mainWrapper.append(checkbox, span, br)
        });
}
