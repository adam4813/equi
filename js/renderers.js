renderers = {};

renderers["Frame"] = function (item, location) {
	var img = $.parseHTML("<img src='img/" + item.elements["Texture"].valueHolder.value + "'/>");
	var loc = item.elements["Location"].valueHolder;
	var size = item.elements["Size"].valueHolder;
	var rect = {
		top: loc.elements["Y"].valueHolder.value,
		right: (parseInt(loc.elements["X"].valueHolder.value) + parseInt(size.elements["CX"].valueHolder.value)),
		bottom: (parseInt(loc.elements["Y"].valueHolder.value) + parseInt(size.elements["CY"].valueHolder.value)),
		left: loc.elements["X"].valueHolder.value
	}
	$(img).css({
		"position": "absolute",
		"left": "-" + loc.elements["X"].valueHolder.value + "px",
		"top": "-" + loc.elements["Y"].valueHolder.value + "px",
		"clip": "rect(" + rect.top + "px " + rect.right + "px " + rect.bottom + "px " + rect.left + "px)",
		"z-index": "-1",
		"user-select": "none"
	});
	$(location).append(img);
};

renderers["Button"] = function (item, location) {
	var div = $.parseHTML("<div/>");
	$(div).css({ "position": "absolute" });

	// Make the text overlay.
	var textDiv = $.parseHTML("<div id='textOverlay'>" + item.elements["Text"].valueHolder.value);
	$(textDiv).css({
		"position": "relative",
		"color": "rgb(" + item.elements["TextColor"].valueHolder.elements["R"].valueHolder.value + ", " +
			item.elements["TextColor"].valueHolder.elements["G"].valueHolder.value + ", "+
			item.elements["TextColor"].valueHolder.elements["B"].valueHolder.value + ")",
		"left": item.elements["TextOffsetX"].valueHolder.value,
		"top": item.elements["TextOffsetY"].valueHolder.value,
		"text-align": (item.elements["TextAlignCenter"].valueHolder.value) == "true" ? "center" : "left",
		"text-align": (item.elements["TextAlignRight"].valueHolder.value) == "true" ? "right" : "left",
		"vertical-align": (item.elements["TextAlignVCenter"].valueHolder.value) ? "middle" : "initial"
	});
	$(textDiv).attr("alt", (item.elements["TooltipReference"].valueHolder.value));
	$(div).append(textDiv);

	var butDrawTemplate = item.elements["ButtonDrawTemplate"].valueHolder;

	// TODO: Handle ButtonDrawTemplate items more elegantly.
	// TODO: Handle ButtonDrawTemplate item references.
	// Normal Button Image.
	if (items[butDrawTemplate.elements["Normal"].valueHolder.value]) {
		var normalFrame = items[butDrawTemplate.elements["Normal"].valueHolder.value].elements["Frames"].valueHolder[0];
		normalDiv = $.parseHTML("<div id='Normal'/>");
		renderers["Frame"](normalFrame, normalDiv);
		var normalOffset = $(normalDiv).offset();
		normalOffset.top += parseInt(normalOffset.top) + parseInt(item.elements["DecalOffset"].valueHolder.elements["Y"].valueHolder.value),
		normalOffset.left += parseInt(normalOffset.left) + parseInt(item.elements["DecalOffset"].valueHolder.elements["X"].valueHolder.value),
		$(normalDiv).offset(normalOffset).css("position", "absolute");
		if (parseInt(item.elements["DecalSize"].valueHolder.elements["CX"].valueHolder.value) > 0) {
			$(normalDiv).offset(normalOffset).css("overflow", "hidden");
			$(normalDiv).width(parseInt(item.elements["DecalSize"].valueHolder.elements["CX"].valueHolder.value));
		}
		if (parseInt(item.elements["DecalSize"].valueHolder.elements["CY"].valueHolder.value) > 0) {
			$(normalDiv).offset(normalOffset).css("overflow", "hidden");
			$(normalDiv).height(parseInt(item.elements["DecalSize"].valueHolder.elements["CY"].valueHolder.value));
		}
		$(div).append(normalDiv);
	}

	// Pressed Button Image.
	if (items[butDrawTemplate.elements["Pressed"].valueHolder.value]) {
		var pressedFrame = items[butDrawTemplate.elements["Pressed"].valueHolder.value].elements["Frames"].valueHolder[0];
		pressedDiv = $.parseHTML("<div id='Pressed'/>");
		renderers["Frame"](pressedFrame, pressedDiv);
		$(pressedDiv).hide(); // Hidden by default.
		var pressedOffset = $(pressedDiv).offset();
		pressedOffset.top += parseInt(pressedOffset.top) + parseInt(item.elements["DecalOffset"].valueHolder.elements["Y"].valueHolder.value),
		pressedOffset.left += parseInt(pressedOffset.left) + parseInt(item.elements["DecalOffset"].valueHolder.elements["X"].valueHolder.value),
		$(pressedDiv).offset(pressedOffset).css("position", "absolute");
		if (parseInt(item.elements["DecalSize"].valueHolder.elements["CX"].valueHolder.value) > 0) {
			$(pressedDiv).offset(normalOffset).css("overflow", "hidden");
			$(pressedDiv).width(parseInt(item.elements["DecalSize"].valueHolder.elements["CX"].valueHolder.value));
		}
		if (parseInt(item.elements["DecalSize"].valueHolder.elements["CY"].valueHolder.value) > 0) {
			$(pressedDiv).offset(normalOffset).css("overflow", "hidden");
			$(pressedDiv).height(parseInt(item.elements["DecalSize"].valueHolder.elements["CY"].valueHolder.value));
		}
		$(div).append(pressedDiv);
	}

	// Flyby Button Image.
	if (items[butDrawTemplate.elements["Flyby"].valueHolder.value]) {
		var flybyFrame = items[butDrawTemplate.elements["Flyby"].valueHolder.value].elements["Frames"].valueHolder[0];
		flybydDiv = $.parseHTML("<div id='Flyby'/>");
		renderers["Frame"](flybyFrame, flybydDiv);
		$(flybydDiv).hide(); // Hidden by default.
		var flybyOffset = $(flybydDiv).offset();
		flybyOffset.top += parseInt(flybyOffset.top) + parseInt(item.elements["DecalOffset"].valueHolder.elements["Y"].valueHolder.value),
		flybyOffset.left += parseInt(flybyOffset.left) + parseInt(item.elements["DecalOffset"].valueHolder.elements["X"].valueHolder.value),
		$(flybydDiv).offset(flybyOffset).css("position", "absolute");
		if (parseInt(item.elements["DecalSize"].valueHolder.elements["CX"].valueHolder.value) > 0) {
			$(flybydDiv).offset(normalOffset).css("overflow", "hidden");
			$(flybydDiv).width(parseInt(item.elements["DecalSize"].valueHolder.elements["CX"].valueHolder.value));
		}
		if (parseInt(item.elements["DecalSize"].valueHolder.elements["CY"].valueHolder.value) > 0) {
			$(flybydDiv).offset(normalOffset).css("overflow", "hidden");
			$(flybydDiv).height(parseInt(item.elements["DecalSize"].valueHolder.elements["CY"].valueHolder.value));
		}
		$(div).append(flybydDiv);
	}

	$(location).mousedown(function () {
		if ($(this).find("#Pressed").length > 0) {
			$(this).find("#Pressed").show();
			$(this).find("#Normal").hide();
		}
		$(this).find("#Flyby").hide();
		if (item.elements["UseCustomPressedColor"].valueHolder.value) {
			$(this).find("#textOverlay").css({
				"color": "rgb(" + item.elements["PressedColor"].valueHolder.elements["R"].valueHolder.value + ", " +
					item.elements["PressedColor"].valueHolder.elements["G"].valueHolder.value + ", " +
					item.elements["PressedColor"].valueHolder.elements["B"].valueHolder.value + ")",
			});
		}
	}).mouseup(function () {
		$(this).find("#Pressed").hide();
		$(this).find("#Normal").show();
		$(this).find("#textOverlay").css({
			"color": "rgb(" + item.elements["TextColor"].valueHolder.elements["R"].valueHolder.value + ", " +
				item.elements["TextColor"].valueHolder.elements["G"].valueHolder.value + ", " +
				item.elements["TextColor"].valueHolder.elements["B"].valueHolder.value + ")",
		});
		$(this).mouseenter();
	}).mouseenter(function () {
		if ($(this).find("#Pressed").css("display") == "none") {
			$(this).find("#Flyby").show();
			if (item.elements["UseCustomMouseoverColor"].valueHolder.value) {
				$(this).find("#textOverlay").css({
					"color": "rgb(" + item.elements["MouseoverColor"].valueHolder.elements["R"].valueHolder.value + ", " +
						item.elements["MouseoverColor"].valueHolder.elements["G"].valueHolder.value + ", " +
						item.elements["MouseoverColor"].valueHolder.elements["B"].valueHolder.value + ")",
				});
			}
		}
	}).mouseleave(function () {
		if ($(this).find("#Flyby").css("display") != "none") {
			$(this).find("#Flyby").hide();
			$(this).find("#textOverlay").css({
				"color": "rgb(" + item.elements["TextColor"].valueHolder.elements["R"].valueHolder.value + ", " +
					item.elements["TextColor"].valueHolder.elements["G"].valueHolder.value + ", " +
					item.elements["TextColor"].valueHolder.elements["B"].valueHolder.value + ")",
			});
		}
	});

	$(location).append(div);
};
