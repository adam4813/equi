viewers = {};

viewers["TextureInfo"] = function (item, location) {
	var img = $.parseHTML("<img src='img/" + item.item + "'/>");
	$(location).append(img);
}

/* TODO:
|- Hotspot
|- Shading
|- Specular
*/
viewers["Frame"] = function (item, location) {
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
	$(location).width(parseInt(size.elements["CX"].valueHolder.value)).height(parseInt(size.elements["CY"].valueHolder.value));
};

/* TODO:
|- Grid
|- Vertical
|- CellWidth
|- CellHeight
*/
viewers["Ui2DAnimation"] = function (item, location) {
	var currentFrame = 0;
	var run = setInterval(animate, item.elements["Frames"].valueHolder[currentFrame].elements["Duration"].valueHolder.value);
	var div = $.parseHTML("<div/>");

	for (frame in item.elements["Frames"].valueHolder) {
		viewers["Frame"](item.elements["Frames"].valueHolder[frame], div);
	}

	$(location).append(div);

	$(div).children().not(":eq(0)").hide();

	function animate() {
		clearInterval(run);
		// This animation is no longer in the DOM so remove the interval.
		if ($(div).parents().filter("body").length == 0) {
			return;
		}
		currentFrame++;
		if (currentFrame >= item.elements["Frames"].valueHolder.length) {
			if (item.elements["Cycle"].valueHolder.value == true) {
				currentFrame = 0;
			} else {
				// Cycle is false so just loop through once.
				return;
			}
		}
		var frame = item.elements["Frames"].valueHolder[currentFrame];

		$(div).children().filter("img").eq(currentFrame - 1).hide();
		$(div).children().filter("img").eq(currentFrame).show();
		run = setInterval(animate, frame.elements["Duration"].valueHolder.value);
	};
}

/* TODO:
|- Disabled
|- PressedFlyby
|- PressedDisabled
|- *Decal (Behavior)
*/
viewers["ButtonDrawTemplate"] = function (item, location) {
	for (element in item.elements) {
		if (items[item.elements[element].valueHolder.value]) {
			var frame = items[item.elements[element].valueHolder.value];
			var frameDiv = $.parseHTML("<div id='" + element + "'/>");
			viewers["Ui2DAnimation"](frame, frameDiv);
			$(frameDiv).hide();
			$(location).append(frameDiv);
		}
	}

	$(location).mousedown(function () {
		if ($(this).find("#Pressed").length > 0) {
			$(this).find("#Pressed").show();
			$(this).find("#Normal").hide();
		}
		$(this).find("#Flyby").hide();
	}).mouseup(function () {
		// We must reference Checkbox_State to ensure proper bevaior (set in Button).
		if (location["Checkbox_State"] == true) { return; }
		$(this).find("#Pressed").hide();
		$(this).find("#Normal").show();
		$(this).mouseenter();
	}).mouseenter(function () {
		if (($(this).find("#Pressed").length > 0) ? ($(this).find("#Pressed").css("display") == "none") : true) {
			$(this).find("#Flyby").show();
		}
	}).mouseleave(function () {
		if ($(this).find("#Flyby").css("display") != "none") {
			$(this).find("#Flyby").hide();
		}
	});
	$(location).mouseup();
	$(location).mouseleave();
}

/* TODO:
Control
|- Style_VScroll
|- Style_HScroll
|- Style_AutoVScroll
|- Style_AutoHScroll
|- Style_Transparent
|- Style_TransparentControl
|- Style_Border
|- Style_Tooltip
|- EQType
|- DrawTemplate
|- Layout
Button
|- UseCustomDisabledColor
|- RadioGroup
|- Template
|- SoundPressed
|- SoundUp
|- SoundFlyby
*/
viewers["Button"] = function (item, location) {
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
		"vertical-align": (item.elements["TextAlignVCenter"].valueHolder.value == "true") ? "middle" : "initial"
	});
	$(textDiv).attr("title", (item.elements["TooltipReference"].valueHolder.value));

	if (item.elements["Style_Checkbox"].valueHolder.value == true) {
		textDiv["Checkbox_State"] = false;
	}

	viewers["ButtonDrawTemplate"](item.elements["ButtonDrawTemplate"].valueHolder, textDiv);

	// Apply Decal properties to any Decal children.
	decalElements = $(textDiv).find("[id$=Decal]");
	for (var i = 0; i < decalElements.length; i++) {
		var normalOffset = $(decalElements[i]).offset();
		normalOffset.top += parseInt(normalOffset.top) + parseInt(item.elements["DecalOffset"].valueHolder.elements["Y"].valueHolder.value),
		normalOffset.left += parseInt(normalOffset.left) + parseInt(item.elements["DecalOffset"].valueHolder.elements["X"].valueHolder.value),
		$(decalElements[i]).offset(normalOffset).css("position", "absolute");
		if (parseInt(item.elements["DecalSize"].valueHolder.elements["CX"].valueHolder.value) > 0) {
			$(decalElements[i]).offset(normalOffset).css("overflow", "hidden");
			$(decalElements[i]).width(parseInt(item.elements["DecalSize"]["DecalSize"].valueHolder.elements["CX"].valueHolder.value));
		}
		if (parseInt(item.elements["DecalSize"].valueHolder.elements["CY"].valueHolder.value) > 0) {
			$(decalElements[i]).offset(normalOffset).css("overflow", "hidden");
			$(decalElements[i]).height(parseInt(item.elements["DecalSize"].valueHolder.elements["CY"].valueHolder.value));
		}
	}

	$(div).append(textDiv);

	$(div).mousedown(function () {
		textDiv["Checkbox_State"] = !textDiv["Checkbox_State"];
		if (item.elements["UseCustomPressedColor"].valueHolder.value) {
			$(this).find("#textOverlay").css({
				"color": "rgb(" + item.elements["PressedColor"].valueHolder.elements["R"].valueHolder.value + ", " +
					item.elements["PressedColor"].valueHolder.elements["G"].valueHolder.value + ", " +
					item.elements["PressedColor"].valueHolder.elements["B"].valueHolder.value + ")",
			});
		}
	}).mouseup(function () {
		if (textDiv["Checkbox_State"] == true) { return; }
		$(this).find("#textOverlay").css({
			"color": "rgb(" + item.elements["TextColor"].valueHolder.elements["R"].valueHolder.value + ", " +
				item.elements["TextColor"].valueHolder.elements["G"].valueHolder.value + ", " +
				item.elements["TextColor"].valueHolder.elements["B"].valueHolder.value + ")",
		});
		$(this).mouseenter();
	}).mouseenter(function () {
		if (($(this).find("#Pressed").length > 0) ? ($(this).find("#Pressed").css("display") == "none") : true) {
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
			$(this).find("#textOverlay").css({
				"color": "rgb(" + item.elements["TextColor"].valueHolder.elements["R"].valueHolder.value + ", " +
					item.elements["TextColor"].valueHolder.elements["G"].valueHolder.value + ", " +
					item.elements["TextColor"].valueHolder.elements["B"].valueHolder.value + ")",
			});
		}
	});

	$(location).append(div);
	$(location).mouseup();
	$(location).mouseleave();
};
