import { SidlType, validateFileMeta } from "./sidlParse";

export type ItemPropertyValue =
  | number
  | string
  | boolean
  | Map<
      string,
      number | string | boolean | Map<string, number | string | boolean>
    >
  | Item;

class Item {
  name!: string;
  type!: SidlType;
  propertyValues: Map<
    string,
    ItemPropertyValue | ItemPropertyValue[]
  > = new Map();
}

const allItems: Map<string, Item> = new Map();

function parseProp(
  propRootElement: Element,
  rootElementType: SidlType,
  SIDL: Map<string, SidlType>,
  existingItems: Map<string, Item>
) {
  const propTypeName = propRootElement.tagName;
  const propType = rootElementType.properties.find(
    property => property.name === propTypeName
  );

  let prop;
  if (propType?.isItem) {
    prop = existingItems.get(propRootElement.innerHTML)!;
  } else if (propType?.type?.properties.length === 0) {
    prop = propRootElement.innerHTML ?? propType.defaultValue;
  } else {
    let subPropRootElement = propRootElement.firstElementChild;
    const subProps = new Map<string, ItemPropertyValue | ItemPropertyValue[]>();
    while (subPropRootElement !== null) {
      const subPropTypeName = subPropRootElement.tagName;
      const subPropType = propType?.type?.properties.find(
        property => property.name === subPropTypeName
      );
      const subProp = parseProp(
        subPropRootElement,
        propType!.type as SidlType,
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
  SIDL: Map<string, SidlType>,
  existingItems: Map<string, Item>
): Item | undefined {
  const itemName = itemRootElement.attributes.getNamedItem("item")?.value;
  const typeName = itemRootElement.tagName;
  if (!itemName || !SIDL.has(typeName)) {
    console.log("Failed to parse item name, or element type missing");
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
  filename: string,
  SIDL: Map<string, SidlType>
) {
  return fetch(`http://${window.location.hostname}:8080/xml/${filename}.xml`)
    .then((result: any) => result.text())
    .then(doc => {
      const parser = new DOMParser();
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

export { parseFile, Item, SidlType };
