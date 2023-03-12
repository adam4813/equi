import type { NextPage } from "next";

import { useState } from "react";

import { Box, Divider, Flex } from "@chakra-ui/react";

import PropTree from "components/PropTree";
import DrawerList from "components/drawers";
import FileTabs from "components/fileTabs";
import ItemRenderer from "components/ItemRenderer";
import { useSidl } from "context/sidlContext";
import { useFiles } from "context/fileContext";

const Home: NextPage = () => {
	const { loaded: sidlLoaded } = useSidl();
	const { loaded: filesLoaded } = useFiles();

	const [activeItem, setActiveItem] = useState<IItem>();
	return (
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
	);
};

export default Home;
