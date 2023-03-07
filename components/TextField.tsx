import BaseTextField, { BaseTextFieldProps } from "@mui/material/TextField";
import React, { useState } from "react";

type TextFieldProps = {
  characterLimit: number;
} & BaseTextFieldProps;

export const TextField = React.forwardRef((props: TextFieldProps, ref) => {
  const [charCount, setCharCount] = useState(0);

  return (
    <BaseTextField
      {...props}
      label="Message"
      fullWidth
      focused
      multiline
      inputRef={ref}
      onSubmit={() => { setCharCount(0); }}
      inputProps={{
        maxLength: props.characterLimit,
      }}
      InputProps={{ 
        sx: { color: "whitesmoke" } 
      }}
      FormHelperTextProps={{
        sx: { color: "whitesmoke" }
      }}
      onChange={(x) => {
        setCharCount(x.target.value.length);
      }}
      helperText={`${charCount}/${props.characterLimit}`}
    />
  )
})
