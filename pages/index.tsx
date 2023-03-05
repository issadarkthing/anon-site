import Typography from '@mui/material/Typography';
import Link from 'next/link';
import Head from "next/head";


export default function Home() {
  return (
    <>
      <Head>
        <title>Anon Messaging</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Typography variant="h4">
        <Link href="/login" style={{ textDecoration: "none", color: "inherit" }}>📨 Anon Messaging</Link>
      </Typography>
      <Typography variant="subtitle1">
        Anonymous messaging 
        created by <a style={{ color: "lightblue" }} href="https://issadarkthing.com">issadarkthing</a>
      </Typography>
    </>
  )
}
