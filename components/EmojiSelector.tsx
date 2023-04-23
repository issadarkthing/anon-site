import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import EmojiPicker, { Theme, EmojiClickData, EmojiStyle } from "emoji-picker-react";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { useState, MutableRefObject } from "react";

export type OnEmojiClick = (emojiData: EmojiClickData) => void;

interface EmojiSelectorProps {
  inputRef: MutableRefObject<HTMLInputElement | undefined>;
}

export const EmojiSelector = function EmojiSelector(props: EmojiSelectorProps) {
  const [emojiAnchorEl, setEmojiAnchorEl] = useState<HTMLButtonElement>();
  const emojiOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setEmojiAnchorEl(e.currentTarget);
  };
  const emojiOnClose = () => {
    setEmojiAnchorEl(undefined);
  };
  const onEmojiClick = (emojiData: EmojiClickData) => {

    const message = props.inputRef?.current;

    if (!message) {
      return;
    }

    const cursorPosition = message.selectionStart || 0;
    message.value = message.value.substring(0, cursorPosition) + 
      emojiData.emoji + 
      message.value.substring(cursorPosition);
  }

  return (
    <>
      <IconButton onClick={emojiOnClick}>
        <EmojiEmotionsIcon sx={{ color: "whitesmoke" }} />
      </IconButton>
      <Popover
        sx={{ ".MuiPopover-paper": { backgroundColor: "transparent" } }}
        open={!!emojiAnchorEl}
        anchorEl={emojiAnchorEl}
        onClose={emojiOnClose}
        anchorOrigin={{
          vertical: 'bottom',
            horizontal: 'left',
        }}
        transitionDuration={0}
      >
        <EmojiPicker 
          emojiStyle={EmojiStyle.NATIVE}
          theme={Theme.DARK}
          onEmojiClick={onEmojiClick} 
        />
      </Popover>
    </>
  )
}
