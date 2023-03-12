import React from "react";
import { Button } from "@chakra-ui/core/dist";

const ItemListItem: React.FC<{
  item: IItem;
  setActiveItem(item: IItem): void;
}> = ({ item, setActiveItem }) => {
  return (
    <Button
      variantColor="blue"
      variant="link"
      onClick={() => setActiveItem(item)}
    >
      {item.name}
    </Button>
  );
};

export default ItemListItem;
