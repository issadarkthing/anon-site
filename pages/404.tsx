import Head from "next/head";
import Typography from "@mui/material/Typography";
import { Header } from "@/components/Header";
import { Box } from "@mui/material";


export default function Page404() {

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
        <Box display="flex" justifyContent="center">
          <Typography variant="h4">
            404 | Page Not Found
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: "light" }}>
          The page you are looking for is not available, please make sure the
          url that you copied is correct and does not contain any invalid
          characters.
          <br />
          <br />
          If you are 100% sure the url is correct then it might be due to 
          account deletion or a permanent ban.
        </Typography>
      </Box>
    </>
  )
}
