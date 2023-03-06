import Typography from '@mui/material/Typography';
import { Link } from "@/components/Link";
import Head from "next/head";
import Box from '@mui/material/Box';

export default function Home() {
  return (
    <>
      <Head>
        <title>Anon Messaging</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Link href="/login">
        <Box display="flex" justifyContent="center" alignItems="center" gap="7px">
          <img src="anon.svg" alt="logo" style={{ width: "30px" }} /> <br />
          <Typography variant="h3" sx={{ fontFamily: "Comic Cat" }}>
            anon.me
          </Typography>
        </Box>
      </Link>
      <Typography variant="subtitle1">
        Anonymous messaging 
        created by <a style={{ color: "lightblue" }} href="https://issadarkthing.com">issadarkthing</a>
      </Typography>
    </>
  )
}
