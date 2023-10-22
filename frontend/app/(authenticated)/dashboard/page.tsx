"use client";

import React from "react";

// Chakra imports
import {
  Box,
  Button,
  Flex,
  Grid,
  Text,
  useColorModeValue,
  SimpleGrid,
  Link,
} from "@chakra-ui/react";

// Custom components
import TableTopCreators from "src/views/admin/marketplace/components/TableTopCreators";
import HistoryItem from "src/views/admin/marketplace/components/HistoryItem";
import NFT from "src/components/card/NFT";
import Card from "src/components/card/Card";
import tableDataTopCreators from "src/views/admin/marketplace/variables/tableDataTopCreators";

// Assets
import Nft1 from "src/img/nfts/Nft1.png";
import Nft2 from "src/img/nfts/Nft2.png";
import Nft3 from "src/img/nfts/Nft3.png";
import Nft4 from "src/img/nfts/Nft4.png";
import Nft5 from "src/img/nfts/Nft5.png";
import Nft6 from "src/img/nfts/Nft6.png";
import Avatar1 from "src/img/avatars/avatar1.png";
import Avatar2 from "src/img/avatars/avatar2.png";
import Avatar3 from "src/img/avatars/avatar3.png";
import Avatar4 from "src/img/avatars/avatar4.png";
// import AdminLayout from '@/views/admin';

export default function NftMarketplace() {
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.500", "white");
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        mb="20px"
        gridTemplateColumns={{ xl: "repeat(3, 1fr)", "2xl": "1fr 0.46fr" }}
        gap={{ base: "20px", xl: "20px" }}
        display={{ base: "block", xl: "grid" }}
      >
        <Flex flexDirection="column" gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}>
          <Flex direction="column">
            <Flex
              mt="45px"
              mb="20px"
              justifyContent="space-between"
              direction={{ base: "column", md: "row" }}
              align={{ base: "start", md: "center" }}
            >
              <Text color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
                Trending Problems
              </Text>
              <Flex
                align="center"
                me="20px"
                ms={{ base: "24px", md: "0px" }}
                mt={{ base: "20px", md: "0px" }}
              >
                <Link
                  href="#easy"
                  color={textColorBrand}
                  fontWeight="500"
                  me={{ base: "34px", md: "44px" }}
                >
                  Easy
                </Link>
                <Link
                  href="#medium"
                  color={textColorBrand}
                  fontWeight="500"
                  me={{ base: "34px", md: "44px" }}
                >
                  Medium
                </Link>
                <Link href="#hard" color={textColorBrand} fontWeight="500">
                  Hard
                </Link>
              </Flex>
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap="20px">
              <NFT
                name="Contains Duplicate"
                author="By Kar Wi"
                bidders={[Avatar1, Avatar2, Avatar3, Avatar4, Avatar1, Avatar1, Avatar1, Avatar1]}
                image={Nft1}
                currentbid="Medium"
                download="#"
              />
              <NFT
                name="Valid Anagram"
                author="By Didymus Ne"
                bidders={[Avatar1, Avatar2, Avatar3, Avatar4, Avatar1, Avatar1, Avatar1, Avatar1]}
                image={Nft2}
                currentbid="Medium"
                download="#"
              />
              <NFT
                name="Two Sum "
                author="By Hong Po"
                bidders={[Avatar1, Avatar2, Avatar3, Avatar4, Avatar1, Avatar1, Avatar1, Avatar1]}
                image={Nft3}
                currentbid="Medium"
                download="#"
              />
            </SimpleGrid>
            <Text mt="45px" mb="36px" color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
              Recently Added
            </Text>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap="20px" mb={{ base: "20px", xl: "0px" }}>
              <NFT
                name="Group Anagrams"
                author="By Yong Ler"
                bidders={[Avatar1, Avatar2, Avatar3, Avatar4, Avatar1, Avatar1, Avatar1, Avatar1]}
                image={Nft4}
                currentbid="Medium"
                download="#"
              />
              <NFT
                name="Top K Frequent Elements"
                author="By Andrew"
                bidders={[Avatar1, Avatar2, Avatar3, Avatar4, Avatar1, Avatar1, Avatar1, Avatar1]}
                image={Nft5}
                currentbid="Medium"
                download="#"
              />
              <NFT
                name="Product of Array Except Self"
                author="By Manny Gates"
                bidders={[Avatar1, Avatar2, Avatar3, Avatar4, Avatar1, Avatar1, Avatar1, Avatar1]}
                image={Nft6}
                currentbid="Medium"
                download="#"
              />
            </SimpleGrid>
          </Flex>
        </Flex>
        <Flex flexDirection="column" gridArea={{ xl: "1 / 3 / 2 / 4", "2xl": "1 / 2 / 2 / 3" }}>
          <Card px="0px" mb="20px">
            <TableTopCreators tableData={tableDataTopCreators} />
          </Card>
          <Card p="0px">
            <Flex
              align={{ sm: "flex-start", lg: "center" }}
              justify="space-between"
              w="100%"
              px="22px"
              py="18px"
            >
              <Text color={textColor} fontSize="xl" fontWeight="600">
                My Attempts
              </Text>
              <Button variant="action">See all</Button>
            </Flex>

            <HistoryItem
              name="Top K Frequent Elements"
              author="By Andrew"
              date="30s ago"
              image={Nft5}
              // price="0.91 ETH"
            />
            <HistoryItem
              name="Contains Duplicate"
              author="By Kar Wi"
              date="58s ago"
              image={Nft1}
              // price="0.91 ETH"
            />
            <HistoryItem
              name="Valid Anagram"
              author="By Didymus Ne"
              date="1m ago"
              image={Nft2}
              // price="0.91 ETH"
            />
            <HistoryItem
              name="Group Anagrams"
              author="By Yong Ler"
              date="1m ago"
              image={Nft4}
              // price="0.91 ETH"
            />
            <HistoryItem
              name="Two Sum "
              author="By Hong Po"
              date="2m ago"
              image={Nft3}
              // price="0.91 ETH"
            />
            <HistoryItem
              name="Product of Array Except Self"
              author="By Manny Gates"
              date="3m ago"
              image={Nft6}
              // price="0.91 ETH"
            />
          </Card>
        </Flex>
      </Grid>
      {/* Delete Product */}
    </Box>
  );
}
