import Head from "next/head";
import Typography from "@mui/material/Typography";
import { Header } from "@/components/Header";
import Box from "@mui/material/Box";
import { Name } from "@/components/Name";

export default function Page500() {

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
        <Header />
        <Box display="flex" justifyContent="center">
          <Typography variant="h4">
            500 | Internal Server Error
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: "light" }}>
          It seems like we are having a maintenance. Please stay calm and touch
          grass. <Name display="inline" /> will be online back in near future.
        </Typography>
      </Box>
    </>
  )
}
