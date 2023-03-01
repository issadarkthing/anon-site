import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useRef, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from 'react-query';
import { DateTime } from "luxon";
import Link from 'next/link';
import { Skeleton } from '@mui/material';
import Head from "next/head";

interface Reply {
  id: string;
  time: string;
  message_id: string;
  message: string;
  reply: string;
}

function ReplySection(props: { isLoading: boolean, error: any, data: Reply[] | undefined }) {

  if (props.error) {
    return <Typography variant="h5">{props.error.response}</Typography>
  }

  if (!props.data) {
    const content = Array(10).fill(1).map((_, i) => i);

    return (
      <>
        {content.map(x => 
          <Skeleton key={x} variant="rounded" height="110px" />
        )}
      </>
    )
  }

  return (
    <>
      {props.data.map(x => {
        const time = DateTime.fromISO(x.time);

        return (
          <Box
            key={x.id}
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

export function delayAsync<T>(cb: () => Promise<T>, delay: number) {
  return async () => {
    const result = await cb();
    return new Promise<T>(resolve => {
      setTimeout(() => {
        resolve(result);
      }, delay);
    })
  }
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Typography variant="h4">
        <Link href="/login" style={{ textDecoration: "none", color: "inherit" }}>📨 Anon Messaging</Link>
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
          <ReplySection isLoading={isLoading} error={error as string} data={data} />
        </Box>
      </form>
    </>
  )
}
