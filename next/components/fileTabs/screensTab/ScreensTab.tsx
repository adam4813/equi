import React from "react";
import { List, ListItem } from "@chakra-ui/react";
import ScreenListItem from "./ScreenListItem";

const ScreensTab: React.FC<{
	screens: IItem[];
	setActiveItem(item: IItem): void;
}> = ({ screens, setActiveItem }) => {
	return (
		<List>
			{screens.map((screen) => (
				<ListItem key={screen.name} _odd={{ backgroundColor: "#E2E8F0" }} p={2}>
					<ScreenListItem screen={screen} setActiveItem={setActiveItem} />
				</ListItem>
			))}
		</List>
	);
};

export default ScreensTab;
