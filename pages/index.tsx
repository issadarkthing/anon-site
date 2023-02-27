import Head from 'next/head'
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import styles from '@/styles/Home.module.css'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useRef, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Theme } from '@mui/material';


export default function Home() {
  const CHARACTER_LIMIT = 1024;
  const messageRef = useRef<HTMLInputElement>();
  const [sendStatus, setSendStatus] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const message = messageRef.current?.value;

    if (!message) {
      return;
    }

    setLoading(true);
    const res = await fetch("https://server2.discordrpg.com/message", {
      method: "POST",
      body: JSON.stringify({ message }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    setLoading(false);

    if (res.ok) {
      setSendStatus("Message sent successfully");

      if (messageRef.current) {
        messageRef.current.value = "";
        setCharCount(0);
      }

    } else {
      setSendStatus("An error occured while sending your message");
    }
  }

  return (
    <>
      <Head>
        <title>Anon Messaging</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Box 
          display="flex" 
          flexDirection="column" 
          gap="20px"
          sx={(theme) => ({
            [theme.breakpoints.up("lg")]: {
              width: "40vw",
            },
            [theme.breakpoints.up("md")]: {
              width: "50vw",
            },
            [theme.breakpoints.up("sm")]: {
              width: "80vw",
            },
            [theme.breakpoints.down("sm")]: {
              width: "90vw",
            },
          })}
        >
          <Typography variant="h4">
            📨 Anon Messaging
          </Typography>
          <Typography variant="subtitle1">
            Anonymous messaging 
            created by <a href="https://issadarkthing.com">issadarkthing</a>
          </Typography>
          <form onSubmit={onSubmit}>
            <Box 
              display="flex"
              flexDirection="column" 
              gap="20px"
            >
              <TextField
                id="message"
                label="Message"
                fullWidth
                focused
                multiline
                inputRef={messageRef}
                inputProps={{
                  maxLength: CHARACTER_LIMIT
                }}
                InputProps={{ 
                  sx: { color: "whitesmoke" } 
                }}
                FormHelperTextProps={{
                  sx: { color: "whitesmoke" }
                }}
                onChange={(x) => {
                  setCharCount(x.target.value.length);
                }}
                helperText={`${charCount}/${CHARACTER_LIMIT}`}
              />
              <Button type="submit" variant="contained" >
                  {loading ? <CircularProgress sx={{ color: "whitesmoke" }} size={25} /> : "send"}
              </Button>
              <Typography variant="caption">{sendStatus}</Typography>
            </Box>
          </form>
        </Box>
      </main>
    </>
  )
}
