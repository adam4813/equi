items = [];
items = [];

$(function() {
	sidl = {};
	ParseSIDL();
	$.ajaxSetup({ async: false });
	parseXML("EQUI_Animations.xml");
	parseXML("EQUI_PlayerWindow.xml");
	$.ajaxSetup({ async: false });
	populateElementList();
});

function parseXML(filename) {
	$.get("xml/" + filename, "xml")
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
				next = getSiblingElementNode(schema);
				while (next != null) {
					current = next;
					next = getSiblingElementNode(next);
					items[current.attributes.item(0).value] = $.extend(true, {}, sidl[current.nodeName]);
					items[current.attributes.item(0).value].type = current.nodeName;
					parseNode(current, items[current.attributes.item(0).value]);
				}
			}
		);
}

function populateElementList() {
	// Add a select to choose the element to view.
	$("#elementList").append($(document.createElement("select"))).change(function() { showElementProperties($("#elementList > select option:selected").val()); });

	// Populate the list
	var select = $("#elementList > select");
	for (var item in items) {
		$(select).append($(document.createElement("option")).val(item).text(item));
	}
	showElementProperties($("#elementList > :first").val());
}

function showElementProperties(item) {
	var proplist = document.getElementById("elementProperties");
	$(document.getElementById("renderView")).empty();
	$(proplist).empty();
	if (items[item].type == "Button") {
		viewers["Button"](items[item], "#renderView");
	} else if (items[item].type == "Ui2DAnimation") {
		viewers["Ui2DAnimation"](items[item], "#renderView");
	} else {
		for (var key in items[item].elements) {
			var div = $(document.createElement("div")).attr("id", item + key).click({ key: key, value: items[item].elements[key] },
				function (data) {
					if ((data.data.value.type.search("Template") > -1) && !(data.data.value.isItem)) {
						editors["Template"](data.data.key, data.data.value, data.data.value.type);
					} else if ((data.data.value.isItem) && (!data.data.value.isArray)) {
						editors["string"](data.data.key, data.data.value);
					} else if ((data.data.value.isItem) && (data.data.value.isArray)) {
						editors["itemArray"](data.data.key, data.data.value, data.data.value.type);
					} else if (editors[data.data.value.type]) {
						editors[data.data.value.type](data.data.key, data.data.value);
					}
				});
			$(div).text(key).append($(document.createElement("br")));

			$("#elementProperties").append($(div));
		}
	}
}

function parseNode(node, parent) {
	var name = node.nodeName;
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
