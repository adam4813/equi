import React from "react";
import DrawerTabs from "./DrawerTabs";
import FileListDrawer from "./FileListDrawer";
import SidlDrawer from "./SidlDrawer";

const DrawerList = (): React.ReactElement => {
  const sidlTab = React.useMemo(
    () => ({
      label: "SIDL",
      component: SidlDrawer
    }),
    []
  );

  const filesTab = React.useMemo(
    () => ({
      label: "Files",
      component: FileListDrawer
    }),
    []
  );

  return <DrawerTabs tabList={[sidlTab, filesTab]} />;
};

export default DrawerList;
