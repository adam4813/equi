items = [];
files = [];
sidl = {};
images = {};

$(function() {
	parseSIDL(sidlLoaded);
});

function sidlLoaded() {
	addToFileTree("EQUI_Animations");
	parseXML("EQUI_Animations");
	addToFileTree("EQUI_Templates");
	parseXML("EQUI_Templates");
	addToFileTree("EQUI_PlayerWindow");
	parseXML("EQUI_PlayerWindow");
}

function parseXML(filename) {
	$.get("xml/" + filename + ".xml", "xml")
		.done(
			function (xml) {
				var root = getChildElementNode(xml);
				if (root == null) {
					console.log("Can't find XML root node.");
					return;
				}
				if (root.attributes.item(0).value == "EQInterfaceDefinitionLanguage") {
					console.log("Valid XML ID.");
				} else {
					console.log("XML ID should read: '<XML ID=\"EQInterfaceDefinitionLanguage\">'");
				}
				var schema = getChildElementNode(root);
				if (schema == null) {
					console.log("Can't find Schema node.");
					return;
				}
				if ((schema.attributes.item(0).value == "EverQuestData") && (schema.attributes.item(1).value == "EverQuestDataTypes")) {
					console.log("Valid Schema.");
				} else {
					console.log("Schema should read: '<Schema xmlns=\"EverQuestData\" xmlns:dt=\"EverQuestDataTypes\" />'");
				}
				files[filename] = {elements: []};
				next = getSiblingElementNode(schema);
				while (next != null) {
					current = next;
					next = getSiblingElementNode(next);
					var newItem = $.extend(true, {}, sidl[current.nodeName]);
					files[filename].elements[current.attributes.item(0).value] = items[current.attributes.item(0).value] = newItem;
					newItem.type = current.nodeName;
					newItem.item = current.attributes.item(0).value;
					parseNode(current, newItem);
				}
			}
		);
}

function addToFileTree(filename) {
	var div = $(document.createElement("div")).attr("id", filename);
	$(div).addClass("inlineChildren header")
		.click({filename: filename}, function(data) {
			var self = $(this);
			if (data.target == this) {
				self.find("> :first").toggle();
			}
			if (!self.data("populated")) {
				self.data("screenElement", populateFileElements(data.data.filename));
				self.data("populated", true);
				self.find("> :first").show();
			}
			if (self.data("screenElement") !== undefined) {
				targetDiv = viewers["Screen"](items[self.data("screenElement")], "#renderView");
				$("#renderView").empty().append(targetDiv);
			}
		})
		.text(filename)
		.append($(document.createElement("div")).attr("id", filename + "ItemList"));
	$("#fileTree").append($(div));
}

function populateFileTree() {
	for (var file in files) {
		addToFileTree(file);
	}
}

function populateFileElements(filename) {
	var parent = $("#" + filename + "ItemList");
	let screenElement;
	
	// Presort based on element type
	var itemsByType = [];
	for (var element in files[filename].elements) {
		if (items[element].type == "Screen") {
			screenElement = element;
		}
		else {
			if (typeof itemsByType[items[element].type] === "undefined") {
				itemsByType[items[element].type] = [];
			}
			itemsByType[items[element].type].push(element);
		}
	}
	
	// Populate divs
	for (var type in itemsByType) {
		var typeDiv = $("<div />").text(type).addClass("fileElementsContainer");
		var itemDiv = $("<div />").hide().addClass("fileElementsList");
		typeDiv.append($(itemDiv))
			.click(function(data) {
				if (data.target == this) {
					$(this).find("> :first").toggle();
				}
			});
		parent.append($(typeDiv));
		for (var index in itemsByType[type]) {
			var element = itemsByType[type][index];
			itemDiv.append(
				$("<div />")
					.text(element)
					.click({element: element}, function(data) {
						showElementProperties(data.data.element);
					})
			);
		}
	}
	return screenElement;
}

function hideFileItems(filename) {
	$("#" + filename + "ItemList").empty();
}

function showElementProperties(item) {
	var proplist = document.getElementById("elementProperties");
	$(document.getElementById("renderView")).empty();
	$(proplist).empty();
	var targetDiv;
	if (items[item].type == "Button") {
		targetDiv = viewers["Button"](items[item], "#renderView");
	} else if (items[item].type == "TextureInfo") {
		targetDiv = viewers["TextureInfo"](items[item], "#renderView");
	} else if (items[item].type == "Ui2DAnimation") {
		// We must do this specific for raw Ui2DAnimation to get it to size the parent element correctly.
		var imgDiv = $.parseHTML("<div width='0px' height='0px'/>");
		targetDiv = viewers["Ui2DAnimation"](items[item], imgDiv);
	} else if (items[item].type == "Gauge") {
		targetDiv = viewers["Gauge"](items[item], "#renderView");
	} else if (items[item].type == "Label") {
		targetDiv = viewers["Label"](items[item], "#renderView");
	} else if (items[item].type == "Screen") {
		targetDiv = viewers["Screen"](items[item], "#renderView");
	} else if (items[item].type == "WindowDrawTemplate") {
		targetDiv = viewers["WindowDrawTemplate"](items[item], "#renderView", true);
	}
	$("#renderView").append(targetDiv);
	if (targetDiv === "undefined") {
		console.log(item[item].type);
	}
	for (var key in items[item].elements) {
		var div = $(document.createElement("div")).attr("id", item + key).click({ key: key, value: items[item].elements[key], target: targetDiv },
			function (data) {
				if ((data.data.value.type.search("Template") > -1) && !(data.data.value.isItem)) {
					editors["Template"](data.data.key, data.data.value, data.data.value.type, data.data.target);
				} else if ((data.data.value.isItem) && (!data.data.value.isArray)) {
					editors["string"](data.data.key, data.data.value, data.data.target);
				} else if ((data.data.value.isItem) && (data.data.value.isArray)) {
					editors["itemArray"](data.data.key, data.data.value, data.data.value.type, data.data.target);
				} else if (editors[data.data.value.type]) {
					editors[data.data.value.type](data.data.key, data.data.value, data.data.target);
				}
			});
		$(div).text(key).append($(document.createElement("br")));

		$(proplist).append($(div));
	}
}

function parseNode(node, parent) {
	var name = node.nodeName;
	if (name === "TextureInfo") {
		let img = viewers["TextureInfo"]({item: node.attributes[0].nodeValue}, "#preload");
		$("#preload").append(img);
	}
	for (var i = 0; i < node.childNodes.length; i++) {
		if (node.childNodes[i].nodeType == 1) {
			var sidlNode = sidl[name].elements[node.childNodes[i].nodeName];

			if (!sidlNode) {
				continue;
			}
			var type = sidlNode.type;

			var temp = {};

			if ((type.search("Template") > -1) && (!sidlNode.isItem)) {
				$.extend(true, temp, sidl[type]);
				parsers["Template"](node.childNodes[i], temp, type);
			} else if (sidlNode.isItem) {
				$.extend(true, temp, sidl["string"]);
				parsers["string"](node.childNodes[i], temp);
			} else if (parsers[type] != null) {
				$.extend(true, temp, sidl[type]);
				parsers[type](node.childNodes[i], temp);
			} else {
				// This node is a container type. Set its type from the SIDL,
				// and recurse to parse the child nodes.
				$.extend(true, temp, sidl[name]);
				parseNode(node.childNodes[i], temp);
			}

			if (sidlNode.isArray) {
				if (parent.elements[node.childNodes[i].nodeName].valueHolder == null) {
					parent.elements[node.childNodes[i].nodeName].valueHolder = [];
				}
				parent.elements[node.childNodes[i].nodeName].valueHolder.push(temp);
			} else {
				parent.elements[node.childNodes[i].nodeName].valueHolder = temp;
			}
		}
	}
}

function loadScript(script_name) {
	$.ajaxSetup({async:false});
	$.getScript(script_name)
	.done(function(script, textStatus) {
		  console.log( "Loaded " + script_name + " with " + textStatus );
		});
	$.ajaxSetup({async:true});
}

// Finds the next sibling ELEMENT node.
function getSiblingElementNode(node) {
	x = node.nextSibling;
	try {
		while (x.nodeType != 1) {
			x = x.nextSibling;
		}
	} catch (Exception) {
		return null;
	}
	return x;
}

// Finds the first child ELEMENT node.
function getChildElementNode(node) {
	x = node.firstChild;
	try {
		while (x.nodeType != 1) {
			x = x.nextSibling;
		}
	} catch (Exception) {
		return null;
	}
	return x;
}
