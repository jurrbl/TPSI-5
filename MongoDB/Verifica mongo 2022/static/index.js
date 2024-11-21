"use strict";
let lstClasses;
let btnFind;

$(document).ready(function () {
  getClasses();

  btnFind = $("#btnFind"); // Assumendo che il pulsante abbia ID "btnFind"

  btnFind.click(function () {
    // Raccogli i filtri selezionati
    const selectedClasses = lstClasses.val(); // Ottieni la classe selezionata (supponendo un elemento select con ID lstClasses)

    const genders = [];
    $("input[type=checkbox]:checked").each(function () {
      genders.push($(this).val()); // Raccogli i valori delle checkbox selezionate
    });

  
    if (genders.length === 0) {
      alert("Seleziona almeno un genere."); 
      return;
    }

  
    if (!selectedClasses) {
      alert("Seleziona una classe.");
      return;
    }

    // Se tutto è OK, invia la richiesta
    console.log("Classi selezionate:", selectedClasses);
    console.log("Generi selezionati:", genders);
    getValutazioni(selectedClasses, genders[0]);
  });
});

async function getClasses() {
  const data = await inviaRichiesta("GET", "/api/getClasses");
  if (data) {
    console.log(data);

    lstClasses = $("#lstClasses");
    data.forEach((element) => {
      lstClasses.append(
        "<option value='" + element.classe + "'>" + element.classe + "</option>"
      );
    });
  }
}

async function getValutazioni(classes, genders) {
  const data = await inviaRichiesta("GET", "/api/getValutazioni", {
    classe: classes, 
    genere: genders, 
  });

  if (data) {
    console.log("Risultati ricevuti:", data);

    const tableBody = $("#tbodyValutazioni");
    tableBody.empty();

    data.forEach((element) => {
      const row = `
        <tr>
          <td>${element.nome}</td>
          <td>${element.valutazioni[0].voto}</td>
          <td>${element.valutazioni[1].voto}</td>
          <td>${element.valutazioni[2].voto}</td>
          <td>${element.valutazioni[3].voto}</td>
        </tr>
      `;
      tableBody.append(row);

    });

  }

}
