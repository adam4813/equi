import React from "react";
import { CSSReset, ThemeProvider, Box, Divider, Flex } from "@chakra-ui/core";
import theme from "./theme";

import PropTree from "./components/PropTree";
import DrawerList from "./components/drawers";
import FileTabs from "./components/fileTabs";
import ItemRenderer from "./components/ItemRenderer";
import { useSidl } from "./context/sidlContext";
import { useFiles } from "context/fileContext";

export const TEST_UI_NAME = "VoktarUI";

const App = () => {
  const { loaded: sidlLoaded } = useSidl();
  const { loaded: filesLoaded } = useFiles();

  const [activeItem, setActiveItem] = React.useState<IItem>();

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Flex height="100%">
        <Flex direction="column" width="32px" backgroundColor="teal.500" pr={2}>
          {filesLoaded && <DrawerList />}
        </Flex>
        <Box flex={0.25}>
          <Flex flexDir="column" height="100%">
            <Box flex={1} maxHeight="50vh" height="50vh">
              <FileTabs setActiveItem={setActiveItem} />
            </Box>
            <Box flex={1} maxHeight="50vh" height="50vh">
              <PropTree item={activeItem} />
            </Box>
          </Flex>
        </Box>
        <Divider orientation="vertical" minH="100vh" ml={0} />
        <Box flex={1}>
          {!activeItem &&
            (!sidlLoaded ? "Loading" : "Select from the left to begin")}
          <ItemRenderer item={activeItem} />
        </Box>
      </Flex>
    </ThemeProvider>
  );
};

export default App;
