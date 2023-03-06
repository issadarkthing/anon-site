import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link } from "./Link";



export function Header(props: { href?: string }) {
  const main = (
    <Box display="flex" justifyContent="center" alignItems="center" gap="7px">
      <img src="/anon.svg" alt="logo" style={{ width: "30px" }} /> <br />
      <Typography variant="h3" sx={{ fontFamily: "Comic Cat" }}>
        anonmi
      </Typography>
    </Box>
  );

  if (!props.href) {
    return main;
  }

  return (
    <Link href={props.href}>
      {main}
    </Link>
  )
}
