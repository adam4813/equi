import React from "react";
import { Tab, TabList, Tabs } from "@chakra-ui/core/dist";

export interface DrawerTabControls {
  isOpen: boolean;
  onClose(): void;
}

export interface DrawerTab {
  label: string;
  component: React.FunctionComponent<DrawerTabControls>;
}

const DrawerTabs: React.FC<{ tabList: DrawerTab[] }> = ({ tabList }) => {
  const [openDrawer, setOpenDrawer] = React.useState<DrawerTab | null>(null);

  React.useEffect(() => {
    const updatedOpenDrawer = tabList.find(
      tab => tab.label === openDrawer?.label
    );
    if (updatedOpenDrawer) {
      setOpenDrawer(updatedOpenDrawer);
    }
  }, [tabList, openDrawer]);
  return (
    <Tabs variant="enclosed" orientation="vertical">
      <TabList>
        {tabList.map(tab => (
          <Tab
            key={tab.label}
            as="span"
            onClick={() => setOpenDrawer(tab)}
            backgroundColor="white"
            style={{
              textOrientation: "upright",
              writingMode: "vertical-rl",
              borderColor: "unset",
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 4,
              letterSpacing: -2
            }}
            height="unset"
            px={0}
            mb="-4px"
            fontSize={12}
            fontWeight="bold"
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>
      {openDrawer?.component({
        isOpen: true,
        onClose: () => setOpenDrawer(null)
      })}
    </Tabs>
  );
};

export default DrawerTabs;
