viewers = {};
{
  let script = document.createElement("script");
  script.src = "js/renderers/Ui2DAnimation.js";
  document.head.appendChild(script);
}
{
  let script = document.createElement("script");
  script.src = "js/renderers/FrameTemplate.js";
  document.head.appendChild(script);
}

/* TODO:
|- Disabled
|- PressedFlyby
|- PressedDisabled
|- *Decal (Behavior)
*/
viewers["ButtonDrawTemplate"] = function (item, location, decal_width, decal_height) {
	for (element in item.elements) {
    if (items[item.elements[element].valueHolder.value]) {
			var frame = items[item.elements[element].valueHolder.value];
      var frameDiv = $.parseHTML("<div id='" + element + "'/>");
      if (element.includes("Decal")) {
        $(frameDiv).width(decal_width).height(decal_height);
      } else {
        $(frameDiv).width($(location).width()).height($(location).height());
      }
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

function titleBar(item, location, textDiv) {
	let leftImageDiv, rightImageDiv,  middleImageDiv;
	let leftTopdiv, leftBottomdiv, rightTopdiv, rightBottomdiv;
	let leftDiv, rightDiv;
	let middle = $($.parseHTML("<div/>")).addClass("section").attr("id", "Titlebar");
	let left = $($.parseHTML("<div />")).addClass("piece").attr("id", "TitlebarLeft");
	if (items[item.elements["LeftTop"].valueHolder.value]) {
		leftTopdiv = $($.parseHTML("<div/>")).addClass("vpiece").attr("id", "TitlebarLeftTop");
		viewers["Ui2DAnimation"](items[item.elements["LeftTop"].valueHolder.value], leftTopdiv);
		$(left).append(leftTopdiv);
	}

	if (items[item.elements["Left"].valueHolder.value]) {
		leftDiv = $($.parseHTML("<div/>")).addClass("vpiece").attr("id", "TitlebarLeftMiddle");
		leftImageDiv = viewers["Ui2DAnimation"](items[item.elements["Left"].valueHolder.value], leftDiv);
		$(left).append(leftDiv)
	}

	if (items[item.elements["LeftBottom"].valueHolder.value]) {
		leftBottomdiv = $($.parseHTML("<div/>")).addClass("vpiece").attr("id", "TitlebarLeftBottom");
		viewers["Ui2DAnimation"](items[item.elements["LeftBottom"].valueHolder.value], leftBottomdiv);
		$(left).append(leftBottomdiv);
	}

	let right = $($.parseHTML("<div />")).addClass("piece").attr("id", "TitlebarRight");
	if (items[item.elements["RightTop"].valueHolder.value]) {
		rightTopdiv = $($.parseHTML("<div/>")).addClass("vpiece").attr("id", "TitlebarRightTop");
		viewers["Ui2DAnimation"](items[item.elements["RightTop"].valueHolder.value], rightTopdiv);
		$(right).append(rightTopdiv);
	}

	if (items[item.elements["Right"].valueHolder.value]) {
		rightDiv = $($.parseHTML("<div/>")).addClass("vpiece").attr("id", "TitlebarRightMiddle");
		rightImageDiv = viewers["Ui2DAnimation"](items[item.elements["Right"].valueHolder.value], rightDiv);
		$(right).append(rightDiv);
	}

	if (items[item.elements["RightBottom"].valueHolder.value]) {
		rightBottomdiv = $($.parseHTML("<div/>")).addClass("vpiece").attr("id", "TitlebarRightBottom");
		viewers["Ui2DAnimation"](items[item.elements["RightBottom"].valueHolder.value], rightBottomdiv);
		$(right).append(rightBottomdiv);
	}

	let middleEnds = ($(left).children().children().width() + $(right).children().children().width());

	let middleMiddle = $($.parseHTML("<div/>")).addClass("piece").attr("id", "TitlebarMiddleMiddle")
		.width($(location).width() - middleEnds);
  if (items[item.elements["Middle"].valueHolder.value]) {
    middleImageDiv = viewers["Ui2DAnimation"](items[item.elements["Middle"].valueHolder.value], middleMiddle);
    $(middleImageDiv).css("margin", "auto");
    $(middleImageDiv).append(textDiv)
    $(middleMiddle).append(middleImageDiv);
    $(middleMiddle).css("text-align", "center");
  }
  else {
    $(middleMiddle).append(textDiv);
    $(middleMiddle).css("margin", "auto");
    $(middle).css("text-align", "center");
  }
	$(middle).append(left).append(middleMiddle).append(right);
	
	middle.updateSize = function(width, height) {
    $(middle).height($(middleImageDiv).height());
		$(middleMiddle)
      .width(width - middleEnds).height($(middle).height());
		if (middleImageDiv !== undefined) {
			middleImageDiv.updateSize();
		}
		
    $(left).height(height);
    let capHeight = $(leftTopdiv).children().height() + $(leftBottomdiv).children().height();
    $(leftDiv).height($(middle).height() - capHeight).width(middleEnds/ 2);
		leftImageDiv.updateSize();
		
    $(right).height(height);
		capHeight = $(rightTopdiv).children().height() + $(rightBottomdiv).children().height();
    $(rightDiv).height($(middle).height() - capHeight).width(middleEnds / 2);
		rightImageDiv.updateSize();
	}
	
	return middle;
}

/* TODO:
|- BackgroundDrawType
|- VSBTemplate
|- HSBTemplate
|- CloseBox
|- QMarkBox
|- MinimizeBox
|- MaximizeBox
|- TileBox
|- Titlebar ( vertical alignment is off. should it be in the top of the frame? )
*/
viewers["WindowDrawTemplate"] = function (item, parent, titlebar, textDiv) {
	var borderDiv = $($.parseHTML("<div/>")).addClass("frame");
	$(borderDiv).height($(parent).height()).width($(parent).width());
	let titlebarDiv;
	if (titlebar) {
    titlebarDiv = titleBar(item.elements["Titlebar"].valueHolder, borderDiv, textDiv);
		borderDiv.append(titlebar);
	}
	var frameDiv = viewers["FrameTemplateOld"](item.elements["Border"].valueHolder, borderDiv, titlebarDiv);
	$(borderDiv).find("#MiddleMiddle")
		.css(
			{"background-image": 'url(img/' + fixFileExt(item.elements["Background"].valueHolder.value) + ')',
			"z-index": 1}
		);
	return borderDiv;
}

viewers["FrameTemplate"] = function (item, location) {
	var topImageDiv, leftImageDiv, rightImageDiv, bottomImageDiv, middleImageDiv, bottomDiv, topDiv;
	
	var topLeftdiv = $(document.createElement('div')).addClass("piece").attr("id", "top-left");
	location.append(topLeftdiv);
	if (items[item.elements["TopLeft"].valueHolder.value]) {
		let image = viewers["Ui2DAnimation"](items[item.elements["TopLeft"].valueHolder.value], topLeftdiv);
		topLeftdiv.append(image);
	}
	var topRightDiv = $(document.createElement('div')).addClass("piece").attr("id", "top-right");
	location.append(topRightDiv);
	if (items[item.elements["TopRight"].valueHolder.value]) {
		let image = viewers["Ui2DAnimation"](items[item.elements["TopRight"].valueHolder.value], topRightDiv);
		topRightDiv.append(image);
	}
	let capWidth = topLeftdiv.children().width() + topRightDiv.children().width();
	var topDiv = $(document.createElement('div')).addClass("piece")
		.attr("id", "top").width(location.width() - capWidth);
	location.append(topDiv);
	if (items[item.elements["Top"].valueHolder.value]) {
		let image = viewers["Ui2DAnimation"](items[item.elements["TopLeft"].valueHolder.value], topDiv);
		topDiv.append(image);
	}

	var bottomLeftDiv = $(document.createElement('div')).addClass("piece").attr("id", "bottom-left");
	location.append(bottomLeftDiv);
	if (items[item.elements["BottomLeft"].valueHolder.value]) {
		let image = viewers["Ui2DAnimation"](items[item.elements["BottomLeft"].valueHolder.value], bottomLeftDiv);
		bottomLeftDiv.append(image);
	}
	var bottomRightDiv = $(document.createElement('div')).addClass("piece").attr("id", "bottom-right");
	location.append(bottomRightDiv);
	if (items[item.elements["BottomRight"].valueHolder.value]) {
		let image = viewers["Ui2DAnimation"](items[item.elements["BottomRight"].valueHolder.value], bottomRightDiv);
		bottomRightDiv.append(image);
	}
	capWidth = bottomLeftDiv.children().width() + bottomRightDiv.children().width();
	var bottomDiv = $(document.createElement('div')).addClass("piece")
		.attr("id", "bottom").width(location.width() - capWidth);
	location.append(bottomDiv);
	if (items[item.elements["Bottom"].valueHolder.value]) {
		let image = viewers["Ui2DAnimation"](items[item.elements["Bottom"].valueHolder.value], bottomDiv);
		bottomDiv.append(image);
	}

	var topBottomHeight = topDiv.children().height() + bottomDiv.children().height();
	var middleHeight = location.height() - topBottomHeight;

	var leftTopDiv = $(document.createElement('div')).addClass("piece").attr("id", "left-top");
	location.append(leftTopDiv);
	if (items[item.elements["LeftTop"].valueHolder.value]) {
		let image = viewers["Ui2DAnimation"](items[item.elements["LeftTop"].valueHolder.value], leftTopDiv);
		leftTopDiv.append(image);
	}
	var leftBottomDiv = $(document.createElement('div')).addClass("piece").attr("id", "left-bottom");
	location.append(leftBottomDiv);
	if (items[item.elements["BottomRight"].valueHolder.value]) {
		let image = viewers["Ui2DAnimation"](items[item.elements["LeftBottom"].valueHolder.value], leftBottomDiv);
		leftBottomDiv.append(image);
	}
	let capHeight = leftTopDiv.children().height() + leftBottomDiv.children().height();
	var leftDiv = $(document.createElement('div')).addClass("piece")
		.attr("id", "left").height(middleHeight - capHeight)
	location.append(leftDiv);
	if (items[item.elements["Left"].valueHolder.value]) {
		let image = viewers["Ui2DAnimation"](items[item.elements["Left"].valueHolder.value], leftDiv);
		leftDiv.append(image);
	}


	var rightTopDiv = $(document.createElement('div')).addClass("piece").attr("id", "right-top");
	location.append(rightTopDiv);
	if (items[item.elements["RightTop"].valueHolder.value]) {
		let image = viewers["Ui2DAnimation"](items[item.elements["RightTop"].valueHolder.value], rightTopDiv);
		rightTopDiv.append(image);
	}
	var rightBottomDiv = $(document.createElement('div')).addClass("piece").attr("id", "right-bottom");
	location.append(rightBottomDiv);
	if (items[item.elements["RightBottom"].valueHolder.value]) {
		let image = viewers["Ui2DAnimation"](items[item.elements["RightBottom"].valueHolder.value], rightBottomDiv);
		rightBottomDiv.append(image);
	}
	capHeight = rightTopDiv.children().height() + rightBottomDiv.children().height();
	var rightDiv = $(document.createElement('div')).addClass("piece")
		.attr("id", "right").height(middleHeight - capHeight)
	location.append(rightDiv);
	if (items[item.elements["Right"].valueHolder.value]) {
		let image = viewers["Ui2DAnimation"](items[item.elements["Right"].valueHolder.value], rightDiv);
		rightDiv.append(image);
	}

	var leftRightWidth = leftDiv.children().width() + rightDiv.children().width();

	var middleDiv = $(document.createElement('div')).addClass("piece").attr("id", "middle")
		.width(location.width() - leftRightWidth).height(middleHeight);
	location.append(middleDiv);
	if (items[item.elements["Middle"].valueHolder.value]) {
		let image = viewers["Ui2DAnimation"](items[item.elements["Middle"].valueHolder.value], middleDiv);
		middleDiv.append(image);
	}
	
	location.updateSize = function() {
	}
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
|- SoundPressed
|- SoundUp
|- SoundFlyby
*/
viewers["Button"] = function (item, location) {
	var left = parseInt(item.elements["Location"].valueHolder.elements["X"].valueHolder.value);
	var top = parseInt(item.elements["Location"].valueHolder.elements["Y"].valueHolder.value);
	var width = item.elements["Size"].valueHolder.elements["CX"].valueHolder.value;
	var height = item.elements["Size"].valueHolder.elements["CY"].valueHolder.value;
	var decal_width = item.elements["DecalSize"].valueHolder.elements["CX"].valueHolder.value;
	var decal_height = item.elements["DecalSize"].valueHolder.elements["CY"].valueHolder.value;

	if (item.elements["AutoStretch"].valueHolder.value === true) {
		width = $(location).width();
		height = $(location).height();

		var anchor_top_offset = item.elements["TopAnchorOffset"].valueHolder.value;
		if (item.elements["TopAnchorToTop"].valueHolder.value) {
			top = anchor_top_offset;
		} else {
			top = height - anchor_top_offset;
		}

		var anchor_bottom_offset = item.elements["BottomAnchorOffset"].valueHolder.value;
		if (item.elements["BottomAnchorToTop"].valueHolder.value) {
			height = anchor_bottom_offset;
		} else {
			height = height - anchor_bottom_offset - top;
		}

		var anchor_left_offset = item.elements["LeftAnchorOffset"].valueHolder.value;
		if (item.elements["LeftAnchorToLeft"].valueHolder.value) {
			left = anchor_left_offset;
		} else {
			left = width - anchor_left_offset;
		}
		
		var anchor_righ_offsett = item.elements["RightAnchorOffset"].valueHolder.value;
		if (item.elements["RightAnchorToLeft"].valueHolder.value) {
			width = anchor_righ_offsett;
		} else {
			width = width - anchor_righ_offsett - left;
		}
	}
	else {
		if (width < decal_width) {
			width = decal_width;
		}
		if (height < decal_height) {
			height = decal_height;
		}
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

  viewers["ButtonDrawTemplate"](item.elements["ButtonDrawTemplate"].valueHolder, textDiv, decal_width, decal_height);
  if (items[item.elements["Template"].valueHolder.value]) {
    viewers["ButtonDrawTemplate"](items[item.elements["Template"].valueHolder.value], textDiv, decal_width, decal_height);
  }

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
	return div;
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
	return div;
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
viewers["Label"] = function (item, parent) {
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
	let rgb = item.elements["TextColor"].valueHolder.elements;
	$(textDiv).css({
		"color": "rgb(" + rgb["R"].valueHolder.value + ", " +
			rgb["G"].valueHolder.value + ", " +
			rgb["B"].valueHolder.value + ")",
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
	$(parent).append(div);
	return div;
}

viewers["Screen"] = function (item, location) {
	let x = item.elements["Location"].valueHolder.elements["X"].valueHolder.value;
	let y = item.elements["Location"].valueHolder.elements["Y"].valueHolder.value;
	let width = item.elements["Size"].valueHolder.elements["CX"].valueHolder.value;
	let height = item.elements["Size"].valueHolder.elements["CY"].valueHolder.value;
	var screenDiv = $(document.createElement('div')).width(width).height(height).css({
		"position": "absolute",
		"left": x + "px",
		"top": y + "px"
		});

	// Make the text overlay.
	
	let textDiv = $.parseHTML("<div id='Text' class='label'>" + item.elements["Text"].valueHolder.value);
	let rgb = item.elements["TextColor"].valueHolder.elements;
  $(textDiv).attr("title", (item.elements["TooltipReference"].valueHolder.value)).css({
		"color": "white"/*"rgb(" + rgb["R"].valueHolder.value + ", " +
			rgb["G"].valueHolder.value + ", " +
			rgb["B"].valueHolder.value + ")"*/,
	});

  var templateDiv = viewers["WindowDrawTemplate"](items[item.elements["DrawTemplate"].valueHolder.value], screenDiv, item.elements["Style_Titlebar"].valueHolder.value, textDiv);
	screenDiv.append(templateDiv);
	let middleMiddleDiv = templateDiv.find("#MiddleMiddle");
	
	let pieces = item.elements["Pieces"].valueHolder;
	for (var i = 0; i < pieces.length; i++) {
		let pieceItem = items[pieces[i].value];
		if (viewers[pieceItem.type]) {
			viewers[pieceItem.type](pieceItem, middleMiddleDiv);
		}
	}
	
	screenDiv.updateSize = function() {
		let width = item.elements["Size"].valueHolder.elements["CX"].valueHolder.value;
		let height = item.elements["Size"].valueHolder.elements["CY"].valueHolder.value;
		screenDiv.width(width).height(height);
		templateDiv.width(width).height(height);
		templateDiv.updateSize();
	}

	return screenDiv;
}
