import Typography from '@mui/material/Typography';
import Head from "next/head";
import { Header } from "@/components/Header";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { colors } from '@/utils/constants';
import { GetServerSideProps } from 'next';


export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  const token = context.req.cookies.token;
  const username = context.req.cookies.username;

  if (!token || !username) {
    return { 
      props: {},
    };
  }


  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/authenticate/${username}`, {
      headers: {
        token,
      }
    });

    if (res.status !== 200) {
      return { 
        props: {},
      };
    }

    return {
      props: {},
      redirect: {
        destination: `/home/${username}`,
        permanent: false,
      }
    }

  } catch {
    return {
      props: {},
      redirect: {
        destination: "/500",
        permanent: false,
      }
    }
  }
}

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
        gap="50px"
      >
        <Typography variant="h5" style={{ fontFamily: "Comic Cat" }}>
          Ever wanted to see what people say when they are able to send you&nbsp;
          <span style={{ color: colors.accentColor }}>anonymous</span> messages?
          Also people may be interested with your replies.
        </Typography>
        <Typography variant="h5">
          Create an account or log in and share your profile. Receive anonymous
          messages and reply to them individually.
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
