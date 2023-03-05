import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider, createTheme } from "@mui/material/styles"
import styles from "@/styles/Home.module.css";
import Box from '@mui/material/Box';
import { Analytics } from "@vercel/analytics/react";

export const queryClient = new QueryClient();

const theme = createTheme({
  typography: {
    allVariants: {
      color: "whitesmoke",
    }
  }
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
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
            <Component {...pageProps} />
            <Analytics />
          </Box>
        </main>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
