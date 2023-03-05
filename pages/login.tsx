import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import cookie from "js-cookie";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";


export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  const token = context.req.cookies.token;
  const username = context.req.cookies.username;

  if (!token) {
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

export default function Login() {
  const router = useRouter();
  const usernameRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !password) {
      return;
    }

    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password
      })
    });
    setLoading(false);

    if (res.ok) {
      setStatus("Login successfully");
      const data = await res.json();
      cookie.set("username", username);
      cookie.set("token", data.token);
      router.push(`/home/${username}`);

    } else {

      if (res.status === 401) {
        setStatus("Please enter the correct password");
      } else {
        setStatus("An error occured while logging in");
      }
    }

    if (passwordRef.current) {
      passwordRef.current.value = "";
    }
  }

  return (
    <>
      <Head>
        <title>Anon Messaging</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Typography variant="h4">
        <Link href="/" style={{ color: "whitesmoke", textDecoration: "none" }}>
          📨 Anon Messaging
        </Link>
      </Typography>
      <Typography variant="body1">
        You are entering admin route 🚧 
        <br /> Click <Link href="/" style={{ color: "lightblue" }}>here</Link> to return home
      </Typography>
      <form onSubmit={onSubmit}>
        <Box 
          display="flex"
          flexDirection="column" 
          gap="20px"
        >
          <TextField
            id="username"
            label="username"
            fullWidth
            focused
            inputRef={usernameRef}
            InputProps={{ 
              sx: { color: "whitesmoke" } 
            }}
            FormHelperTextProps={{
              sx: { color: "whitesmoke" }
            }}
          />
          <TextField
            id="password"
            label="password"
            focused
            fullWidth
            type="password"
            inputRef={passwordRef}
            InputProps={{ 
              sx: { color: "whitesmoke" } 
            }}
            FormHelperTextProps={{
              sx: { color: "whitesmoke" }
            }}
          />
          <Button type="submit" variant="contained" >
            {loading ? <CircularProgress sx={{ color: "whitesmoke" }} size={25} /> : "login"}
          </Button>
          <Typography variant="caption">{status}</Typography>
        </Box>
      </form>
    </>
  )
}
