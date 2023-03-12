import React from "react";
import { parseSidl } from "../utilities/sidlParse";

type SIDLContext = { sidl: SidlMap; loaded: boolean };

const SIDLContext = React.createContext<SIDLContext>({
  sidl: new Map(),
  loaded: false
});

const SIDLProvider = ({
  uiName,
  children
}: {
  uiName: string;
  children: React.ReactElement;
}) => {
  const [loaded, setLoaded] = React.useState(false);
  const [sidl, setSidl] = React.useState<SidlMap>(new Map());
  React.useEffect(() => {
    parseSidl(uiName, "SIDL.xml")
      .then(setSidl)
      .finally(() => setLoaded(true));
  }, [uiName]);
  const value = React.useMemo(() => {
    return { sidl, loaded };
  }, [sidl, loaded]);
  return <SIDLContext.Provider value={value}>{children}</SIDLContext.Provider>;
};

export default SIDLProvider;

export const useSidl = (): SIDLContext => {
  const sidl = React.useContext(SIDLContext);
  if (!sidl) {
    throw new Error("SIDL provider not in tree");
  }

  return sidl;
};
