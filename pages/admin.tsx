import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { DateTime } from "luxon";
import { useQuery } from "react-query";
import cookie from "js-cookie";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
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

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/authenticate`, {
    method: "POST",
    headers: {
      token,
    }
  });

  if (res.status !== 200) {
    return { 
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      }
    };
  }

  return {
    props: {},
  }
}

interface Message {
  id: number;
  message: string;
  reply: string;
  reply_time: string;
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
    return <></>
  }

  const refetch = props.refetch;

  const ReplyButton = (props: { isReplied: boolean, message: Message }) => {

    if (props.isReplied) return <></>;

    const CHARACTER_LIMIT = 2560;
    const messageRef = useRef<HTMLInputElement>();
    const [charCount, setCharCount] = useState(0);
    const [showInput, setShowInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const reply = messageRef.current?.value;

      if (!reply) {
        setShowInput(true);
        return;
      }

      const token = cookie.get("token")!;

      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reply/${props.message.id}`, {
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
        const replyTime = DateTime.fromISO(x.reply_time);

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
          </Box>
        )
      })}
    </>
  )
}

export default function admin() {
  const token = cookie.get("token")!;

  let { 
    isLoading, 
    error, 
    data,
    refetch,
  } = useQuery<Message[]>("messageData", async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
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
            <a href="/" style={{ textDecoration: "none", color: "inherit" }}>📨 Anon Messaging</a>
          </Typography>
          <Typography variant="body1">
            Welcome back raziman! Here are few messages for you to respond to.
          </Typography>
          <ReplySection 
            refetch={refetch} 
            isLoading={isLoading} 
            error={error} 
            data={data} 
          />
        </Box>
      </main>
    </>
  )
}
