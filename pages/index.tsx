import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery, QueryObserverBaseResult } from 'react-query';
import { DateTime } from "luxon";
import Link from 'next/link';
import Head from "next/head";
import Fab from "@mui/material/Fab";
import Skeleton from "@mui/material/Skeleton";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from '@mui/icons-material/Favorite';

interface Reply {
  id: string;
  time: string;
  message_id: string;
  message: string;
  reply: string;
  likes: number;
}

function LikeButton(props: { 
  replyId: string, 
  likes: number, 
}) {
  type ButtonState = "like" | "unlike" | "none";
  const [buttonState, setButtonState] = useState<ButtonState>("none");
  const [buttonView, setButtonView] = useState<ButtonState>("none");
  const [likeCount, setLikeCount] = useState(props.likes);

  useEffect(() => {
    const likedItems: number[] = JSON.parse(localStorage.getItem("likes") || "[]");
    const isLiked = likedItems.includes(Number(props.replyId));

    if (isLiked) {
      setButtonView("like");
    }
  }, [props.replyId]);

  useEffect(() => {
    if (buttonState !== "none") {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/${buttonState}/${props.replyId}`, {
        method: "POST",
      });

      let likedItems: number[] = JSON.parse(localStorage.getItem("likes") || "[]");
      
      if (buttonState === "like") {
        setLikeCount((count) => count + 1);
        likedItems.push(Number(props.replyId));
        setButtonView("like");

      } else if (buttonState === "unlike") {
        setLikeCount((count) => count - 1);
        likedItems = likedItems.filter(x => x !== Number(props.replyId));
        setButtonView("unlike");
      }

      localStorage.setItem("likes", JSON.stringify(likedItems));
    }
  }, [props.replyId, buttonState])

  if (buttonView === "like") {
    return (
      <>
        <IconButton onClick={() => { setButtonState("unlike"); }}>
          <FavoriteIcon sx={{ color: "orangered" }} />
        </IconButton>
        <Typography variant="subtitle1">
          {likeCount}
        </Typography>
      </>
    );
  }

  return (
    <>
      <IconButton onClick={() => { setButtonState("like"); }}>
        <FavoriteBorderIcon sx={{ color: "whitesmoke" }} />
      </IconButton>
      <Typography variant="subtitle1">
        {likeCount}
      </Typography>
    </>
  );
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
            <Box 
              display="flex" 
              justifyContent="flex-end"
              alignItems="center"
            >
              <LikeButton replyId={x.id} likes={x.likes} />
            </Box>
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
      <Fab
        sx={{
          position: "fixed",
            bottom: (theme) => theme.spacing(2),
            right: (theme) => theme.spacing(5)
        }}
        color="primary"
        onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }) }}
      >
        <ArrowUpwardIcon />
      </Fab>
    </>
  )
}
