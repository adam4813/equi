function validateFileMeta(sidlDoc: XMLDocument) {
  const rootElement = sidlDoc.getElementsByTagName("XML").item(0);
  if (rootElement === null) {
    console.log("Can't find XML root element.");
    return false;
  }
  if (
    rootElement.attributes.getNamedItem("ID")?.value ===
    "EQInterfaceDefinitionLanguage"
  ) {
    //console.log("Valid XML ID.");
  } else {
    console.log(
      "XML ID should read: '<XML ID=\"EQInterfaceDefinitionLanguage\">'"
    );
    return false;
  }

  const schemaElement = rootElement.getElementsByTagName("Schema").item(0);
  if (schemaElement === null) {
    console.log("Can't find Schema element.");
    return false;
  }
  if (
    schemaElement.attributes.getNamedItem("xmlns")?.value === "EverQuestData" &&
    schemaElement.attributes.getNamedItem("xmlns:dt")?.value ===
      "EverQuestDataTypes"
  ) {
    //console.log("Valid Schema.");
  } else {
    console.log(
      'Schema should read: \'<Schema xmlns="EverQuestData" xmlns:dt="EverQuestDataTypes" />\''
    );
    return false;
  }
  return true;
}

// Should be done on the server, but just in case
async function getOrDefault(uiName: string = "default", fileName: string) {
  return fetch(`/xml/${uiName}/${fileName}`).then((result) => {
    if (result.ok) {
      return result;
    } else {
      /*console.log(
                `${fileName} not found in ui ${uiName}, attempting to load from default.`
            );*/
      return fetch(`/xml/default/${fileName}`).then((result) => {
        if (result.ok) {
          return result;
        }
      });
    }
  });
}

export { validateFileMeta, getOrDefault };
