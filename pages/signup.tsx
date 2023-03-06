import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { Link } from "@/components/Link";
import Head from "next/head";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { Header } from "@/components/Header";

export default function Signup() {
  const router = useRouter();
  const usernameRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const passwordValidationRef = useRef<HTMLInputElement>();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    const passwordValidation = passwordValidationRef.current?.value;

    if (!username) {
      setStatus("Please give yourself a username");
      return;
    }

    if (!password) {
      setStatus("Please type your password");
      return;
    }

    if (!passwordValidation) {
      setStatus("Please re-type your password");
      return;
    }

    if (password !== passwordValidation) {
      setStatus("Passwords do not match");
      return;
    }

    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
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
      setStatus("Account created successfully");
      router.push(`/login`);

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

    if (passwordValidationRef.current) {
      passwordValidationRef.current.value = "";
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
          Entering account creation mode. Something about to go down
        </Typography>
        <Typography variant="body1">
          After your account is created, you will be able to receive messages and
          start using our app.
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
          <TextField
            id="password-validation"
            label="Confirm password"
            focused
            fullWidth
            type="password"
            inputRef={passwordValidationRef}
            InputProps={{ 
              sx: { color: "whitesmoke" } 
            }}
            FormHelperTextProps={{
              sx: { color: "whitesmoke" }
            }}
          />
          <Button type="submit" variant="contained" >
            {loading ? <CircularProgress sx={{ color: "whitesmoke" }} size={25} /> : "sign up"}
          </Button>
          <Typography variant="caption">{status}</Typography>
        </Box>
      </form>
      <Box display="flex" justifyContent="center">
        <Typography variant="subtitle1">
          Already have an account? <Link href="/login">Log in</Link>
        </Typography>
      </Box>
    </>
  )
}
