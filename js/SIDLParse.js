sidl_tree = [];

function parseSIDL(cb) {
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
				{ type: "int", default: 0, isItem: false, isArray: false, value: 0, super_type: ""};
			sidl["string"] =
				{ type: "string", default: "Soandso", isItem: false, isArray: false, value: "", super_type: "" };
			sidl["boolean"] =
				{ type: "boolean", default: false, isItem: false, isArray: false, value: false, super_type: "" };

			var rootElement = getChildElementNode(schema); // Get the first top level ElementType.
			while (rootElement != null) {
				sidlElementType = rootElement.attributes.item(0).value; // Name of the top level ElementType.
				sidl[elementType] = {}; // Make a new object with the name of this top level ElementType.

				var child = getChildElementNode(rootElement); // Get the first element of this top level ElementType.
				while (child != null) {
					// Check if there is a superType to extend first.
					if (child.nodeName == "superType") {
						var superType = child.attributes.item(0).value;
						sidl[elementType] = $.extend(true, {}, sidl[superType]);
						sidl[elementType].super_type = superType;
						var parent_tree = new Array();
						while (superType != "") {
							parent_tree.push(superType);
							if (sidl[superType].super_type != null) {
								superType = sidl[superType].super_type;
							}
							else {
								superType = "";
							}
						}
						var child_leaf;
						superType = parent_tree.pop();
						if (sidl_tree[superType]) {
							child_leaf = sidl_tree[superType];
						}
						else {
							sidl_tree[superType] = {};
							sidl_tree[superType].elements = sidl[superType].elements;
						}
						while (parent_tree.length > 0) {
							var superType = parent_tree.pop();
							if (child_leaf[superType]) {
								child_leaf = child_leaf[superType];
							}
							else {
								if (child_leaf) {
									child_leaf[superType] = {};
								}
								else {
									sidl_tree[superType] = {};
									sidl_tree[superType].elements = sidl[superType].elements;
								}
							}
						}
						if (child_leaf) {
							child_leaf[elementType] = {};
							child_leaf[elementType].elements = sidl[elementType].elements;
						}
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
						if (sidl[subElementType] && !arrayType && !itemType) {
							sidl[elementType].elements[subElementName].valueHolder = $.extend(true, {}, sidl[subElementType]);
							// This is a POD so set its default value accordingly.
							if (sidl[elementType].elements[subElementName].valueHolder.value!=  null) {
								sidl[elementType].elements[subElementName].valueHolder.value = defaultValue;
							}
						} else if (arrayType) {
							sidl[elementType].elements[subElementName].valueHolder = [];
						} else if (itemType) {
							sidl[elementType].elements[subElementName].valueHolder = $.extend(true, {}, sidl["string"]);
						}else {
							sidl[elementType].elements[subElementName].valueHolder = defaultValue;
						}
					}
					child = getSiblingElementNode(child); // Get the next element of the top level ElementType.
				}

				rootElement = getSiblingElementNode(rootElement); // Get the next top level ElementType.
			}
			cb();
		}
	);
}
