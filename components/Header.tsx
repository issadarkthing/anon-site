import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link } from "./Link";
import { colors } from "@/utils/constants";
import Image from "next/image";

export function Header(props: { href?: string }) {
  const main = (
    <Box display="flex" justifyContent="center" alignItems="center" gap="7px">
      <Image src="/anon.svg" alt="logo" width={40} height={40} /> <br />
      <Typography display="inline" variant="h3" sx={{ fontFamily: "Comic Cat" }}>
        anon<span style={{ color: colors.accentColor }}>mi</span>
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
