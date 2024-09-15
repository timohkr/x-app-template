import { DAppKitProvider } from "@vechain/dapp-kit-react";
import { ChakraProvider, Container, Flex, Divider } from "@chakra-ui/react";
import {
  Dropzone,
  Footer,
  InfoCard,
  Instructions,
  Navbar,
  SubmissionModal,
  Listing,
} from "./components";
import { lightTheme } from "./theme";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SellPage from "./pages/SellPage";

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
        <Routes>
          {/* Main app content */}
          <Route path="/" element={<MainPage />} />
          {/* Sell page */}
          <Route path="/sell" element={<SellPage />} />
        </Routes>

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
            {/* <InfoCard />
            <Instructions />
            <Dropzone />
            <Divider my={6} borderColor="gray.300" />
            <Listing /> */}
          </Container>
        </Flex>
        </Router>
        <Footer />

        {/* MODALS  */}
        <SubmissionModal />
      </DAppKitProvider>
    </ChakraProvider>
  );
}
const MainPage = () => (
  <>
    <InfoCard />
    <Instructions />
    <Dropzone />
    <Divider my={6} borderColor="gray.300" />
    <Listing />
  </>
);

export default App;
