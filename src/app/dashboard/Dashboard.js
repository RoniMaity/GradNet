"use client";

import { Box, Flex } from "@chakra-ui/react";

export default function Dashboard() {
    return (
        <Flex bg={"white"}>
            <Box marginLeft="190px"></Box>
            <Box
                display={{ base: "none", lg: "block" }}
                w="272px"
                borderLeft="1px solid"
                bg={"grey"}
            ></Box>
            <Box flex="1" maxW="600px" minH="100vh" bg={"lightyellow"}></Box>
            <Box w="350px" borderLeft="1px solid" bg={"lightblue"}>
                Right Sidebar
            </Box>
        </Flex>
    );
}
