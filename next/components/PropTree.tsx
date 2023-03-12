import React from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Item } from "../utilities/fileParse";

const PropElement: React.FC<{
	prop: ItemPropertyValue | ItemPropertyValue[];
}> = ({ prop }) => {
	return Array.isArray(prop) ? (
		<Box pl={4}>
			{(prop as ItemPropertyValue[]).map((propItem, key) => {
				if (propItem instanceof Item) {
					return <Box key={key}>{(propItem as IItem).name}</Box>;
				}
				if (propItem instanceof Map) {
					return (
						<Box key={key}>
							{Array.from(
								(propItem as Map<string, string | number | boolean>).entries()
							).map(([key, value]) => (
								<Box key={key}>
									{key}:{" "}
									{typeof value !== "object" ? (
										value
									) : (
										<PropElement prop={value} />
									)}
								</Box>
							))}
						</Box>
					);
				}
				return null;
			})}
		</Box>
	) : prop instanceof Map ? (
		<Box pl={4}>
			{Array.from(
				(prop as Map<string, string | number | boolean>).entries()
			).map(([key, value]) => (
				<Box key={key}>
					{key}:
					{typeof value !== "object" ? value : <PropElement prop={value} />}
				</Box>
			))}
		</Box>
	) : prop instanceof Item ? (
		<Text as="span">{prop.name}</Text>
	) : typeof prop === "string" ? (
		<Text as="span">{prop}</Text>
	) : (
		<Box>Unknown</Box>
	);
};

const PropTree: React.FC<{ item: IItem | undefined }> = ({ item }) => (
	<Flex flexDir="column" height="100%">
		<Heading
			as="h5"
			size="sm"
			p={2}
			height="40px"
			borderTop="1px solid"
			borderBottom="1px solid"
			borderColor="inherit"
		>
			{item?.name}
		</Heading>
		<Box height="100%" overflowY="auto">
			<Box mx={2} mb={2}>
				{Array.from(item?.propertyValues.entries() ?? []).map(
					([key, value]) => (
						<Box key={key} textAlign="left">
							{key}:{" "}
							{typeof value !== "object" ? value : <PropElement prop={value} />}
						</Box>
					)
				)}
			</Box>
		</Box>
	</Flex>
);

export default PropTree;
