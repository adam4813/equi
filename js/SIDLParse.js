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

			sidl["int"] =
				{ type: "int", default: 0, isItem: false, isArray: false, value: 0 };
			sidl["string"] =
				{ type: "string", default: "", isItem: false, isArray: false, value: "" };
			sidl["boolean"] =
				{ type: "boolean", default: false, isItem: false, isArray: false, value: false };

			var rootElement = getChildElementNode(schema); // Get the first top level ElementType.
			while (rootElement != null) {
				elementType = rootElement.attributes.item(0).value; // Name of the top level ElementType.
				sidl[elementType] = {}; // Make a new object with the name of this top level ElementType.

				var child = getChildElementNode(rootElement); // Get the first element of this top level ElementType.
				while (child != null) {
					// Check if there is a superType to extend first.
					if (child.nodeName == "superType") {
						var superType = child.attributes.item(0).value;
						sidl[elementType] = $.extend(true, {}, sidl[superType]);
					}

					if (child.nodeName == "element") {
						var subElementName = child.attributes.item(0).value;
						var subElementType = child.attributes.item(1).value;

						var itemType = false;
						if (subElementType.search(":item") > -1) {
							itemType = true;
							subElementType = subElementType.split(":")[0];
						}

						var arrayType = false;
						if (child.attributes.length > 2) {
							arrayType = true;
						}

						var defaultValue = "";
						if (child.childNodes.length > 0) {
							defaultValue = getChildElementNode(child).firstChild.data;
						}

						// If this is the first sub element there isn't an elements member yet.
						if (!sidl[elementType].elements) {
							sidl[elementType].elements = {};
						}
						sidl[elementType].elements[subElementName] =
							{ type: subElementType, default: defaultValue, isItem: itemType, isArray: arrayType };
						if (sidl[subElementType] && !arrayType) {
							sidl[elementType].elements[subElementName].valueHolder = $.extend(true, {}, sidl[subElementType]);
							// This is a POD so set its default value accordingly.
							if (sidl[elementType].elements[subElementName].valueHolder.value!=  null) {
								sidl[elementType].elements[subElementName].valueHolder.value = defaultValue;
							}
						} else if (arrayType) {
							sidl[elementType].elements[subElementName].valueHolder = [];
						} else {
							sidl[elementType].elements[subElementName].valueHolder = defaultValue;
						}
					}
					child = getSiblingElementNode(child); // Get the next element of the top level ElementType.
				}

				rootElement = getSiblingElementNode(rootElement); // Get the next top level ElementType.
			}
		}
	);
	$.ajaxSetup({ async: true });
}
