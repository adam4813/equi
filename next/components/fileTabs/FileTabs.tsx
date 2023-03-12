import React from "react";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import ScreensTab from "./screensTab";
import ItemsTab from "./itemsTab";
import { useFiles } from "../../context/fileContext";

const FileTabs = ({
	setActiveItem,
}: {
	setActiveItem: (item?: IItem) => void;
}): React.ReactElement => {
	const { activeFile: file } = useFiles();
	const screens = React.useMemo(() => {
		const screenItems: IItem[] = [];
		const itemIter = file?.values();
		let item = itemIter?.next();

		while (item?.value) {
			const itemValue: IItem = item.value;
			if (
				itemValue?.type.name === "Screen" &&
				!itemValue?.propertyValues.has("ScreenID")
			) {
				screenItems.push(itemValue);
			}
			item = itemIter?.next();
		}
		return screenItems;
	}, [file]);

	const items = React.useMemo(() => {
		return Array.from(file?.values() ?? []);
	}, [file]);

	return (
		<Tabs isFitted pb="40px" height="100%">
			<TabList height="40px">
				<Tab name="Screens">Screens</Tab>
				<Tab name="Screens">Items</Tab>
			</TabList>
			<TabPanels height="100%" overflowY="auto">
				<TabPanel>
					<ScreensTab screens={screens} setActiveItem={setActiveItem} />
				</TabPanel>
				<TabPanel>
					<ItemsTab
						items={items}
						screens={screens}
						setActiveItem={setActiveItem}
					/>
				</TabPanel>
			</TabPanels>
		</Tabs>
	);
};

export default FileTabs;
