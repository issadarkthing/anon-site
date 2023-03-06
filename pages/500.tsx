import Head from "next/head";
import Typography from "@mui/material/Typography";


export default function Page500() {

  return (
    <>
      <Head>
        <title>anonmi</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Typography variant="h4">
        500 | Internal Server Error
      </Typography>
    </>
  )
}
