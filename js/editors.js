editors = [];

editors["Point"] = function (name, target) {
	var x = target.value["X"].value;
	var y = target.value["Y"].value;

	var editform = "<div>X: <span id='x'>" + x + "</span>" +
		"<input id='editx' type='number' min='0' max='255' style='display: none;' /><br />" +
		"Y: <span id='y'>" + y + "</span>" +
		"<input id='edity' type='number' min='0' max='255' style='display: none;' />";

	var div = $(document.createElement("div")).attr("id", name + "_editor");
	div.append($.parseHTML(editform));

	$(div).find("#editx").focusout(function () { $(this).hide(); $(this).siblings("#x").show().text($(this).val()); });
	$(div).find("#x").click(function () { $(this).hide(); $(this).siblings("#editx").show().val($(this).text()).focus(); });

	$(div).find("#edity").focusout(function () { $(this).hide(); $(this).siblings("#y").show().text($(this).val()); });
	$(div).find("#y").click(function () { $(this).hide(); $(this).siblings("#edity").show().val($(this).text()).focus(); });

	$(div).dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			Ok: function () {
				target.value["X"].value = $(this).find("#x").text();
				target.value["Y"].value = $(this).find("#y").text();
				$(this).dialog("close");
			},
			Cancel: function () {
				$(this).dialog("close");
			}
		},
	});
	$(div).dialog("open");
}

editors["Size"] = function (name, target) {
	var x = target.value["CX"].value;
	var y = target.value["CY"].value;

	var editform = "<div>X: <span id='x'>" + x + "</span>" +
		"<input id='editx' type='number' min='0' max='255' style='display: none;' /><br />" +
		"Y: <span id='y'>" + y + "</span>" +
		"<input id='edity' type='number' min='0' max='255' style='display: none;' />";

	var div = $(document.createElement("div")).attr("id", name + "_editor");
	div.append($.parseHTML(editform));

	$(div).find("#editx").focusout(function () { $(this).hide(); $(this).siblings("#x").show().text($(this).val()); });
	$(div).find("#x").click(function () { $(this).hide(); $(this).siblings("#editx").show().val($(this).text()).focus(); });

	$(div).find("#edity").focusout(function () { $(this).hide(); $(this).siblings("#y").show().text($(this).val()); });
	$(div).find("#y").click(function () { $(this).hide(); $(this).siblings("#edity").show().val($(this).text()).focus(); });

	$(div).dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			Ok: function () {
				target.value["CX"].value = $(this).find("#x").text();
				target.value["CY"].value = $(this).find("#y").text();
				$(this).dialog("close");
			},
			Cancel: function () {
				$(this).dialog("close");
			}
		},
	});
	$(div).dialog("open");
}

editors["string"] = function (name, target) {
	var str = target.value;

	var div = $(document.createElement("div")).attr("id", name + "_editor");

	var form = "<div id='strform'><span id='strlabel'>" + name + ": <span id='str'>" + str + "</span></span><input id='stredit' type='text' style='display: none;' /><br /></div>";
	$(div).append($.parseHTML(form));

	$(div).find("#stredit").focusout(function (property) {
		$(this).hide(); $(this).parent().find("#str").show().text($(this).val());
	});
	$(div).find("#strlabel").click({ property: property }, function (property) {
		$(this).find("#str").hide();
		$(this).siblings("#stredit").show().val($(this).find("#str").text()).focus();
	});

	$(div).dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			Ok: function () {
				target.value = $(this).find("#str").text();
				$(this).dialog("close");
			},
			Cancel: function () {
				$(this).dialog("close");
			}
		},
	});
	$(div).dialog("open");
}

editors["RGB"] = function (name, target) {
	var r = target.value["R"].value;
	var g = target.value["R"].value;
	var b = target.value["B"].value;
	var alpha = target.value["Alpha"].value;

	var editform = "<div>Alpha: <span id='alpha'>" + alpha + "</span>" +
		"<input id='editalpha' type='number' min='0' max='255' style='display: none;' /><br />" +
		"R: <span id='r'>" + r + "</span>" +
		"<input id='editr' type='number' min='0' max='255' style='display: none;' /><br />" +
		"G: <span id='g'>" + g + "</span>" +
		"<input id='editg' type='number' min='0' max='255' style='display: none;' /><br />" +
		"B: <span id='b'>" + b + "</span>" +
		"<input id='editb' type='number' min='0' max='255' style='display: none;' />";

	var div = $(document.createElement("div")).attr("id", name + "_editor");
	div.append($.parseHTML(editform));

	$(div).find("#editalpha").focusout(function () { $(this).hide(); $(this).siblings("#alpha").show().text($(this).val()); });
	$(div).find("#alpha").click(function () { $(this).hide(); $(this).siblings("#editalpha").show().val($(this).text()).focus(); });

	$(div).find("#editr").focusout(function () { $(this).hide(); $(this).siblings("#r").show().text($(this).val()); });
	$(div).find("#r").click(function () { $(this).hide(); $(this).siblings("#editr").show().val($(this).text()).focus(); });

	$(div).find("#editg").focusout(function () { $(this).hide(); $(this).siblings("#g").show().text($(this).val()); });
	$(div).find("#g").click(function () { $(this).hide(); $(this).siblings("#editg").show().val($(this).text()).focus(); });

	$(div).find("#editb").focusout(function () { $(this).hide(); $(this).siblings("#b").show().text($(this).val()); });
	$(div).find("#b").click(function () { $(this).hide(); $(this).siblings("#editb").show().val($(this).text()).focus(); });

	$(div).dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			Ok: function () {
				target.value["Alpha"].value = $(this).find("#alpha").text();
				target.value["R"].value = $(this).find("#r").text();
				target.value["G"].value = $(this).find("#g").text();
				target.value["B"].value = $(this).find("#b").text();
				$(this).dialog("close");
			},
			Cancel: function () {
				$(this).dialog("close");
			}
		},
	});
	$(div).dialog("open");
}

editors["int"] = function (name, target) {
	var str = target.value;

	var editform = "<div id='intform'>" + name + ": <span id='int'>" + str + "</span>" +
		"<input id='editint' type='text' style='display: none;' /></div>";

	var div = $(document.createElement("div")).attr("id", name + "_editor");
	div.append($.parseHTML(editform));

	$(div).find("#editint").focusout(function () { $(this).hide(); $(this).siblings("#int").show().text($(this).val()); });
	$(div).find("#intform").click(function () { $(this).find("#int").hide(); $(this).find("#editint").show().val($(this).find("#int").text()).focus(); });

	$(div).dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			Ok: function () {
				target.value = $(this).find("#int").text();
				$(this).dialog("close");
			},
			Cancel: function () {
				$(this).dialog("close");
			}
		},
	});
	$(div).dialog("open");
}

editors["boolean"] = function (name, target) {
	var str = target.value;

	var editform = "<div>" + name + "<input id='editbool' type='checkbox' " + 
	 ((target.value == true) ? "checked" : "") + "/></div>";

	var div = $(document.createElement("div")).attr("id", name + "_editor");
	div.append($.parseHTML(editform));

	$(div).dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			Ok: function () {
				target.value = $(this).find("#editbool").prop("checked");
				$(this).dialog("close");
			},
			Cancel: function () {
				$(this).dialog("close");
			}
		},
	});
	$(div).dialog("open");
}

editors["Frame"] = function (name, target) {
	// Add a select to choose the element to view.
	var frameselector = $(document.createElement("div")).attr("id", "frameselector")
		.append($(document.createElement("select")));

	// Populate the list
	var select = $(frameselector).find("select");
	for (var frame in target.value) {
		$(select).append($(document.createElement("option")).val(frame).text(frame));
	}

	var div = $(document.createElement("div")).attr("id", name + "_editor");
	$(div).append(frameselector);

	var currentframe = 0;

	for (var property in target.value[currentframe]) {
		var form = "<div id='" + property + "form'><span id='" + property + "label'>" + property +
			": <span id='" + property + "'/></span><input id='edit" + property + "' type='text' style='display: none;' /><br /></div>";
		$(div).append($.parseHTML(form));

		$(div).find("#edit" + property).focusout({ property: property }, function (property) {
			$(this).hide(); $(this).parent().find("#" + property.data.property).show().text($(this).val());
		});
		$(div).find("#" + property + "label").click({ property: property }, function (property) {
			$(this).find("#" + property.data.property).hide();
			$(this).siblings("#edit" + property.data.property).show().val($(this).find("#" + property.data.property).text()).focus();
		});
	}

	$(div).find("#frameselector").change(
		function () {
			currentframe = $(div).find("#frameselector > select option:selected").val()
			for (var property in target.value[currentframe]) {
				$(div).find("#" + property).text(target.value[currentframe][property].value);
			}
		});
	
	$(div).find("#frameselector").change();

	$(div).dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			Ok: function () {
				target.value[currentframe]["Texture"].value = $(this).find("#Texture").text();
				$(this).dialog("close");
			},
			Cancel: function () {
				$(this).dialog("close");
			}
		},
	});
	$(div).dialog("open");
}
