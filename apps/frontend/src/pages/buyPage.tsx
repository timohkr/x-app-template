import { Box, Input, Select, Grid, Button } from "@chakra-ui/react";

const BuyPage = () => {
  return (
    <Box p={5}>
      <form>
        {/* Filters */}
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          <Input placeholder="Date to Rent (From)" type="date" />
          <Input placeholder="Date to Rent (To)" type="date" />
          <Input placeholder="Search Products" />
          <Select placeholder="Category">
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
          </Select>
        </Grid>

        {/* Product Listing */}
        <Grid templateColumns="repeat(3, 1fr)" gap={4} mt={5}>
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
            <img src="product-image-url" alt="Product" />
            <Box mt={2}>
              <h3>Product Name</h3>
              <p>Price: $XX per day</p>
              <Button colorScheme="teal">Buy</Button>
            </Box>
          </Box>
          {/* Add more product cards as necessary */}
        </Grid>
      </form>
    </Box>
  );
};

export default BuyPage;
