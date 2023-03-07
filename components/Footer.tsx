import styles from "@/styles/Home.module.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link } from "./Link";


export function Footer() {
  return (
    <footer className={styles.footer}>
      <Box 
        display="flex" 
        justifyContent="center"
        paddingTop="30px"
      >
        <Box
          display="flex"
          alignItems="center"
          gap="40px"
        >
          <Box 
            display="flex" 
            flexDirection="column"
            gap="10px"
          >
            <Typography variant="body2">
              <Link href="/">Home</Link>
            </Typography>
            <Typography variant="body2">
              <Link href="/login">Log in</Link>
            </Typography>
          </Box>
          <Box 
            display="flex" 
            flexDirection="column"
            gap="10px"
          >
            <Typography variant="body2">
              <Link href="/signup">Sign up</Link>
            </Typography>
            <Typography variant="body2">
              About
            </Typography>
          </Box>
          <Typography variant="body1">
            Made by <Link href="https://issadarkthing.com">issadarkthing</Link>
          </Typography>
        </Box>
      </Box>
    </footer>
  )
}

