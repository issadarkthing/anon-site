import Typography from '@mui/material/Typography';
import Head from "next/head";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <>
      <Head>
        <title>Anon Messaging</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header href="/login" />
      <Typography variant="subtitle1">
        Anonymous messaging 
        created by <a style={{ color: "lightblue" }} href="https://issadarkthing.com">issadarkthing</a>
      </Typography>
    </>
  )
}
