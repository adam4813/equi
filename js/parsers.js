parsers = [];

parsers["string"] = function ParseString(node, target) {
	if (node.innerHTML != "") {
		target.value = node.innerHTML;
	}
	else {
		target.value = target.default;
	}
}

parsers["int"] = function ParseInt(node, target) {
	if (node.innerHTML != "") {
		target.value = parseInt(node.innerHTML);
	}
	else {
		target.value = target.default;
	}
}

parsers["boolean"] = function ParseBoolean(node, target) {
	if (node.innerHTML != "") {
		target.value = (node.innerHTML.toLowerCase() === 'true');
	}
	else {
		target.value = target.default;
	}
}

parsers["Point"] = function ParsePoint(node, target) {
	if (node.getElementsByTagName("X").length > 0) { target.elements["X"].valueHolder.value = parseInt(node.getElementsByTagName("X")[0].firstChild.nodeValue); }
	if (node.getElementsByTagName("Y").length > 0) { target.elements["Y"].valueHolder.value = parseInt(node.getElementsByTagName("Y")[0].firstChild.nodeValue); }
}

parsers["Size"] = function ParseSize(node, target) {
	if (node.getElementsByTagName("CX").length > 0) { target.elements["CX"].valueHolder.value = node.getElementsByTagName("CX")[0].firstChild.nodeValue; }
	if (node.getElementsByTagName("CY").length > 0) { target.elements["CY"].valueHolder.value = node.getElementsByTagName("CY")[0].firstChild.nodeValue; }
}

parsers["RGB"] = function ParseRGB(node, target) {
	if (node.getElementsByTagName("Alpha").length > 0) { target.elements["Alpha"].valueHolder.value = node.getElementsByTagName("Alpha")[0].firstChild.nodeValue; }
	if (node.getElementsByTagName("R").length > 0) { target.elements["R"].valueHolder.value = node.getElementsByTagName("R")[0].firstChild.nodeValue; }
	if (node.getElementsByTagName("G").length > 0) { target.elements["G"].valueHolder.value = node.getElementsByTagName("G")[0].firstChild.nodeValue; }
	if (node.getElementsByTagName("B").length > 0) { target.elements["B"].valueHolder.value = node.getElementsByTagName("B")[0].firstChild.nodeValue; }
}

parsers["Frame"] = function ParseFrame(node, target) {
	for (property in target.elements) {
		nodes = node.getElementsByTagName(property);
		if (nodes.length > 0) {
			n = nodes[0];
			if (n.nodeName == "Texture") {
				parsers["string"](n, target.elements["Texture"].valueHolder);
			} else if (n.nodeName == "Location") {
				//target.elements["Location"].valueHolder = $.extend(true, {}, sidl["Point"]);
				parsers["Point"](n, target.elements["Location"].valueHolder);
			} else if (n.nodeName == "Hotspot") {
				//target.elements["Hotspot"].valueHolder = $.extend(true, {}, sidl["Point"]);
				parsers["Point"](n, target.elements["Hotspot"].valueHolder);
			} else if (n.nodeName == "Size") {
				//target.elements["Size"].valueHolder = $.extend(true, {}, sidl["Size"]);
				parsers["Size"](n, target.elements["Size"].valueHolder);
			} else if (n.nodeName == "Duration") {
				parsers["int"](n, target.elements["Duration"].valueHolder);
			}
		}
	}
}

parsers["Template"] = function ParseFrame(node, target, type) {
	for (property in target.elements) {
		nodes = node.getElementsByTagName(property);
		if (nodes.length > 0) {
			parsers["string"](nodes[0], target.elements[property].valueHolder);
		}
	}
}
