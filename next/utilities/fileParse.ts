import { getOrDefault, validateFileMeta } from "./fileUtils";

class Item implements IItem {
	name!: string;
	type!: ISidlType;
	propertyValues: Map<string, ItemPropertyValue | ItemPropertyValue[]> =
		new Map();
}

const allItems: Map<string, Item> = new Map();

function parseProp(
	propRootElement: Element,
	rootElementType: ISidlType,
	SIDL: Map<string, ISidlType>,
	existingItems: Map<string, Item>
) {
	const propTypeName = propRootElement.tagName;
	const propType = rootElementType.properties.find(
		(property) => property.name === propTypeName
	);

	let prop;
	if (propType?.isItem) {
		const delimIndex = propRootElement.innerHTML.indexOf(":");
		const itemName = propRootElement.innerHTML.slice(
			delimIndex >= 0 ? delimIndex + 1 : 0
		);
		if (!existingItems.has(itemName)) {
			//console.log(`Couldn't find ${itemName} (${propRootElement.innerHTML})`);
		}
		prop = existingItems.get(itemName)!;
	} else if (propType?.type?.properties.length === 0) {
		prop = propRootElement.innerHTML ?? propType.defaultValue;
	} else {
		let subPropRootElement = propRootElement.firstElementChild;
		const subProps = new Map<string, ItemPropertyValue | ItemPropertyValue[]>();
		while (subPropRootElement !== null) {
			const subPropTypeName = subPropRootElement.tagName;
			const subProp = parseProp(
				subPropRootElement,
				propType!.type as ISidlType,
				SIDL,
				existingItems
			) as ItemPropertyValue | ItemPropertyValue[];
			subProps.set(subPropTypeName, subProp);
			subPropRootElement = subPropRootElement.nextElementSibling;
		}
		prop = subProps;
	}

	return propType?.isArray ? [prop] : prop;
}

function parseItem(
	itemRootElement: Element,
	SIDL: Map<string, ISidlType>,
	existingItems: Map<string, Item>
): Item | undefined {
	const itemName = itemRootElement.attributes.getNamedItem("item")?.value;
	const typeName = itemRootElement.tagName;
	if (!itemName || !SIDL.has(typeName)) {
		//console.log("Failed to parse item name, or element type missing");
		return undefined;
	}
	const item = new Item();

	item.name = itemName;
	item.type = SIDL.get(typeName)!;

	let propRootElement = itemRootElement.firstElementChild;
	while (propRootElement !== null) {
		const propTypeName = propRootElement.tagName;
		const prop = parseProp(propRootElement, item.type, SIDL, existingItems) as
			| ItemPropertyValue
			| ItemPropertyValue[];
		if (Array.isArray(prop)) {
			const existingProp = item.propertyValues.get(
				propTypeName
			) as ItemPropertyValue[];
			if (existingProp) {
				existingProp.push(...prop);
			} else {
				item.propertyValues.set(propTypeName, prop);
			}
		} else {
			prop && item.propertyValues.set(propTypeName, prop);
		}
		propRootElement = propRootElement.nextElementSibling;
	}

	return item;
}

async function parseFile(
	uiName: string,
	filename: string,
	SIDL: Map<string, ISidlType>
) {
	const parser = new DOMParser();

	return getOrDefault(uiName, filename)
		.then((result: any) => result.text())
		.then((doc) => {
			const sidlDoc = parser.parseFromString(doc, "application/xml");
			if (validateFileMeta(sidlDoc)) {
				const rootElement = (sidlDoc.getRootNode() as XMLDocument)
					.firstElementChild;
				const schemaElement = rootElement!.firstElementChild;
				let child = schemaElement!.nextElementSibling;
				const items: Map<string, Item> = new Map();
				while (child !== null) {
					const item = parseItem(child, SIDL, allItems);
					if (item) {
						items.set(item.name, item);
						allItems.set(item.name, item);
					}
					child = child.nextElementSibling;
				}
				return Promise.resolve(items);
			}
		});
}

export { parseFile, Item };
