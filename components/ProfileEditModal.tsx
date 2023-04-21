import { colors } from "@/utils/constants";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useRef, useState } from "react";
import { TextField } from "./TextField";
import cookie from "js-cookie";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

export interface ProfileEditUser {
  username: string;
  description: string;
  email: string;
  notify_email: boolean;
}

export function ProfileEditModal(props: { 
  open: boolean, 
  onClose: () => void,
  onSubmit: (user: ProfileEditUser) => void,
  user: ProfileEditUser,
}) {
  const [helperText, setHelperText] = useState("");
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef<HTMLInputElement>();
  const descriptionRef = useRef<HTMLInputElement>();
  const emailRef = useRef<HTMLInputElement>();
  const notifyEmailRef = useRef<HTMLInputElement>();
  const USERNAME_CHAR_LIMIT = 50;
  const DESCRIPTION_CHAR_LIMIT = 100;
  const EMAIL_CHAR_LIMIT = 200;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = cookie.get("token")!;
    const username = usernameRef.current?.value || "";
    const description = descriptionRef.current?.value || "";
    const email = emailRef.current?.value || "";
    const notify_email = !!notifyEmailRef.current?.checked;

    if (!username) {
      return
    }

    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${props.user.username}`, {
      method: "PATCH",
      headers: {
        token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, description, email, notify_email }),
    });
    setLoading(false);

    if (res.ok) {
      setHelperText("Edited successfully");
      props.onSubmit({ 
        username, 
        description, 
        email, 
        notify_email,
      });

      setHelperText("");
    } else {
      setHelperText(await res.text());
    }
  }

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
    >
      <form onSubmit={onSubmit}>
        <Box 
          display="flex" 
          flexDirection="column"
          gap="20px"
          sx={(theme) => ({
            position: 'absolute' as 'absolute',
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#353F4C",
            border: "2px solid",
            borderColor: colors.borderColor,
            borderRadius: "5px",
            boxShadow: 24,
            padding: 3,
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
          <Typography variant="h6">
            Profile edit
          </Typography>
          <TextField
            id="username"
            label="Username"
            multiline={false}
            characterLimit={USERNAME_CHAR_LIMIT}
            defaultValue={props.user.username}
            ref={usernameRef}
          />
          <TextField
            id="description"
            label="Description"
            characterLimit={DESCRIPTION_CHAR_LIMIT}
            defaultValue={props.user.description}
            ref={descriptionRef}
          />
          <TextField
            id="email"
            label="Email"
            characterLimit={EMAIL_CHAR_LIMIT}
            defaultValue={props.user.email}
            multiline={false}
            ref={emailRef}
          />
          <FormControlLabel 
            control={<Switch 
              inputRef={notifyEmailRef}
              defaultChecked={props.user.notify_email} 
            />} 
            label="Send an email when a new message is received" 
          />
          <Button type="submit" variant="contained">
            {loading ? <CircularProgress sx={{ color: "whitesmoke" }} size={25} /> : "save"}
          </Button>
          <Typography variant="subtitle1">
            {helperText}
          </Typography>
        </Box>
      </form>
    </Modal>
  )
}
