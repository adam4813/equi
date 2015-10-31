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
	$(img).one("load", function() {
		var loc = item.elements["Location"].valueHolder;
		var size = item.elements["Size"].valueHolder;
		var width = $(location).width();
		var height = $(location).height();

		// If there isn't a defined width/height we will use the frame's width/height.
		if (width == 0) {
			width = parseInt(size.elements["CX"].valueHolder.value);
		}
		if (height == 0) {
			height = parseInt(size.elements["CY"].valueHolder.value);
		}

		// Determine the scaling factor that needs to be applied to match the width/height.
		var scaleX = width / parseInt(size.elements["CX"].valueHolder.value);
		var scaleY = height / parseInt(size.elements["CY"].valueHolder.value);

		$(img).css({
			"position": "absolute",
			"left": "-" + (parseInt(loc.elements["X"].valueHolder.value) * scaleX) + "px",
			"top": "-" + (parseInt(loc.elements["Y"].valueHolder.value) * scaleY) + "px",
			"z-index": "-1",
			"user-select": "none",
			"width": img[0].width * scaleX + "px",
			"height": img[0].height * scaleY + "px",
		});

		$(location).append(img).width(width).height(height);
	}).each(function() {
	  if(this.complete) $(this).load();
	});
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
		$(div).css({ "overflow": "hidden", "position": "relative" });
		$(div).width($(location).width()).height($(location).height())
		viewers["Frame"](item.elements["Frames"].valueHolder[frame], div);
	}

	$(div).attr("id", item.item);
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
			$(frameDiv).width($(location).width()).height($(location).height());
			viewers["Ui2DAnimation"](frame, frameDiv);
			$(frameDiv).hide();
			$(location).append(frameDiv);
		}
	}

	$(location).mousedown(function () {
		if ($(this).find("#Pressed").length > 0) {
			$(this).find("#Pressed").show();
			$(this).find("#PressedDecal").show();
			$(this).find("#Normal").hide();
			$(this).find("#NormalDecal").hide();
		}
		$(this).find("#Flyby").hide();
	}).mouseup(function () {
		// We must reference Checkbox_State to ensure proper behavior (set in Button).
		if (location["Checkbox_State"] == true) { return; }
		$(this).find("#Pressed").hide();
		$(this).find("#PressedDecal").hide();
		$(this).find("#Normal").show();
		$(this).find("#NormalDecal").show();
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

viewers["GaugeDrawTemplate"] = function (item, location) {
	if (items[item.elements["EndCapLeft"].valueHolder.value]) {
		var leftEndDiv = $.parseHTML("<div/>");
		$(leftEndDiv).height($(location).height()).addClass("piece").attr("id", "EndCapLeft");
		viewers["Ui2DAnimation"](items[item.elements["EndCapLeft"].valueHolder.value], leftEndDiv);
	}

	if (items[item.elements["EndCapRight"].valueHolder.value]) {
		var rightEndDiv = $.parseHTML("<div/>");
		$(rightEndDiv).height($(location).height()).addClass("piece").attr("id", "EndCapRight");
		viewers["Ui2DAnimation"](items[item.elements["EndCapRight"].valueHolder.value], rightEndDiv);
	}

	if (items[item.elements["Background"].valueHolder.value]) {
		var bkgdDiv = $.parseHTML("<div/>");
		var capWidth = $(leftEndDiv).children().width() + $(rightEndDiv).children().width();
		$(bkgdDiv).width($(location).width() - capWidth).height($(location).height()).addClass("piece").attr("id", "Background");
		viewers["Ui2DAnimation"](items[item.elements["Background"].valueHolder.value], bkgdDiv);
	}

	if (items[item.elements["Fill"].valueHolder.value]) {
		var fillDiv = $.parseHTML("<div/>");
		fillDiv[0].scaleX = 1.46; fillDiv[0].scaleY = 1;
		$(fillDiv).width("75%").height($(location).height())
			.css({ "left": $(leftEndDiv).children().width() + "px" }).addClass("bar").attr("id", "Fill");
		viewers["Ui2DAnimation"](items[item.elements["Fill"].valueHolder.value], fillDiv);
	}

	if (items[item.elements["Lines"].valueHolder.value]) {
		var lineDiv = $.parseHTML("<div/>");
		lineDiv[0].scaleX = 1.46; lineDiv[0].scaleY = 1;
		$(lineDiv).width($(location).width()).height($(location).height())
			.css({ "left": $(leftEndDiv).children().width() + "px" }).addClass("bar").attr("id", "Lines");
		viewers["Ui2DAnimation"](items[item.elements["Lines"].valueHolder.value], lineDiv);
	}
		
	if (items[item.elements["LinesFill"].valueHolder.value]) {
		var lineFillDiv = $.parseHTML("<div/>");
		lineFillDiv[0].scaleX = 1.46; lineFillDiv[0].scaleY = 1;
		$(lineFillDiv).width("50%").height($(location).height())
			.css({ "left": $(leftEndDiv).children().width() + "px" }).addClass("bar").attr("id", "LinesFill");
		viewers["Ui2DAnimation"](items[item.elements["LinesFill"].valueHolder.value], lineFillDiv);
	}

	$(location).append(leftEndDiv).append(bkgdDiv).append(rightEndDiv)
		.append(fillDiv).append(lineDiv).append(lineFillDiv);
}

/* TODO
|- Overlap (set both middleMiddle and child div to overflow: visible, and adjust margin and then width/height).
*/

viewers["FrameTemplate"] = function (item, location) {
	var top = $($.parseHTML("<div />")).addClass("section").attr("id", "Top");
	if (items[item.elements["TopLeft"].valueHolder.value]) {
		var topLeftdiv = $($.parseHTML("<div/>")).addClass("piece").attr("id", "TopLeft");
		viewers["Ui2DAnimation"](items[item.elements["TopLeft"].valueHolder.value], topLeftdiv);
	}

	if (items[item.elements["TopRight"].valueHolder.value]) {
		var topRightdiv = $($.parseHTML("<div/>")).addClass("piece").attr("id", "TopRight");
		viewers["Ui2DAnimation"](items[item.elements["TopRight"].valueHolder.value], topRightdiv);
	}

	if (items[item.elements["Top"].valueHolder.value]) {
		var capWidth = $(topLeftdiv).children().width() + $(topRightdiv).children().width();
		var topdiv = $($.parseHTML("<div/>")).addClass("piece").attr("id", "TopMiddle").width($(location).width() - capWidth);
		viewers["Ui2DAnimation"](items[item.elements["Top"].valueHolder.value], topdiv);
	}
	$(top).append(topLeftdiv).append(topdiv).append(topRightdiv);

	var bottom = $($.parseHTML("<div />")).addClass("section").attr("id", "Bottom");
	if (items[item.elements["BottomLeft"].valueHolder.value]) {
		var bottomLeftdiv = $($.parseHTML("<div/>")).addClass("piece").attr("id", "BottomLeft");
		viewers["Ui2DAnimation"](items[item.elements["BottomLeft"].valueHolder.value], bottomLeftdiv);
	}

	if (items[item.elements["BottomRight"].valueHolder.value]) {
		var bottomRightdiv = $($.parseHTML("<div/>")).addClass("piece").attr("id", "BottomRight");
		viewers["Ui2DAnimation"](items[item.elements["BottomRight"].valueHolder.value], bottomRightdiv);
	}

	if (items[item.elements["Bottom"].valueHolder.value]) {
		var capWidth = $(bottomLeftdiv).children().width() + $(bottomRightdiv).children().width();
		var bottomdiv = $($.parseHTML("<div/>")).addClass("piece").attr("id", "BottomMiddle").width($(location).width() - capWidth);
		viewers["Ui2DAnimation"](items[item.elements["Bottom"].valueHolder.value], bottomdiv);
	}
	$(bottom).append(bottomLeftdiv).append(bottomdiv).append(bottomRightdiv);

	var topBottomHeight = $(top).children().children().height() + $(bottom).children().children().height();

	var middle = $($.parseHTML("<div/>")).addClass("section").attr("id", "Middle").height($(location).height() - topBottomHeight);
	var left = $($.parseHTML("<div />")).addClass("piece").attr("id", "Left");
	if (items[item.elements["LeftTop"].valueHolder.value]) {
		var leftTopdiv = $($.parseHTML("<div/>")).addClass("vpiece").attr("id", "LeftTop");
		viewers["Ui2DAnimation"](items[item.elements["LeftTop"].valueHolder.value], leftTopdiv);
	}

	if (items[item.elements["LeftBottom"].valueHolder.value]) {
		var leftBottomdiv = $($.parseHTML("<div/>")).addClass("vpiece").attr("id", "LeftBottom");
		viewers["Ui2DAnimation"](items[item.elements["LeftBottom"].valueHolder.value], leftBottomdiv);
	}

	if (items[item.elements["Left"].valueHolder.value]) {
		var capHeight = $(leftTopdiv).children().height() + $(leftBottomdiv).children().height();
		var leftdiv = $($.parseHTML("<div/>")).addClass("vpiece").attr("id", "LeftMiddle").height($(middle).height() - capHeight);
		viewers["Ui2DAnimation"](items[item.elements["Left"].valueHolder.value], leftdiv);
	}
	$(left).append(leftTopdiv).append(leftdiv).append(leftBottomdiv);

	var right = $($.parseHTML("<div />")).addClass("piece").attr("id", "Right");
	if (items[item.elements["RightTop"].valueHolder.value]) {
		var rightTopdiv = $($.parseHTML("<div/>")).addClass("vpiece").attr("id", "RightTop");
		viewers["Ui2DAnimation"](items[item.elements["RightTop"].valueHolder.value], rightTopdiv);
	}

	if (items[item.elements["RightBottom"].valueHolder.value]) {
		var rightBottomdiv = $($.parseHTML("<div/>")).addClass("vpiece").attr("id", "RightBottom");
		viewers["Ui2DAnimation"](items[item.elements["RightBottom"].valueHolder.value], rightBottomdiv);
	}

	if (items[item.elements["Right"].valueHolder.value]) {
		var capHeight = $(rightTopdiv).children().height() + $(rightBottomdiv).children().height();
		var rightdiv = $($.parseHTML("<div/>")).addClass("vpiece").attr("id", "RightMiddle").height($(middle).height() - capHeight);
		viewers["Ui2DAnimation"](items[item.elements["Right"].valueHolder.value], rightdiv);
	}
	$(right).append(rightTopdiv).append(rightdiv).append(rightBottomdiv);

	var middleEnds = ($(left).children().children().width() + $(right).children().children().width());

	var middleMiddle = $($.parseHTML("<div/>")).addClass("piece").attr("id", "MiddleMiddle")
		.width($(location).width() - middleEnds).height($(middle).height());
	if (items[item.elements["Middle"].valueHolder.value]) {
		var div = $($.parseHTML("<div/>")).addClass("piece").attr("id", "MiddleMiddle")
		.width($(middleMiddle).width()).height($(middleMiddle).height());
		viewers["Ui2DAnimation"](items[item.elements["Middle"].valueHolder.value], div);
		$(middleMiddle).append(div);
	}
	$(middle).append(left).append(middleMiddle).append(right);

	$(location).append(top).append(middle).append(bottom);
}

/* TODO:
|- Background
|- BackgroundDrawType
|- VSBTemplate
|- HSBTemplate
|- CloseBox
|- QMarkBox
|- MinimizeBox
|- MaximizeBox
|- TileBox
|- Titlebar
*/
viewers["WindowDrawTemplate"] = function (item, location) {
	var borderDiv = $($.parseHTML("<div/>")).addClass("frame");
	$(borderDiv).height($(location).height()).width($(location).width());
	viewers["FrameTemplate"](item.elements["Border"].valueHolder, borderDiv);
	$(location).append(borderDiv);
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
	var left = parseInt(item.elements["Location"].valueHolder.elements["X"].valueHolder.value);
	var top = parseInt(item.elements["Location"].valueHolder.elements["Y"].valueHolder.value);
	var width = item.elements["Size"].valueHolder.elements["CX"].valueHolder.value;
	var height = item.elements["Size"].valueHolder.elements["CY"].valueHolder.value;
	var decal_x = item.elements["DecalSize"].valueHolder.elements["CX"].valueHolder.value;
	var decal_y = item.elements["DecalSize"].valueHolder.elements["CY"].valueHolder.value;
	var anchor_left = item.elements["LeftAnchorOffset"].valueHolder.value;
	var anchor_top = item.elements["TopAnchorOffset"].valueHolder.value;
	var anchor_right = item.elements["RightAnchorOffset"].valueHolder.value;
	var anchor_bottom = item.elements["BottomAnchorOffset"].valueHolder.value;
	if (item.elements["TopAnchorToTop"].valueHolder.value == true) {
		top += anchor_top;
	}
	else {
		
	}

	if (item.elements["BottomAnchorToTop"].valueHolder.value == true) {
		if (anchor_bottom > 0) {
			width = anchor_bottom;
		}
	}
	if (width < decal_x) {
		width = decal_x;
	}
	if (height < decal_y) {
		height = decal_y;
	}
	var div = $.parseHTML("<div/>");
	$(div).css({ "position": "absolute",
		"left": left + "px",
		"top": top + "px",
		"width": width + "px",
		"height": height + "px",
		});

	if (items[item.elements["DrawTemplate"].valueHolder.value]) {
		viewers["WindowDrawTemplate"](items[item.elements["DrawTemplate"].valueHolder.value], div);
	}

	// Make the text overlay.
	var textDiv = $.parseHTML("<div id='Text'>" + item.elements["Text"].valueHolder.value);
	var align = "left";
	if (item.elements["TextAlignCenter"].valueHolder.value == true) {
		align = "center";
	} else if (item.elements["TextAlignRight"].valueHolder.value == true) {
		align = "right";
	}

	$(textDiv).css({
		"position": "relative",
		"color": "rgb(" + item.elements["TextColor"].valueHolder.elements["R"].valueHolder.value + ", " +
			item.elements["TextColor"].valueHolder.elements["G"].valueHolder.value + ", "+
			item.elements["TextColor"].valueHolder.elements["B"].valueHolder.value + ")",
		"left": item.elements["TextOffsetX"].valueHolder.value + "px",
		"top": item.elements["TextOffsetY"].valueHolder.value + "px",
		"text-align": align,
		"vertical-align": (item.elements["TextAlignVCenter"].valueHolder.value == "true") ? "middle" : "initial",
		"width": width + "px",
		"height": height + "px"
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
			$(decalElements[i]).width(parseInt(item.elements["DecalSize"].valueHolder.elements["CX"].valueHolder.value));
		}
		if (parseInt(item.elements["DecalSize"].valueHolder.elements["CY"].valueHolder.value) > 0) {
			$(decalElements[i]).offset(normalOffset).css("overflow", "hidden");
			$(decalElements[i]).height(parseInt(item.elements["DecalSize"].valueHolder.elements["CY"].valueHolder.value));
		}
	}

	$(div).append(textDiv).attr("id", item.item);

	$(div).mousedown(function () {
		textDiv["Checkbox_State"] = !textDiv["Checkbox_State"];
		if (item.elements["UseCustomPressedColor"].valueHolder.value) {
			$(this).find("#Text").css({
				"color": "rgb(" + item.elements["PressedColor"].valueHolder.elements["R"].valueHolder.value + ", " +
					item.elements["PressedColor"].valueHolder.elements["G"].valueHolder.value + ", " +
					item.elements["PressedColor"].valueHolder.elements["B"].valueHolder.value + ")",
			});
		}
	}).mouseup(function () {
		if (textDiv["Checkbox_State"] == true) { return; }
		$(this).find("#Text").css({
			"color": "rgb(" + item.elements["TextColor"].valueHolder.elements["R"].valueHolder.value + ", " +
				item.elements["TextColor"].valueHolder.elements["G"].valueHolder.value + ", " +
				item.elements["TextColor"].valueHolder.elements["B"].valueHolder.value + ")",
		});
		$(this).mouseenter();
	}).mouseenter(function () {
		if (($(this).find("#Pressed").length > 0) ? ($(this).find("#Pressed").css("display") == "none") : true) {
			if (item.elements["UseCustomMouseoverColor"].valueHolder.value) {
				$(this).find("#Text").css({
					"color": "rgb(" + item.elements["MouseoverColor"].valueHolder.elements["R"].valueHolder.value + ", " +
						item.elements["MouseoverColor"].valueHolder.elements["G"].valueHolder.value + ", " +
						item.elements["MouseoverColor"].valueHolder.elements["B"].valueHolder.value + ")",
				});
			}
		}
	}).mouseleave(function () {
		if ($(this).find("#Flyby").css("display") != "none") {
			$(this).find("#Text").css({
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
|- Layout
*/
viewers["Gauge"] = function (item, location) {
	var div = $.parseHTML("<div/>");
	$(div).css({
		"position": "absolute",
		"left": item.elements["Location"].valueHolder.elements["X"].valueHolder.value + "px",
		"top": item.elements["Location"].valueHolder.elements["Y"].valueHolder.value + "px"})
		.width(item.elements["Size"].valueHolder.elements["CX"].valueHolder.value)
		.height(item.elements["Size"].valueHolder.elements["CY"].valueHolder.value);
	if (items[item.elements["DrawTemplate"].valueHolder.value]) {
		viewers["WindowDrawTemplate"](items[item.elements["DrawTemplate"].valueHolder.value], div);
	}

	// Make the text overlay.
	var textDiv = $.parseHTML("<div id='Text'>" + item.elements["Text"].valueHolder.value + "</div>");
	$(textDiv).css({
		"color": "rgb(" + item.elements["TextColor"].valueHolder.elements["R"].valueHolder.value + ", " +
			item.elements["TextColor"].valueHolder.elements["G"].valueHolder.value + ", " +
			item.elements["TextColor"].valueHolder.elements["B"].valueHolder.value + ")",
		"left": item.elements["TextOffsetX"].valueHolder.value,
		"top": item.elements["TextOffsetY"].valueHolder.value,
	}).addClass("label").attr("title", (item.elements["TooltipReference"].valueHolder.value));

	var gaugeDiv = $.parseHTML("<div/>");
	$(gaugeDiv).addClass("gauge").css({
		"left": item.elements["GaugeOffsetX"].valueHolder.value + "px",
		"top": item.elements["GaugeOffsetY"].valueHolder.value + "px" })
		.width(parseInt(item.elements["Size"].valueHolder.elements["CX"].valueHolder.value) - parseInt(item.elements["GaugeOffsetX"].valueHolder.value))
		.height(parseInt(item.elements["Size"].valueHolder.elements["CY"].valueHolder.value) - parseInt(item.elements["GaugeOffsetY"].valueHolder.value))
		.attr("id", "GaugeDrawTemplate");
	viewers["GaugeDrawTemplate"](item.elements["GaugeDrawTemplate"].valueHolder, gaugeDiv);

	if (item.elements["DrawLinesFill"].valueHolder.value == false) {
		$(gaugeDiv).find("#LinesFill").hide();
	}

	$(gaugeDiv).find("#LinesFill").find("img").load(item.elements["LinesFillTint"].valueHolder.elements, function (color) {
		var i = 0;
		while (!this.complete && i < 10000) { i++; }
		$(this).pixastic("coloradjust", {
			red: color.data["R"].valueHolder.value / 255,
			green: color.data["G"].valueHolder.value / 255,
			blue: color.data["B"].valueHolder.value / 255
		});
	});

	$(gaugeDiv).find("#Fill").find("img").load(item.elements["FillTint"].valueHolder.elements, function (color) {
		var i = 0;
		while (!this.complete && i < 10000) { i++; }
		$(this).pixastic("coloradjust", {
			red: color.data["R"].valueHolder.value / 255,
			green: color.data["G"].valueHolder.value / 255,
			blue: color.data["B"].valueHolder.value / 255
		});
	});
	$("img").each(function () {
		if (this.complete) $(this).load();
	});

	$(div).append(textDiv).append(gaugeDiv).attr("id", item.item);
	$(location).append(div);
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
Label
|- ResizeHeightToText
*/
viewers["Label"] = function (item, location) {
	var textDiv = $.parseHTML("<div id='Text'>" + item.elements["Text"].valueHolder.value + "</div>");
	var align = "left";
	if (item.elements["AlignCenter"].valueHolder.value == true) {
		align = "center";
	} else if (item.elements["AlignRight"].valueHolder.value == true) {
		align = "right";
	}
	var wrap = "normal";
	if (item.elements["NoWrap"].valueHolder.value == true) {
		wrap = "nowrap";
	}
	$(textDiv).css({
		"color": "rgb(" + item.elements["TextColor"].valueHolder.elements["R"].valueHolder.value + ", " +
			item.elements["TextColor"].valueHolder.elements["G"].valueHolder.value + ", " +
			item.elements["TextColor"].valueHolder.elements["B"].valueHolder.value + ")",
		"text-align": align,
		"white-space": wrap
	}).addClass("label").attr("title", (item.elements["TooltipReference"].valueHolder.value));


	var div = $.parseHTML("<div/>");
	
	$(div).css({
		"position": "absolute",
		"overflow": "hidden",
		"left": item.elements["Location"].valueHolder.elements["X"].valueHolder.value + "px",
		"top": item.elements["Location"].valueHolder.elements["Y"].valueHolder.value + "px",
		"width": item.elements["Size"].valueHolder.elements["CX"].valueHolder.value + "px",
		"height": item.elements["Size"].valueHolder.elements["CY"].valueHolder.value + "px"
	}).append(textDiv).attr("id", item.item);
	$(location).append(div);
}

viewers["Screen"] = function (item, location) {
	var div = $.parseHTML("<div/>");
	$(div).css({
		"position": "absolute",
		"left": item.elements["Location"].valueHolder.elements["X"].valueHolder.value + "px",
		"top": item.elements["Location"].valueHolder.elements["Y"].valueHolder.value + "px"
		})
		.width(item.elements["Size"].valueHolder.elements["CX"].valueHolder.value)
		.height(item.elements["Size"].valueHolder.elements["CY"].valueHolder.value);

	viewers["WindowDrawTemplate"](items[item.elements["DrawTemplate"].valueHolder.value], div);

	// Make the text overlay.
	var textDiv = $.parseHTML("<div id='Text' class='label'>" + item.elements["Text"].valueHolder.value);
	$(textDiv).css({
		"position": "absolute",
		"color": "rgb(" + item.elements["TextColor"].valueHolder.elements["R"].valueHolder.value + ", " +
			item.elements["TextColor"].valueHolder.elements["G"].valueHolder.value + ", " +
			item.elements["TextColor"].valueHolder.elements["B"].valueHolder.value + ")",
	}).attr("title", (item.elements["TooltipReference"].valueHolder.value));

	var middleMiddleDiv = $(div).find("#MiddleMiddle");
	$(middleMiddleDiv).append(textDiv);
	for (var i = 0; i < item.elements["Pieces"].valueHolder.length; i++) {
		if (viewers[items[item.elements["Pieces"].valueHolder[i].value].type]) {
			//var pieceDiv = $.parseHTML("<div/>");
			//$(pieceDiv).css({ "position": "absolute", "overflow": "hidden" });
			viewers[items[item.elements["Pieces"].valueHolder[i].value].type](items[item.elements["Pieces"].valueHolder[i].value], middleMiddleDiv);
			//$(div).append(pieceDiv);
		}
	}

	$(location).append(div);
}
