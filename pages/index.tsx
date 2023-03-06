import Typography from '@mui/material/Typography';
import Head from "next/head";
import { Header } from "@/components/Header";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function Home() {
  return (
    <>
      <Head>
        <title>anonmi</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header href="/login" />
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center"
        justifyContent="center"
        gap="90px"
      >
        <Typography variant="h5">
          Create an account or log in and share your profile. Receive anonymous
          messages and reply to them individually. Not all messages should be
          replied.
        </Typography>
        <Box
          display="flex"
          gap="30px"
          sx={{ width: "100%" }}
        >
          <Button fullWidth variant="contained" href="/login">
            Log In
          </Button>
          <Button fullWidth variant="contained" href="/signup">
            Sign Up
          </Button>
        </Box>
      </Box>
    </>
  )
}
