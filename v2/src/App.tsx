import React from "react";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import theme from "./theme";
import { Box, Divider, Flex, Text } from "@chakra-ui/core/dist";
import PropTree from "./components/PropTree";
import { parseSidl, SidlType } from "./utilities/sidlParse";
import SidlTree from "./components/SidlTree";
import FileListDrawer from "./components/FileListDrawer";
import { Item, parseFile } from "./utilities/fileParse";
import { parseEqui } from "./utilities/equiParse";
import DrawerTabs, {
  DrawerTab,
  DrawerTabControls
} from "./components/DrawerTabs";
import ScreenListDrawer from "./components/ScreenListDrawer";

const TEST_UI_NAME = "VoktarUI";

const App = () => {
  const [sidl, setSidl] = React.useState<Map<string, SidlType>>();

  const [files, setFiles] = React.useState<Map<string, Map<string, Item>>>();

  const [screens, setScreens] = React.useState<Map<string, Item>>();

  const [activeFile, setActiveFile] = React.useState<Map<string, Item>>();

  const [activeItem, setActiveItem] = React.useState<Item>();

  const [activeScreen, setActiveScreen] = React.useState<Item>();

  React.useEffect(() => {
    parseEqui(TEST_UI_NAME)
      .then(async includes => {
        const items = new Map<string, Map<string, Item>>();
        const screens = new Map<string, Item>();
        let sidl: Map<string, SidlType> = await parseSidl(
          TEST_UI_NAME,
          "SIDL.xml"
        );
        await Promise.all(
          includes?.map(async include => {
            const fileItems = await parseFile(TEST_UI_NAME, include, sidl);
            fileItems && items.set(include, fileItems);
            const fileScreens = Array.from(fileItems?.values() ?? []).filter(
              item => item.type.name === "Screen"
            );
            fileScreens.forEach(fileScreen =>
              screens.set(fileScreen.name, fileScreen)
            );
          })
        );
        setSidl(sidl);
        setFiles(items);
        setScreens(screens);
      })
      .catch(() => console.log("Failed to load or parse EQUI.xml"));
  }, []);

  const [tabList, setTabList] = React.useState<DrawerTab[]>([
    {
      label: "Files",
      component: props => (
        <FileListDrawer
          items={new Map()}
          setActiveItem={setActiveItem}
          {...props}
        />
      )
    },
    {
      label: "SIDL",
      component: (props: DrawerTabControls) => (
        <SidlTree sidl={new Map()} {...props} />
      )
    },
    {
      label: "Screens",
      component: props => (
        <ScreenListDrawer
          screens={screens ?? new Map()}
          setActiveScreen={setActiveScreen}
          {...props}
        />
      )
    }
  ]);

  React.useEffect(() => {
    setTabList(currentTabs => {
      const tabIndex = currentTabs.findIndex(tab => tab.label === "SIDL");
      return [
        ...currentTabs.slice(0, tabIndex),
        {
          ...currentTabs[tabIndex],
          component: props => <SidlTree sidl={sidl ?? new Map()} {...props} />
        },
        ...currentTabs.slice(tabIndex + 1)
      ];
    });
  }, [sidl]);

  React.useEffect(() => {
    setTabList(currentTabs => {
      const tabIndex = currentTabs.findIndex(tab => tab.label === "Files");
      return [
        ...currentTabs.slice(0, tabIndex),
        {
          ...currentTabs[tabIndex],
          component: props => (
            <FileListDrawer
              items={files ?? new Map()}
              setActiveItem={setActiveItem}
              {...props}
            />
          )
        },
        ...currentTabs.slice(tabIndex + 1)
      ];
    });
  }, [files]);

  React.useEffect(() => {
    setTabList(currentTabs => {
      const tabIndex = currentTabs.findIndex(tab => tab.label === "Screens");
      return [
        ...currentTabs.slice(0, tabIndex),
        {
          ...currentTabs[tabIndex],
          component: props => (
            <ScreenListDrawer
              screens={screens ?? new Map()}
              setActiveScreen={setActiveScreen}
              {...props}
            />
          )
        },
        ...currentTabs.slice(tabIndex + 1)
      ];
    });
  }, [screens]);

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Flex height="100%">
        <Flex direction="column" width="32px" backgroundColor="teal.500" pr={2}>
          <DrawerTabs tabList={tabList} />
        </Flex>
        <Box flex={0.25}>
          <Box p={2} pt={0}>
            <Text>
              <strong>{activeScreen?.name ?? "Select Screen"}</strong>
            </Text>
          </Box>
          <PropTree item={activeItem} />
        </Box>
        <Divider orientation="vertical" minH="100vh" ml={0} />
        <Box flex={1}>Text</Box>
      </Flex>
    </ThemeProvider>
  );
};

export default App;
