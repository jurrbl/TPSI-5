"use strict";
$(document).ready(function () {
    let _login = $("#login");
    let _mail = $("#mail");

    let _username = $("#usr");
    let _password = $("#pwd");
    let _lblErrore = $("#lblErrore");
    let _btnInvia = $("#btnInvia");

    let txtTo = $("#txtTo");
    let txtSubject = $("#txtSubject");
    let txtMessage = $("#txtMessage");
    let txtAttachment = $("#txtAttachment");

    let Username = "";
    let Password = "";

    _mail.hide();
    _lblErrore.hide();

    _lblErrore.children("button").on("click", function () {
        _lblErrore.hide();
    });

    // Login logic
    $("#btnLogin").on("click", async function () {
        Username = _username.val();
        Password = _password.val();

        if (Username === "" || Password === "") {
            alert("Inserire Username e Password");
            return;
        }

        const request = await inviaRichiesta("POST", "/api/login", {
            username: Username,
            password: Password,
        });

        if (request.status === 200) {
            console.log(request.data);
            _login.hide();
            _mail.show();

            // Popola la tabella
            getTableBody();
        } else {
            alert("Login fallito, controllare username e password.");
        }
    });

    // Send mail logic
    $("#btnInvia").on("click", async function () {
        let To = txtTo.val();
        let Subject = txtSubject.val();
        let Message = txtMessage.val();
        let Attachment = txtAttachment.prop("files")[0]; // File selezionato

        if (To === "" || Subject === "" || Message === "") {
            alert("Inserire i campi obbligatori");
            return;
        }

        try {
            let formData = new FormData();
            formData.append("from", Username); // Mittente
            formData.append("to", To);
            formData.append("subject", Subject);
            formData.append("body", Message);
            if (Attachment) {
                formData.append("attachment", Attachment); // Aggiunge l'allegato solo se presente
            }

            const request2 = await inviaRichiesta("POST", "/api/sendMail", formData, true);

            if (request2.status === 200) {
                alert("Mail inviata correttamente");

                // Aggiorna la tabella
                getTableBody();

                // Pulisce i campi di input
                txtTo.val("");
                txtSubject.val("");
                txtMessage.val("");
                txtAttachment.val("");
            } else if (request2.status === 503) {
                alert("Destinatario non valido");
            } else {
                alert("Errore durante l'invio della mail.");
            }
        } catch (err) {
            console.error("Errore:", err);
            alert("Errore imprevisto durante l'invio della mail.");
        }
    });

    // Funzione per ottenere e aggiornare la tabella
    async function getTableBody() {
        const request = await inviaRichiesta("POST", "/api/login", {
            username: Username,
            password: Password,
        });

        if (request.status === 200) {
			console.log(request.data);
            let mailArray = request.data.mail.reverse();
            let tbody = $("#tbody");
            tbody.empty();

            mailArray.forEach((element) => {
                let tr = $("<tr>");
                let td1 = $("<td>").text(element.from); // Mittente
                let td2 = $("<td>").text(element.subject); // Oggetto
                let td3 = $("<td>").text(element.body); // Contenuto
                let td4;

                if (element.attachment && element.attachment !== "") {
                    td4 = $("<td>").html(
                        `<a href="img/${element.attachment}" target="_blank">${element.attachment}</a>`
                    );
                } else {
                    td4 = $("<td>").text("Nessun allegato");
                }

                tr.append(td1, td2, td3, td4);
                tbody.append(tr);
            });
        } else {
            alert("Errore durante il recupero delle mail.");
        }
    }
});
