import { colors } from "@/utils/constants";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useRef, useState } from "react";
import { TextField } from "./TextField";
import cookie from "js-cookie";
import CircularProgress from "@mui/material/CircularProgress";


export function ProfileEditModal(props: { 
  open: boolean, 
  onClose: () => void,
  onSubmit: () => void,
  username: string,
  description: string,
}) {
  const [helperText, setHelperText] = useState("");
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef<HTMLInputElement>();
  const descriptionRef = useRef<HTMLInputElement>();
  const USERNAME_CHAR_LIMIT = 50;
  const DESCRIPTION_CHAR_LIMIT = 100;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = cookie.get("token")!;
    const username = usernameRef.current?.value || "";
    const description = descriptionRef.current?.value || "";

    if (!username) {
      return
    }

    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${props.username}`, {
      method: "PATCH",
      headers: {
        token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, description }),
    });
    setLoading(false);

    if (res.ok) {
      setHelperText("Edited successfully");
      props.onSubmit();
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
            characterLimit={USERNAME_CHAR_LIMIT}
            defaultValue={props.username}
            ref={usernameRef}
          />
          <TextField
            id="description"
            label="Description"
            characterLimit={DESCRIPTION_CHAR_LIMIT}
            defaultValue={props.description}
            ref={descriptionRef}
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
