import Typography from "@mui/material/Typography";


export function Name(props: Parameters<typeof Typography>[0]) {
  return (
    <Typography {...props} sx={{ fontFamily: "Comic Cat" }}>
      anonmi
    </Typography>
  )
}
