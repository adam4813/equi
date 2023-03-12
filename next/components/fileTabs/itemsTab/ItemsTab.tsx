import React from "react";
import { List, ListItem } from "@chakra-ui/react";
import ItemListItem from "./ItemListItem";

const ItemsTab: React.FC<{
	items: IItem[];
	screens: IItem[];
	setActiveItem(item: IItem): void;
}> = ({ items, screens, setActiveItem }) => {
	// Filter out items that under under screens and the screens themselves
	const filteredItems = React.useMemo(() => {
		const pieces: IItem[] = [];
		screens.forEach((screen) => {
			const screenPieces =
				(screen.propertyValues.get("Pieces") as IItem[])?.filter(
					(item) => item
				) ?? [];
			pieces.push(...screenPieces, screen);
		});
		return (
			items?.filter(
				(item) => !pieces.find((piece) => item.name === piece.name)
			) ?? []
		);
	}, [items, screens]);

	return (
		<List mx={2} mb={2}>
			{filteredItems.map((item) => (
				<ListItem key={item.name}>
					<ItemListItem item={item} setActiveItem={setActiveItem} />
				</ListItem>
			))}
		</List>
	);
};

export default ItemsTab;
