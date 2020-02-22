import { getOrDefault, validateFileMeta } from "./fileUtils";

async function parseEqui(uiName: string = "default") {
  return getOrDefault(uiName, "EQUI.xml")
    .then(result => result.text())
    .then(async doc => {
      const parser = new DOMParser();
      const sidlDoc = parser.parseFromString(doc, "application/xml");
      if (validateFileMeta(sidlDoc)) {
        const rootElement = (sidlDoc.getRootNode() as XMLDocument)
          .firstElementChild;
        let child = rootElement?.firstElementChild?.firstElementChild; // XML > Composite > Include ...

        let includes: string[] = [];
        while (child) {
          if (child.innerHTML !== "SIDL.xml") {
            includes.push(child.innerHTML);
          }
          child = child.nextElementSibling;
        }
        return Promise.resolve(includes);
      }

      return Promise.reject();
    })
    .catch(err => {
      console.log(
        "File not found, and not suitable default could be loaded",
        err
      );
      return Promise.reject();
    });
}

export { parseEqui };
