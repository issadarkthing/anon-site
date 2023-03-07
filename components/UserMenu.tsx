import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useContext, useState } from "react";
import Typography from "@mui/material/Typography";
import { SvgIconComponent } from "@mui/icons-material";

const UserMenuContext = React.createContext({
  close: () => {},
});

export function UserMenuItem(props: { 
  Icon: SvgIconComponent, 
  text: string,
  onClick: () => void,
}) {
  const userMenuContext = useContext(UserMenuContext);
  const onClick = () => {
    userMenuContext.close();
    props.onClick();
  }

  return (
    <MenuItem onClick={onClick}>
      <Box display="flex" gap="10px" alignItems="center">
        <props.Icon fontSize="small" />
        <Typography display="inline" variant="body2">
          {props.text}
        </Typography>
      </Box>
    </MenuItem>
  )
}

export function UserMenu(props: { children: React.ReactNode, }) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <UserMenuContext.Provider value={{ close: () => { setAnchorEl(null); } }}>
      <Box display="flex" flexGrow={1} justifyContent="flex-end">
        <Button size="small" onClick={handleClick}>
          <MoreVertIcon sx={{ color: "whitesmoke" }} />
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          sx={{ 
            "& .MuiPaper-root": { 
              backgroundColor: "#353F4C"
            } 
            }}
          >
            {props.children}
          </Menu>
        </Box>
      </UserMenuContext.Provider>
  )
}
