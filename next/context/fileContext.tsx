import React from "react";
import { parseEqui } from "../utilities/equiParse";
import { parseFile } from "../utilities/fileParse";
import { useSidl } from "./sidlContext";

type FileContext = {
  files: FileMap;
  loaded: boolean;
  activeFile?: UIFIle;
  setActiveFile(file?: UIFIle): void;
};

const FileContext = React.createContext<FileContext>({
  files: new Map(),
  loaded: false,
  activeFile: undefined,
  setActiveFile: () => {},
});

const FilesProvider = ({
  uiName,
  children,
}: {
  uiName: string;
  children: React.ReactElement;
}) => {
  const { sidl, loaded: sidlLoaded } = useSidl();
  const [loaded, setLoaded] = React.useState(false);
  const [files, setFiles] = React.useState<FileMap>(new Map());
  const [activeFile, setActiveFile] = React.useState<UIFIle>();

  React.useEffect(() => {
    sidlLoaded &&
      parseEqui(uiName)
        .then(async (includes) => {
          const files = new Map<string, Map<string, IItem>>();
          const screens = new Map<string, IItem>();
          for (let i = 0; i < includes.length; i++) {
            const include = includes[i];
            const fileItems = await parseFile(uiName, include, sidl);
            fileItems && files.set(include, fileItems);
            const fileScreens = Array.from(fileItems?.values() ?? []).filter(
              (item) => item.type.name === "Screen"
            );
            fileScreens.forEach((fileScreen) =>
              screens.set(fileScreen.name, fileScreen)
            );
          }
          setFiles(files);
        })
        .catch(() => console.log("Failed to load or parse EQUI.xml"))
        .finally(() => setLoaded(true));
  }, [uiName, sidl, sidlLoaded]);
  const value = React.useMemo(() => {
    return { files, loaded, activeFile, setActiveFile };
  }, [files, loaded, activeFile, setActiveFile]);
  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
};

export default FilesProvider;

export const useFiles = (): FileContext => {
  const files = React.useContext(FileContext);
  if (!files) {
    throw new Error("Files provider not in tree");
  }

  return files;
};
