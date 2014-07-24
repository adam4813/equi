parsers = [];

parsers["string"] = function ParseString(node, target) {
	if (target.value.value) {
		target.value.value = node.innerHTML;
	} else {
		target.value = node.innerHTML;
	}
}

parsers["int"] = function ParseInt(node, target) {
	target.value = parseInt(node.innerHTML);
}

parsers["boolean"] = function ParseBoolean(node, target) {
	target.value = (node.innerHTML.toLowerCase() === 'true');
}

parsers["Point"] = function ParsePoint(node, target) {
	if (node.getElementsByTagName("X").length > 0) { target.value["X"].value = node.getElementsByTagName("X")[0].firstChild.nodeValue; }
	if (node.getElementsByTagName("Y").length > 0) { target.value["Y"].value = node.getElementsByTagName("Y")[0].firstChild.nodeValue; }
}

parsers["Size"] = function ParseSize(node, target) {
	if (node.getElementsByTagName("CX").length > 0) { target.value["CX"].value = node.getElementsByTagName("CX")[0].firstChild.nodeValue; }
	if (node.getElementsByTagName("CY").length > 0) { target.value["CY"].value = node.getElementsByTagName("CY")[0].firstChild.nodeValue; }
}

parsers["RGB"] = function ParseRGB(node, target) {
	if (node.getElementsByTagName("Alpha").length > 0) { target.value["Alpha"].value = node.getElementsByTagName("Alpha")[0].firstChild.nodeValue; }
	if (node.getElementsByTagName("R").length > 0) { target.value["R"].value = node.getElementsByTagName("R")[0].firstChild.nodeValue; }
	if (node.getElementsByTagName("G").length > 0) { target.value["G"].value = node.getElementsByTagName("G")[0].firstChild.nodeValue; }
	if (node.getElementsByTagName("B").length > 0) { target.value["B"].value = node.getElementsByTagName("B")[0].firstChild.nodeValue; }
}

parsers["Frame"] = function ParseFrame(node, target) {
	for (property in target) {
		nodes = node.getElementsByTagName(property);
		if (nodes.length > 0) {
			n = nodes[0];
			if (n.nodeName == "Texture") {
				parsers["string"](n, target["Texture"]);
			} else if (n.nodeName == "Location") {
				parsers["Point"](n, target["Location"]);
			} else if (n.nodeName == "Hotspot") {
				parsers["Point"](n, target["Hotspot"]);
			} else if (n.nodeName == "Size") {
				parsers["Size"](n, target["Size"]);
			} else if (n.nodeName == "Duration") {
				parsers["int"](n, target["Duration"]);
			}
		}
	}
}
