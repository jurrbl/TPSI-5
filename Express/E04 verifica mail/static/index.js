"use strict"
$(document).ready(function() {
	
	let _login = $("#login")
	let _mail = $("#mail")

	let _username = $("#usr")
	let _password = $("#pwd")
	let _lblErrore = $("#lblErrore")
	let _btnInvia = $("#btnInvia");

	_mail.hide()

    _lblErrore.hide();	
	_lblErrore.children("button").on("click", function(){
		_lblErrore.hide();
	})








});

