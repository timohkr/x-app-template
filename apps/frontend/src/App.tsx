import { DAppKitProvider } from "@vechain/dapp-kit-react";
import { ChakraProvider, Container, Flex } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Dropzone,
  Footer,
  InfoCard,
  Instructions,
  Navbar,
  SubmissionModal,
} from "./components";
import { lightTheme } from "./theme";
import SellPage from "./pages/sellPage";
import BuyPage from "./pages/buyPage";

function App() {
  return (
    <ChakraProvider theme={lightTheme}>
      <DAppKitProvider
        usePersistence
        requireCertificate={false}
        genesis="test"
        nodeUrl="https://testnet.vechain.org/"
        logLevel={"DEBUG"}
      >
        <Router>
          <Navbar />
          <Flex flex={1}>
            <Container
              mt={{ base: 4, md: 10 }}
              maxW={"container.xl"}
              mb={{ base: 4, md: 10 }}
              display={"flex"}
              flex={1}
              alignItems={"center"}
              justifyContent={"flex-start"}
              flexDirection={"column"}
            >
              <Routes>
                {/* Main app content */}
                <Route path="/" element={<MainPage />} />

                {/* Sell page */}
                <Route path="/sell" element={<SellPage />} />

                {/* Buy page */}
                <Route path="/buy" element={<BuyPage />} />
              </Routes>
            </Container>
          </Flex>
          <Footer />

          {/* MODALS */}
          <SubmissionModal />
        </Router>
      </DAppKitProvider>
    </ChakraProvider>
  );
}

// Separate MainPage component for better readability
const MainPage = () => (
  <>
    <InfoCard />
    <Instructions />
    <Dropzone />
  </>
);

export default App;
