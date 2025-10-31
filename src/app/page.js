import { Button, HStack } from "@chakra-ui/react"
import { redirect } from "next/navigation";

const Home = () => {
  redirect('./signup')
}

export default Home;