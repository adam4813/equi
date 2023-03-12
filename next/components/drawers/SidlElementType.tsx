import React from "react";
import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
} from "@chakra-ui/react";

const SidlElementType: React.FC<{ sidlElementType: ISidlType }> = ({
	sidlElementType,
}) => (
	<Accordion allowMultiple key={sidlElementType.name}>
		<AccordionItem>
			{({ isExpanded }) => (
				<>
					<h1>
						<AccordionButton>
							<Box flex="1" textAlign="left">
								{sidlElementType.name}
							</Box>
							<AccordionIcon />
						</AccordionButton>
					</h1>
					<AccordionPanel pb={4}>
						{isExpanded &&
							sidlElementType.properties.map((property) => (
								<Accordion allowMultiple key={property.name}>
									<AccordionItem>
										<h2>
											<AccordionButton>
												<Box flex="1" textAlign="left">
													{property.name}
												</Box>
												<AccordionIcon />
											</AccordionButton>
										</h2>
										<AccordionPanel pb={4}>
											<Box>Is array: {property.isArray ? "true" : "false"}</Box>
											<Box>Is item: {property.isItem ? "true" : "false"}</Box>
											<Box>Default Value: {property.defaultValue}</Box>
											<Box>Type: {property.type?.name}</Box>
											{property.type?.properties.map((typeProperty) => (
												<Accordion allowMultiple key={typeProperty.name}>
													<AccordionItem>
														<h3>
															<AccordionButton>
																<Box flex="1" textAlign="left">
																	{typeProperty.name}
																</Box>
																<AccordionIcon />
															</AccordionButton>
														</h3>
														<AccordionPanel pb={4}>
															<Box>
																Is array:{" "}
																{typeProperty.isArray ? "true" : "false"}
															</Box>
															<Box>
																Is item:{" "}
																{typeProperty.isItem ? "true" : "false"}
															</Box>
															<Box>
																Default Value: {typeProperty.defaultValue}
															</Box>
															<Box>Type: {typeProperty.type?.name}</Box>
														</AccordionPanel>
													</AccordionItem>
												</Accordion>
											))}
										</AccordionPanel>
									</AccordionItem>
								</Accordion>
							))}
					</AccordionPanel>
				</>
			)}
		</AccordionItem>
	</Accordion>
);

export default SidlElementType;
