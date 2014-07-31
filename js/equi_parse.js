items = [];
items = [];

$(function() {
	sidl = {};
	ParseSIDL();
	// code for IE7+, Firefox, Chrome, Opera, Safari
	$.get("xml/EQUI_PlayerWindow.xml", "xml")
		.done(
			function(xml) {
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
				if ((schema.attributes.item(0).value == "EverQuestData") && (schema.attributes.item(1).value == "EverQuestDataTypes" )) {
					console.log("Valid Schema.");
				} else {
					console.log("Schema should read: '<Schema xmlns=\"EverQuestData\" xmlns:dt=\"EverQuestDataTypes\" />'");
				}
				next = getSiblingElementNode(schema);
				while (next != null) {
					current = next;
					next = getSiblingElementNode(next);
					items[current.attributes.item(0).value] = $.extend(true, {}, sidl[current.nodeName]);
					parseNode(current, items[current.attributes.item(0).value]);
				}
				
				populateElementList();
			}
		);
});

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
	$(proplist).empty();
	for (var key in items[item].elements) {
		var div = $(document.createElement("div")).attr("id", item + key).click({ key: key, value: items[item].elements[key] },
			function (data) {
				if (editors[data.data.value.type]) {
					editors[data.data.value.type](data.data.key, data.data.value);
				}
			});
		$(div).text(key).append($(document.createElement("br")));

		$("#elementProperties").append($(div));
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

			if (type.search("Template") > -1) {
				$.extend(true, temp, sidl[type]);
				parsers["Template"](node.childNodes[i], temp, type);
			}
			else if (parsers[type] != null) {
				$.extend(true, temp, sidl[type]);
				parsers[type](node.childNodes[i], temp);
			}
			else {
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
