import { colors } from "@/utils/constants";
import Typography from "@mui/material/Typography";


export function Name(props: Parameters<typeof Typography>[0]) {
  return (
    <Typography {...props} sx={{ fontFamily: "Comic Cat" }}>
      anon<span style={{ color: colors.accentColor }}>mi</span>
    </Typography>
  )
}
