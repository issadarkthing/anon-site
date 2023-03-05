import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DateTime } from "luxon";
import { useQuery } from "react-query";
import cookie from "js-cookie";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { GetServerSideProps } from "next";
import Link from "next/link";
import Skeleton from "@mui/material/Skeleton";
import Head from "next/head";
import Fab from "@mui/material/Fab";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Avatar from "@mui/material/Avatar";
import { stringAvatar } from "@/utils/utils";

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  const token = context.req.cookies.token;

  if (!token) {
    return { 
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      }
    };
  }

  const username = context.params?.username;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/authenticate/${username}`, {
      headers: {
        token,
      }
    });

    if (res.status !== 200) {
      return { 
        redirect: {
          destination: "/login",
          permanent: false,
        }
      };
    }

    return {
      props: { username },
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

interface User {
  username: string;
  description: string;
  time: string;
}

interface Message {
  id: number;
  message: string;
  reply: string;
  reply_time: string;
  likes: number;
  message_time: string;
}

type Refetch = ReturnType<typeof useQuery>["refetch"];

function ReplySection(props: { 
  isLoading: boolean, 
  error: any, 
  data: Message[] | undefined,
  refetch: Refetch,
}) {

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

  const refetch = props.refetch;

  const ReplyButton = (props: { isReplied: boolean, message: Message }) => {
    const CHARACTER_LIMIT = 2560;
    const messageRef = useRef<HTMLInputElement>();
    const [charCount, setCharCount] = useState(0);
    const [showInput, setShowInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    if (props.isReplied) return <></>;

    const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const reply = messageRef.current?.value;

      if (!reply) {
        setShowInput(true);
        return;
      }

      const username = cookie.get("username")!;
      const token = cookie.get("token")!;

      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${username}/reply/${props.message.id}`, {
        method: "POST",
        headers: {
          token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reply }),
      });
      setLoading(false);

      if (res.ok) {
        setStatus("Replied successfully");
        refetch();
      } else {
        setStatus("An error occured while sending reply");
      }

      setShowInput(false);
      setCharCount(0);
    }

    return (
      <Box 
        display="flex" 
        justifyContent="flex-end"
        flexDirection="column" 
      >
        <form onSubmit={onSubmit}>
          {showInput && <TextField
            id="reply"
            label="Reply"
            fullWidth
            autoFocus
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
          />}
          <Button 
            fullWidth 
            type="submit"
            variant="contained"
          >
            {loading ? <CircularProgress sx={{ color: "whitesmoke" }} size={25} /> : "reply"}
          </Button>
          <Typography variant="caption">{status}</Typography>
        </form>
      </Box>
    );
  }

  return (
    <>
      {props.data.map(x => {
        const messageTime = DateTime.fromISO(x.message_time);

        return (
          <Box
            key={x.id}
            display="flex"
            flexDirection="column"
            gap="1px"
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
              {messageTime.toRelative()}
            </Typography>
            <Typography variant="body1" gutterBottom style={{ fontWeight: "bold" }}>
              {x.message}
            </Typography>
            <Typography variant="body2">
              {x.reply}
            </Typography>
            <ReplyButton isReplied={x.reply !== null} message={x} />
            <Box
              display="flex"
              justifyContent="flex-end"
              gap={1}
              alignItems="center"
            >
              <FavoriteBorderIcon sx={{ color: "whitesmoke" }} />
              <Typography variant="subtitle1">
                {x.likes}
              </Typography>
            </Box>
          </Box>
        )
      })}
    </>
  )
}

export default function Home(props: { username: string }) {
  const username = props.username;
  const token = cookie.get("token")!;
  const userRequest = useQuery<User>("userData", async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${username}`);

    if (!res.ok) {
      throw new Error(await res.text());
    } else {
      return res.json();
    }
  });

  let { 
    isLoading, 
    error, 
    data,
    refetch,
  } = useQuery<Message[]>("messageData", async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${username}/messages`, {
      headers: {
        token: ` ${token}`
      }
    });

    if (!res.ok) {
      throw new Error(await res.text());
    } else {
      return res.json();
    }
  });

  const messages = data?.length;
  const replies = data?.filter(x => !!x.reply).length;
  const likes = data?.reduce((acc, v) => acc + v.likes, 0);

  const StatData = (props: { title: string, value?: number }) => {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
      >
        <Box display="flex" justifyContent="center">
          <Typography variant="body1">
            {props.value}
          </Typography>
        </Box>
        <Typography variant="body2">
          {props.title}
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <Head>
        <title>Anon Messaging</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Typography variant="h4">
        <Link href={`/${username}`} style={{ textDecoration: "none", color: "inherit" }}>📨 Anon Messaging</Link>
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        paddingRight="30px"
      >
        <Avatar {...stringAvatar(username)} />
        <StatData title="Messages" value={messages} />
        <StatData title="Replies" value={replies} />
        <StatData title="Likes" value={likes} />
      </Box>
      <Box>
        <Typography variant="h6">
          {username}
        </Typography>
        <Typography variant="body1">
          {userRequest.data?.description}
        </Typography>
      </Box>
      <ReplySection 
        refetch={refetch} 
        isLoading={isLoading} 
        error={error} 
        data={data} 
      />
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
