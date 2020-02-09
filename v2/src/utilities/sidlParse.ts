export class SidlType implements ISidlType {
  name!: string;
  superType: SidlType | undefined;
  _properties: SidlProp[] = [];
  defaultValue?: number | string | boolean;
  get properties(): SidlProp[] {
    return [...this._properties, ...(this.superType?.properties ?? [])];
  }
  addProperty = (prop: SidlProp) => this._properties.push(prop);
}

function initSidlBaseElementTypes(SIDL: Map<string, SidlType>) {
  let intSidlType = new SidlType();
  intSidlType.name = "int";
  intSidlType.defaultValue = 0;
  SIDL.set("int", intSidlType);

  let stringSidlType = new SidlType();
  stringSidlType.name = "string";
  stringSidlType.defaultValue = "Soandso";
  SIDL.set("string", stringSidlType);

  let booleanSidlType = new SidlType();
  booleanSidlType.name = "boolean";
  booleanSidlType.defaultValue = false;
  SIDL.set("boolean", booleanSidlType);
}

function parseSidlElementProp(propNode: Element, SIDL: Map<string, SidlType>): SidlProp {
  // TODO: store this to validate later when editing
  const minOccurs = propNode.attributes.getNamedItem("minOccurs")?.value;
  //const maxOccurs = propNode.attributes.getNamedItem("maxOccurs")?.value;

  let type = propNode.attributes.getNamedItem("type")?.value ?? "";
  let isItem = false;
  if (type.indexOf(":item") > -1) {
    isItem = true;
    type = type.split(":")[0];
  }

  return {
    name: propNode.attributes.getNamedItem("name")?.value ?? "",
    type: SIDL.get(type),
    isItem,
    isArray: !!minOccurs,
    defaultValue: propNode?.firstElementChild?.innerHTML
  };
}

function parseSidlElementType(elementNode: Element, SIDL: Map<string, SidlType>) {
  let element: SidlType = new SidlType();
  element.name = elementNode.attributes.getNamedItem("name")?.value ?? "";

  let child = elementNode.firstElementChild;
  while (child !== null) {
    if (child.nodeName === "superType") {
      const superType = child.attributes.getNamedItem("type")?.value;

      if (superType && SIDL.has(superType)) {
        element.superType = SIDL.get(superType);
      }
    } else if (child.nodeName === "element" || child.nodeName === "attribute") {
      const prop = parseSidlElementProp(child, SIDL);
      if (!element.properties.find(elementProp => elementProp.name === prop.name)) {
        element.addProperty(prop);
      }
    }
    child = child.nextElementSibling;
  }

  return element;
}

function validateFileMeta(sidlDoc: XMLDocument) {
  const rootNode = (sidlDoc.getRootNode() as XMLDocument).firstElementChild;
  if (rootNode === null) {
    console.log("Can't find XML root node.");
    return false;
  }
  if (
    rootNode.attributes.getNamedItem("ID")?.value ===
    "EQInterfaceDefinitionLanguage"
  ) {
    console.log("Valid XML ID.");
  } else {
    console.log(
      "XML ID should read: '<XML ID=\"EQInterfaceDefinitionLanguage\">'"
    );
    return false;
  }

  const schemaNode = rootNode.firstElementChild;
  if (schemaNode === null) {
    console.log("Can't find Schema node.");
    return false;
  }
  if (
    schemaNode.attributes.getNamedItem("xmlns")?.value === "EverQuestData" &&
    schemaNode.attributes.getNamedItem("xmlns:dt")?.value ===
      "EverQuestDataTypes"
  ) {
    console.log("Valid Schema.");
  } else {
    console.log(
      'Schema should read: \'<Schema xmlns="EverQuestData" xmlns:dt="EverQuestDataTypes" />\''
    );
    return false;
  }
  return true;
}

const parseSidl = async () => {
  const parser = new DOMParser();
  return fetch(`http://${window.location.hostname}:8080/xml/SIDL.xml`)
    .then((result: any) => result.text())
    .then(doc => {
      const sidlDoc = parser.parseFromString(doc, "application/xml");
      if (validateFileMeta(sidlDoc)) {
        let SIDL: Map<string, SidlType> = new Map();
        initSidlBaseElementTypes(SIDL);

        const rootNode = (sidlDoc.getRootNode() as XMLDocument)
          .firstElementChild;
        const schemaNode = rootNode!.firstElementChild;
        let child = schemaNode!.firstElementChild;
        while (child !== null) {
          const elementType = parseSidlElementType(child, SIDL);
          SIDL.set(elementType.name, elementType);
          child = child.nextElementSibling;
        }
        return Promise.resolve(SIDL);
      }

      return Promise.reject();
    });
};

export default parseSidl;
