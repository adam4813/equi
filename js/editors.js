editors = [];

editors["Point"] = function (name, target) {
	var x = target.valueHolder.elements["X"].valueHolder.value;
	var y = target.valueHolder.elements["Y"].valueHolder.value;

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
		width: "auto",
		buttons: {
			Ok: function () {
				target.valueHolder.elements["X"].valueHolder.value = $(this).find("#x").text();
				target.valueHolder.elements["Y"].valueHolder.value = $(this).find("#y").text();
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
	var x = target.valueHolder.elements["CX"].valueHolder.value;
	var y = target.valueHolder.elements["CY"].valueHolder.value;

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
		width: "auto",
		buttons: {
			Ok: function () {
				target.valueHolder.elements["CX"].valueHolder.value = $(this).find("#x").text();
				target.valueHolder.elements["CY"].valueHolder.value = $(this).find("#y").text();
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
	var str = "";
	if (target.valueHolder.value) {
		str = target.valueHolder.value;
	}

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
		width: "auto",
		buttons: {
			Ok: function () {
				target.valueHolder.value = $(this).find("#str").text();
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
	var r = target.valueHolder.elements["R"].valueHolder.value;
	var g = target.valueHolder.elements["G"].valueHolder.value;
	var b = target.valueHolder.elements["B"].valueHolder.value;
	var alpha = target.valueHolder.elements["Alpha"].valueHolder.value;

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
		width: "auto",
		buttons: {
			Ok: function () {
				target.valueHolder.elements["Alpha"].valueHolder.value = $(this).find("#alpha").text();
				target.valueHolder.elements["R"].valueHolder.value = $(this).find("#r").text();
				target.valueHolder.elements["G"].valueHolder.value = $(this).find("#g").text();
				target.valueHolder.elements["B"].valueHolder.value = $(this).find("#b").text();
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
	var str = "";
	if (target.valueHolder.value != null) {
		str = target.valueHolder.value;
	}

	var editform = "<div id='intform'>" + name + ": <span id='int'>" + str + "</span>" +
		"<input id='editint' type='text' style='display: none;' /></div>";

	var div = $(document.createElement("div")).attr("id", name + "_editor");
	div.append($.parseHTML(editform));

	$(div).find("#editint").focusout(function () { $(this).hide(); $(this).siblings("#int").show().text($(this).val()); });
	$(div).find("#intform").click(function () { $(this).find("#int").hide(); $(this).find("#editint").show().val($(this).find("#int").text()).focus(); });

	$(div).dialog({
		autoOpen: false,
		modal: true,
		width: "auto",
		buttons: {
			Ok: function () {
				target.valueHolder.value = $(this).find("#int").text();
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
	var str = "";
	if (target.valueHolder.value) {
		str = target.valueHolder.value;
	}

	var editform = "<div>" + name + "<input id='editbool' type='checkbox' " + 
	 ((target.valueHolder.value == true) ? "checked" : "") + "/></div>";

	var div = $(document.createElement("div")).attr("id", name + "_editor");
	div.append($.parseHTML(editform));

	$(div).dialog({
		autoOpen: false,
		modal: true,
		width: "auto",
		buttons: {
			Ok: function () {
				target.valueHolder.value = $(this).find("#editbool").prop("checked");
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
	for (var frame in target.valueHolder) {
		$(select).append($(document.createElement("option")).val(frame).text(frame));
	}

	var div = $(document.createElement("div")).attr("id", name + "_editor");
	$(div).append(frameselector);

	var currentframe = 0;

	for (var property in target.valueHolder[currentframe].elements) {
		switch (target.valueHolder[currentframe].elements[property].type) {
			case "string":
			case "int":
				var form = "<div id='" + property + "form'><span id='" + property + "label'>" + property +
					": <span id='" + property + "'/></span><input id='edit" + property + "' type='text' style='display: none;' /></div>";
				break;
			case "boolean":
				var form = "<div id='" + property + "form'><span id='" + property + "label'>" + property +
					": <input id='edit" + property + "' type='checkbox'/></span></div>";
				break;
			default:
				var form = "<div id='" + property + "-form'><span id='" + property + "label'>" + property + ":";
				for (value in target.valueHolder[currentframe].elements[property].valueHolder.elements) {
					form += " " + value + ": <span id='" + property + "-" + value + "'/><input id='edit" + property + "-" + value + "' type='text' style='display: none;' />";
				}
				form += "</span></div>";
		}
		$(div).append($.parseHTML(form));

		
		switch (target.valueHolder[currentframe].elements[property].type) {
			case "string":
			case "int":
				$(div).find("#edit" + property).focusout({ property: property }, function (property) {
					$(this).hide(); $(this).parent().find("#" + property.data.property).show().text($(this).val());
				});
				$(div).find("#" + property + "label").click({ property: property }, function (property) {
					$(this).find("#" + property.data.property).hide();
					$(this).siblings("#edit" + property.data.property).show().val($(this).find("#" + property.data.property).text()).focus();
				});
				break;
			case "boolean":
				// No special editor to show/hide.
				break;
			default:
				for (value in target.valueHolder[currentframe].elements[property].valueHolder.elements) {
					$(div).find("#edit" + property + "-" + value).focusout({ property: property, value: value }, function (property) {
						$(this).hide(); $(this).siblings("#" + property.data.property + "-" + property.data.value).show().text($(this).val());
					});
					$(div).find("#" + property + "-" + value).click({ property: property, value: value }, function (property) {
						$(this).hide();
						$(this).siblings("#edit" + property.data.property + "-" + property.data.value).show().val($(this).text()).focus();
					});
				}
		}
	}

	$(div).find("#frameselector").change(
		function () {
			currentframe = $(div).find("#frameselector > select option:selected").val()
			for (var property in target.valueHolder[currentframe].elements) {
				switch (target.valueHolder[currentframe].elements[property].type) {
					case "string":
					case "int":
						$(div).find("#" + property).text(target.valueHolder[currentframe].elements[property].valueHolder.value);
						break;
					case "boolean":
						$(div).find("#edit" + property).prop("checked", target.valueHolder[currentframe].elements[property].valueHolder.value == true);
						break;
					default:
						for (value in target.valueHolder[currentframe].elements[property].valueHolder.elements) {
							$(div).find("#" + property + "-" + value).text(
								target.valueHolder[currentframe].elements[property].valueHolder.elements[value].valueHolder.value);
						}
				}
			}
		});
	
	$(div).find("#frameselector").change();

	$(div).dialog({
		autoOpen: false,
		modal: true,
		width: "auto",
		buttons: {
			Ok: function () {
				for (var property in target.valueHolder[currentframe].elements) {
					switch (target.valueHolder[currentframe].elements[property].type) {
						case "string":
						case "int":
							target.valueHolder[currentframe].elements[property].valueHolder.value = $(this).find("#" + property).text();
							break;
						case "boolean":
							target.valueHolder[currentframe].elements[property].valueHolder.value = prop("checked") == true;
							break;
						default:
							for (value in target.valueHolder[currentframe].elements[property].valueHolder.elements) {
								target.valueHolder[currentframe].elements[property].valueHolder.elements[value].valueHolder.value = $(this).find("#" + property + "-" + value).text();
							}
					}
				}
				$(this).dialog("close");
			},
			Cancel: function () {
				$(this).dialog("close");
			}
		},
	});
	$(div).dialog("open");
}

editors["Template"] = function (name, target, type) {
	var div = $(document.createElement("div")).attr("id", name + "_editor");
	for (property in target.valueHolder.elements) {
			var form = "<div id='" + property + "form'><span id='" + property + "label'>" + property +
				": <span id='" + property + "'>" + target.valueHolder.elements[property].valueHolder.value + "</span></span><input id='edit" + property + "' type='text' style='display: none;' /></div>";
			$(div).append($.parseHTML(form));
			$(div).find("#edit" + property).focusout({ property: property }, function (property) {
				$(this).hide(); $(this).parent().find("#" + property.data.property).show().text($(this).val());
			});
			$(div).find("#" + property + "label").click({ property: property }, function (property) {
				$(this).find("#" + property.data.property).hide();
				$(this).siblings("#edit" + property.data.property).show().val($(this).find("#" + property.data.property).text()).focus();
			});
	}

	$(div).dialog({
		autoOpen: false,
		modal: true,
		width: "auto",
		buttons: {
			Ok: function () {
				for (var property in target.valueHolder.elements) {
					target.valueHolder.elements[property].valueHolder.value = $(this).find("#" + property).text();
				}
				$(this).dialog("close");
			},
			Cancel: function () {
				$(this).dialog("close");
			}
		},
	});
	$(div).dialog("open");
}

editors["itemArray"] = function (name, target, type) {
	var div = $(document.createElement("div")).attr("id", name + "_editor");
	$(div).append($.parseHTML("<select id='itemSelect' multiple/>"));
	for (item in target.valueHolder) {
		$(div).find("#itemSelect").append($('<option></option>').val(item).html(target.valueHolder[item].value));
	}

	$(div).dialog({
		autoOpen: false,
		modal: true,
		width: "auto",
		buttons: {
			Ok: function () {
				for (var property in target.valueHolder.elements) {
					target.valueHolder.elements[property].valueHolder.value = $(this).find("#" + property).text();
				}
				$(this).dialog("close");
			},
			Cancel: function () {
				$(this).dialog("close");
			}
		},
	});
	$(div).dialog("open");
}
