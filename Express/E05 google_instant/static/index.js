'use strict';
let Username;
let Password;

let UsernameRegister;
let PasswordRegister;
let ImmagineProfiloRegister;

$(document).ready(function () {
  /* ***************** SEZIONE 1 ************************ */
  let _btnAccedi = $("#btnAccedi");
  let _btnRegistrati = $("#btnRegistrati");
  let _divAccedi = $("#divAccedi").hide();
  let _divRegistrati = $("#divRegistrati").hide();
  let _imgProfilo = $("#imgProfilo").hide();

  function handleCancel() {
    _divAccedi.hide();
    _divRegistrati.hide();
  }

  _btnAccedi.on("click", async function () {
    _divRegistrati.hide();
    _divAccedi.toggle();

    $("#btnAnnulla").on("click", handleCancel);
  });

  $("#btnOk").on("click", async function () {
    Username = $("#username").val();
    Password = $("#password").val();

    console.log(Username, Password);

    const request = await inviaRichiesta("POST", "/api/login", {
      username: Username,
      password: Password,
    });
    if (request.status == 200) {
      _btnAccedi.hide();
      _imgProfilo.show();
      _imgProfilo.prop("src", `img/${Username}.jpg`);
      _divAccedi.hide();
    }
  });

  _btnRegistrati.on("click", function () {
    _divAccedi.hide();
    _divRegistrati.toggle();

    $("#btnOkRegister").on("click", async function () {
      UsernameRegister = $("#usernameRegister").val();
      PasswordRegister = $("#passwordRegister").val();
      ImmagineProfiloRegister = $("#imgProfiloFile").prop("files")[0];

      if (!UsernameRegister || !PasswordRegister || !ImmagineProfiloRegister) {
        alert("Compila tutti i campi!");
        return;
      }

      let formData = new FormData();
      formData.append("username", UsernameRegister);
      formData.append("password", PasswordRegister);
      formData.append("img", ImmagineProfiloRegister);

      const request = await inviaRichiesta("POST", "/api/register", formData);

      if (request.status == 200) {
        alert("Registrazione avvenuta con successo");
        _divRegistrati.hide();
      } else if (request.status == 422) {
        alert("Username già esistente");
      }
    });

    $("#btnAnnulla").on("click", handleCancel);
  });

  $("#txtRicerca").on("keyup", async function () {
    let txtRicerca = $("#txtRicerca").val().trim();
    if (txtRicerca) {
      try {
        const url = `/api/ricerca?ricerca=${txtRicerca.split(' ').join('+')}`;
        const request = await inviaRichiesta("GET", url);

        if (request.status === 200) {
          let lstSuggerimenti = $("#lstSuggerimenti");
          lstSuggerimenti.empty().show();

          // Aggiungi opzioni dinamiche con evento click
          for (let voce of request.data.voci) {
            $("<option>")
              .text(voce.voci.join(", "))
              .val(voce._id)
              .appendTo(lstSuggerimenti)
              .on("click", async function () {
                // Copia la voce selezionata nel campo di ricerca
                $("#txtRicerca").val($(this).text());

                // Nasconde il ListBox
                lstSuggerimenti.hide();

                // Mostra il contenitore divLink
                $("#divLink").show();

                // Invio della richiesta PATCH al server per incrementare nClick
                try {
                  const patchRequest = await inviaRichiesta("PATCH", "/api/click", {
                    id: $(this).val(),
                  });

                  if (patchRequest.status === 200) {
                    // Visualizza i dati ricevuti nel divLink
                    let divLink = $("#divLink");
                    divLink.empty(); // Svuota il contenitore
                    for (let link of patchRequest.data.links) {
                      $("<p>").text(link.description).appendTo(divLink);
                      $("<a>")
                        .attr("href", link.url)
                        .attr("target", "_blank")
                        .text(link.url)
                        .appendTo(divLink);
                    }
                  }
                } catch (err) {
                  console.error("Errore durante la richiesta PATCH:", err);
                }
              });
          }
        }
      } catch (err) {
        console.error("Errore durante la ricerca:", err);
      }
    } else {
      // Nascondi suggerimenti se il campo è vuoto
      $("#lstSuggerimenti").empty().hide();
    }
  });
});
