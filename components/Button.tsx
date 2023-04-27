import BaseButton from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

interface ButtonProps {
  label: string;
  loading: boolean;
}

const Progress = () => (
  <CircularProgress sx={{ color: "whitesmoke" }} size={25} />
);

export const Button = (props: ButtonProps) => {
  return (
    <BaseButton type="submit" variant="contained" >
      {props.loading ? <Progress /> : props.label}
    </BaseButton>
  )
}
