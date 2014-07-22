editors = [];

editors["Point"] = function (name, target) {
	var x = target.value["X"].value;
	var y = target.value["Y"].value;

	var editform = "<div>X: <span id='x'>" + x.value + "</span>" +
		"<input id='editx' type='number' min='0' max='255' style='display: none;' /><br />" +
		"Y: <span id='y'>" + y.value + "</span>" +
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
				target.value["X"].value.value = $(this).find("#x").text();
				target.value["Y"].value.value = $(this).find("#y").text();
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

	var editform = "<div>X: <span id='x'>" + x.value + "</span>" +
		"<input id='editx' type='number' min='0' max='255' style='display: none;' /><br />" +
		"Y: <span id='y'>" + y.value + "</span>" +
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
				target.value["CX"].value.value = $(this).find("#x").text();
				target.value["CY"].value.value = $(this).find("#y").text();
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
	if (target.value.value) {
		var str = target.value.value;
	} else {
		var str = target.value;
	}

	var editform = "<div id='strform'>" + name + ": <span id='str'>" + str + "</span>" +
		"<input id='editstr' type='text' style='display: none;' /><br /></div>";

	var div = $(document.createElement("div")).attr("id", name + "_editor");
	div.append($.parseHTML(editform));

	$(div).find("#editstr").focusout(function () { $(this).hide(); $(this).siblings("#str").show().text($(this).val()); });
	$(div).find("#strform").click(function () { $(this).find("#str").hide(); $(this).find("#editstr").show().val($(this).find("#str").text()).focus(); });

	$(div).dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			Ok: function () {
				target.value.value = $(this).find("#str").text();
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

	var editform = "<div>Alpha: <span id='alpha'>" + alpha.value + "</span>" +
		"<input id='editalpha' type='number' min='0' max='255' style='display: none;' /><br />" +
		"R: <span id='r'>" + r.value + "</span>" +
		"<input id='editr' type='number' min='0' max='255' style='display: none;' /><br />" +
		"G: <span id='g'>" + g.value + "</span>" +
		"<input id='editg' type='number' min='0' max='255' style='display: none;' /><br />" +
		"B: <span id='b'>" + b.value + "</span>" +
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
				target.value["Alpha"].value.value = $(this).find("#alpha").text();
				target.value["R"].value.value = $(this).find("#r").text();
				target.value["G"].value.value = $(this).find("#g").text();
				target.value["B"].value.value = $(this).find("#B").text();
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
	var str = target.value.value;

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
				target.value.value = $(this).find("#int").text();
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
	var str = target.value.value;

	var editform = "<div>" + name + "<input id='editbool' type='checkbox' " + 
	 ((target.value.value == true) ? "checked" : "") + "/></div>";

	var div = $(document.createElement("div")).attr("id", name + "_editor");
	div.append($.parseHTML(editform));

	$(div).dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			Ok: function () {
				target.value.value = $(this).find("#editbool").prop("checked");
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
	var frames = target.value;
	for (frame in frames) {
		var texture = frames[frame]["Texture"];
		var location = frames[frame]["Location"];
		var size = frames[frame]["Size"];
		var hotspot = frames[frame]["Hotspot"];
		var duration = frames[frame]["Duration"];
		var shading = frames[frame]["Shading"];
		var specular = frames[frame]["Specular"];
	}

	// Add a select to choose the element to view.
	var frameselector = $(document.createElement("div")).attr("id", "frameselector")
		.append($(document.createElement("select")));

	// Populate the list
	var select = $(frameselector).find("select");
	for (var frame in frames) {
		$(select).append($(document.createElement("option")).val(frame).text(frame));
	}

	var textureform = "<div id='textureform'>Texture: <span id='texture'>" + target.value[0]["Texture"].value + "</span>" +
		"<input id='edittexture' type='text' style='display: none;' /><br /></div>";

	var texturediv = $(document.createElement("div")).attr("id", "texture_editor");
	texturediv.append($.parseHTML(textureform));

	$(texturediv).find("#edittexture").focusout(function () { $(this).hide(); $(this).siblings("#texture").show().text($(this).val()); });
	$(texturediv).find("#textureform").click(function () { $(this).find("#texture").hide(); $(this).find("#edittexture").show().val($(this).find("#texture").text()).focus(); });

	var div = $(document.createElement("div")).attr("id", name + "_editor");
	div.append(frameselector).append(texturediv);

	var currentframe = 0;

	$(div).find("#frameselector").change(
		function () {
			currentframe = $(div).find("#frameselector > select option:selected").val()
			$(div).find("#textureform > #texture").text(target.value[currentframe]["Texture"].value);
		});

	$(div).dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			Ok: function () {
				target.value[currentframe]["Texture"].value = $(this).find("#texture").text();
				$(this).dialog("close");
			},
			Cancel: function () {
				$(this).dialog("close");
			}
		},
	});
	$(div).dialog("open");
}
