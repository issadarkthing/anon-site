import { Header } from "@/components/Header";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { Name } from "@/components/Name";


export default function About() {
  return (
    <>
      <Head>
        <title>anonmi</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="center"
        gap="30px"
      >
        <Header href="/" />
        <Typography variant="body1">
          <Name variant="h6" display="inline"/> is an anonymous Q&A platform.
          The platform should give the freedom to users to send you a message
          without having to disclose their personal info. No account creation
          is needed when sending a message to any user which makes it easier 
          for anyone to use this application.
        </Typography>
      </Box>
    </>
  )
}
