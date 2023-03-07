import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import cookie from "js-cookie";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Link } from "@/components/Link";
import Head from "next/head";
import { Header } from "@/components/Header";


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

      cookie.set("username", username, { 
        secure: true, 
        sameSite: "strict", 
        expires: 30,
      });

      cookie.set("token", data.token, { 
        secure: true, 
        sameSite: "strict", 
        expires: 30,
      });

      router.push(`/home/${username}`);

    } else {

      if (res.status === 401) {
        setStatus("Please enter the correct password");
      } else {
        setStatus(await res.text());
      }
    }

    if (passwordRef.current) {
      passwordRef.current.value = "";
    }
  }

  return (
    <>
      <Head>
        <title>anonmi</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header href="/" />
      <Box display="flex" flexDirection="column" gap="20px">
        <Typography variant="h6">
          Welcome back!
        </Typography>
        <Typography variant="body1">
          Before reading those awesome messages from your fans, let&apos;s get
          yourself logged in.
        </Typography>
      </Box>
      <form onSubmit={onSubmit}>
        <Box 
          display="flex"
          flexDirection="column" 
          gap="20px"
        >
          <TextField
            id="username"
            label="Username"
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
            label="Password"
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
            {loading ? <CircularProgress sx={{ color: "whitesmoke" }} size={25} /> : "log in"}
          </Button>
          <Typography variant="caption">{status}</Typography>
        </Box>
      </form>
      <Box display="flex" justifyContent="center">
        <Typography variant="subtitle1">
          No account yet? <Link href="/signup">Sign up</Link>
        </Typography>
      </Box>
    </>
  )
}
