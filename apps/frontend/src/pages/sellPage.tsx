import { useState } from "react";
import {
  Box,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Stack,
  Heading,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { ImageDropzone } from "../components";
import axios from "axios";

const REACT_APP_PINATA_API_KEY = "69236a3263e31b3e0ea6"
const REACT_APP_PINATA_SECRET_API_KEY = "abc0ef13af3beb6c04cfcb163ec4903741dbc8b4ab41079c35dc1557cb1a362b"

const SellPage = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    availableFrom: "",
    availableTo: "",
    pickupLocation: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null); // To store the image file
  const toast = useToast(); // For displaying notifications

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to upload the image to Pinata
//   const uploadImageToPinata = async (file: File) => {
//     const formData = new FormData();
//     formData.append("file", file);

//     const response = await axios.post(
//       "https://api.pinata.cloud/pinning/pinFileToIPFS",
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           "pinata-api-key": REACT_APP_PINATA_API_KEY,
//           "pinata-secret-api-key": REACT_APP_PINATA_SECRET_API_KEY,
//         //   "pinata-api-key": process.env.REACT_APP_PINATA_API_KEY,
//         //   "pinata-secret-api-key": process.env.REACT_APP_PINATA_SECRET_API_KEY,
//         },
//       }
//     );

//     return response.data.IpfsHash;
//   };

  // Function to upload metadata to Pinata
  const uploadMetadataToPinata = async (metadata: object) => {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      metadata,
      {
        headers: {
          "Content-Type": "application/json",
          "pinata-api-key": REACT_APP_PINATA_API_KEY,
          "pinata-secret-api-key": REACT_APP_PINATA_SECRET_API_KEY,
        //   "pinata-api-key": process.env.REACT_APP_PINATA_API_KEY,
        //   "pinata-secret-api-key": process.env.REACT_APP_PINATA_SECRET_API_KEY,
        },
      }
    );

    return response.data.IpfsHash;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (
      !formData.title ||
      !formData.price ||
      !formData.availableFrom ||
      !formData.availableTo ||
      !formData.pickupLocation ||
      !imageFile
    ) {
      toast({
        title: "Missing required fields.",
        description: "Please fill out all required fields and upload an image.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Step 1: Upload image to Pinata
    //   const imageCID = await uploadImageToPinata(imageFile);

      // Step 2: Prepare metadata
      const metadata = {
        ...formData,
        // image: `ipfs://${imageCID}`,
      };

      // Step 3: Upload metadata to Pinata
      const metadataCID = await uploadMetadataToPinata(metadata);

      toast({
        title: "Product uploaded successfully.",
        description: `Metadata CID: ${metadataCID}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Upload failed.",
        description:
          "There was an error uploading the product. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      p={5}
      maxW="800px"
      mx="auto"
      bg="gray.50"
      borderRadius="md"
      boxShadow="lg"
    >
      <Heading as="h2" size="lg" mb={5} textAlign="center">
        Sell Your Product
      </Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing={6}>
          {/* Image Upload */}
          <FormControl>
            <FormLabel>Upload Product Image</FormLabel>
            <ImageDropzone onFileUpload={setImageFile} />
          </FormControl>

          <Divider />

          {/* Product Title */}
          <FormControl>
            <FormLabel>Product Title</FormLabel>
            <Input
              name="title"
              placeholder="Enter product title"
              value={formData.title}
              onChange={handleInputChange}
              focusBorderColor="teal.500"
            />
          </FormControl>

          {/* Description */}
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleInputChange}
              focusBorderColor="teal.500"
            />
          </FormControl>

          {/* Price */}
          <FormControl>
            <FormLabel>Price (per day)</FormLabel>
            <Input
              name="price"
              placeholder="Enter price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              focusBorderColor="teal.500"
            />
          </FormControl>

          {/* Date Range */}
          <FormControl>
            <FormLabel>Date Available (From)</FormLabel>
            <Input
              name="availableFrom"
              placeholder="Select start date"
              type="date"
              value={formData.availableFrom}
              onChange={handleInputChange}
              focusBorderColor="teal.500"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Date Available (To)</FormLabel>
            <Input
              name="availableTo"
              placeholder="Select end date"
              type="date"
              value={formData.availableTo}
              onChange={handleInputChange}
              focusBorderColor="teal.500"
            />
          </FormControl>

          {/* Pickup Location */}
          <FormControl>
            <FormLabel>Pickup Location</FormLabel>
            <Input
              name="pickupLocation"
              placeholder="Enter pickup location"
              value={formData.pickupLocation}
              onChange={handleInputChange}
              focusBorderColor="teal.500"
            />
          </FormControl>

          {/* Submit Button */}
          <Button colorScheme="teal" type="submit" size="lg" w="full">
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default SellPage;
