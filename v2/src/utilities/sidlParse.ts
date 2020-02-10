class SidlType implements ISidlType {
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

function parseSidlElementProp(
  propRootElement: Element,
  SIDL: Map<string, SidlType>
): SidlProp {
  // TODO: store this to validate later when editing
  const minOccurs = propRootElement.attributes.getNamedItem("minOccurs")?.value;
  //const maxOccurs = propRootElement.attributes.getNamedItem("maxOccurs")?.value;

  let typeName = propRootElement.attributes.getNamedItem("type")?.value ?? "";
  let isItem = false;
  if (typeName.indexOf(":item") > -1) {
    isItem = true;
    typeName = typeName.split(":")[0];
  }

  return {
    name: propRootElement.attributes.getNamedItem("name")?.value ?? "",
    type: SIDL.get(typeName),
    isItem,
    isArray: !!minOccurs,
    defaultValue: propRootElement?.firstElementChild?.innerHTML
  };
}

function parseSidlElementType(
  rootElement: Element,
  SIDL: Map<string, SidlType>
) {
  const element: SidlType = new SidlType();
  element.name = rootElement.attributes.getNamedItem("name")?.value ?? "";

  let child = rootElement.firstElementChild;
  while (child !== null) {
    if (child.tagName === "superType") {
      const superType = child.attributes.getNamedItem("type")?.value;

      if (superType && SIDL.has(superType)) {
        element.superType = SIDL.get(superType);
      }
    } else if (child.tagName === "element" || child.tagName === "attribute") {
      const prop = parseSidlElementProp(child, SIDL);
      if (
        !element.properties.find(elementProp => elementProp.name === prop.name)
      ) {
        element.addProperty(prop);
      }
    }
    child = child.nextElementSibling;
  }

  return element;
}

function validateFileMeta(sidlDoc: XMLDocument) {
  const rootElement = (sidlDoc.getRootNode() as XMLDocument).firstElementChild;
  if (rootElement === null) {
    console.log("Can't find XML root element.");
    return false;
  }
  if (
    rootElement.attributes.getNamedItem("ID")?.value ===
    "EQInterfaceDefinitionLanguage"
  ) {
    console.log("Valid XML ID.");
  } else {
    console.log(
      "XML ID should read: '<XML ID=\"EQInterfaceDefinitionLanguage\">'"
    );
    return false;
  }

  const schemaElement = rootElement.firstElementChild;
  if (schemaElement === null) {
    console.log("Can't find Schema element.");
    return false;
  }
  if (
    schemaElement.attributes.getNamedItem("xmlns")?.value === "EverQuestData" &&
    schemaElement.attributes.getNamedItem("xmlns:dt")?.value ===
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

async function parseSidl() {
  return fetch(`http://${window.location.hostname}:8080/xml/SIDL.xml`)
    .then((result: any) => result.text())
    .then(doc => {
      const parser = new DOMParser();
      const sidlDoc = parser.parseFromString(doc, "application/xml");
      if (validateFileMeta(sidlDoc)) {
        let SIDL: Map<string, SidlType> = new Map();
        initSidlBaseElementTypes(SIDL);

        const rootElement = (sidlDoc.getRootNode() as XMLDocument)
          .firstElementChild;
        const schemaElement = rootElement!.firstElementChild;
        let child = schemaElement!.firstElementChild;
        while (child !== null) {
          const elementType = parseSidlElementType(child, SIDL);
          SIDL.set(elementType.name, elementType);
          child = child.nextElementSibling;
        }
        return Promise.resolve(SIDL);
      }

      return Promise.reject();
    });
}

export { parseSidl, validateFileMeta, SidlType };
