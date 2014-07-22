function ParseSIDL() {
	$.ajaxSetup({async:false});
	$.get("xml/SIDL.xml", "xml")
	.done(
		function(xml) {
			var root = getChildElementNode(xml);
			if (root == null) {
				console.log("Can't find XML root node.");
				return;
			}
			if (root.attributes.item(0).nodeValue == "EQInterfaceDefinitionLanguage") {
				console.log("Valid XML ID.");
			} else {
				console.log("XML ID should read: '<XML ID=\"EQInterfaceDefinitionLanguage\">'");
			}
			var schema = getChildElementNode(root);
			if (schema == null) {
				console.log("Can't find Schema node.");
				return;
			}
			if ((schema.attributes.item(0).nodeValue == "EverQuestData") && (schema.attributes.item(1).nodeValue == "EverQuestDataTypes" )) {
				console.log("Valid Schema.");
			} else {
				console.log("Schema should read: '<Schema xmlns=\"EverQuestData\" xmlns:dt=\"EverQuestDataTypes\" />'");
			}
			sidl["int"] = {};
			sidl["int"].type = "int";
			sidl["int"].default = 0;
			sidl["int"].value = 0;
			sidl["string"] = {};
			sidl["string"].type = "string";
			sidl["string"].default = "";
			sidl["string"].value = "";
			sidl["boolean"] = {};
			sidl["boolean"].type = "boolean";
			sidl["boolean"].default = false;
			sidl["boolean"].value = false;
			n = getChildElementNode(schema);
			while (n != null) {
				elementType = n.attributes.item(0).nodeValue
				sidl[elementType] = {};
				var child = getChildElementNode(n);
				while (child != null) {
					if (child.nodeName == "superType") {
						var superType = child.attributes.item(0).nodeValue;
						sidl[elementType] = sidl[superType];
						sidl[elementType] = $.extend(true, {}, sidl[superType]);
						child = getSiblingElementNode(child);
						continue;
					}
					var attributeName = child.attributes.item(0).nodeValue;
					var attributeType = child.attributes.item(1).nodeValue;
					sidl[elementType][attributeName] = {};
					if (attributeType.search(":item") > -1) {
						sidl[elementType][attributeName].item = true;
					} else {
						sidl[elementType][attributeName].item = false;
					}
					attributeType = attributeType.split(":")[0];
					sidl[elementType][attributeName].type = attributeType;
					if (child.attributes.item(2) != null) {
						sidl[elementType][attributeName].array = true;
						sidl[elementType][attributeName].value = [];
					} else {
						sidl[elementType][attributeName].array = false;
						if (sidl[attributeType] != null) {
							sidl[elementType][attributeName].value = sidl[attributeType];
						}
						if (child.childNodes.length > 0) {
							var defaultChild = getChildElementNode(child);
							sidl[elementType][attributeName].value.default = defaultChild.firstChild.data;
						}
					}
					child = getSiblingElementNode(child);
				}
				n = getSiblingElementNode(n);
			}
		}
	);
	$.ajaxSetup({async:true});
}
