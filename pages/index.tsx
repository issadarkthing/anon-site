import Head from 'next/head'
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import styles from '@/styles/Home.module.css'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useRef, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from 'react-query';
import { DateTime } from "luxon";

interface Reply {
  id: string;
  time: string;
  message_id: string;
  message: string;
  reply: string;
}

function ReplySection(props: { isLoading: boolean, error: any, data: Reply[] }) {

  if (props.error) {
    return <Typography variant="h5">{props.error.response}</Typography>
  }

  return (
    <>
      {props.data.map(x => {
        const time = DateTime.fromISO(x.time);

        return (
          <Box 
            display="flex"
            flexDirection="column"
            gap="10px"
            style={{ 
              backgroundColor: "#20262e", 
              padding: 15,
              borderRadius: "5px",
              borderStyle: "solid",
              borderWidth: "2px",
              borderColor: "#ffffff4d"
            }}
          >
            <Typography color="#ffffff9d" variant="caption">
              {time.toRelative()}
            </Typography>
            <Typography variant="body1" style={{ fontWeight: "bold" }}>
              {x.message}
            </Typography>
            <Typography variant="body2">
              {x.reply}
            </Typography>
          </Box>
        )
      })}
    </>
  )
}

export default function Home() {
  const CHARACTER_LIMIT = 256;
  const messageRef = useRef<HTMLInputElement>();
  const [sendStatus, setSendStatus] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const { isLoading, error, data } = useQuery<Reply[]>("replyData", async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/replies`);

    if (!res.ok) {
      throw new Error(await res.text());
    } else {
      return res.json();
    }
  });


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const message = messageRef.current?.value;

    if (!message) {
      return;
    }

    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/message`, {
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
            created by <a style={{ color: "lightblue" }} href="https://issadarkthing.com">issadarkthing</a>
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
              {data && <ReplySection isLoading={isLoading} error={error as string} data={data} />}
            </Box>
          </form>
        </Box>
      </main>
    </>
  )
}
