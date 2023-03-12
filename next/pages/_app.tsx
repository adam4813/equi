import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";

import SIDLProvider from "context/sidlContext";
import FilesProvider from "context/fileContext";

export const TEST_UI_NAME = "VoktarUI";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<SIDLProvider uiName={TEST_UI_NAME}>
			<FilesProvider uiName={TEST_UI_NAME}>
				<ChakraProvider>
					<Component {...pageProps} />
				</ChakraProvider>
			</FilesProvider>
		</SIDLProvider>
	);
}

export default MyApp;
