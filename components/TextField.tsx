import BaseTextField, { BaseTextFieldProps } from "@mui/material/TextField";
import React, { useState } from "react";

type TextFieldProps = {
  characterLimit: number;
} & BaseTextFieldProps;

export const TextField = React.forwardRef(function TextField(props: TextFieldProps, ref) {
  const defaultValue = typeof props.defaultValue === "string" ? 
    props.defaultValue.length : 0;
  const [charCount, setCharCount] = useState(defaultValue);

  return (
    <BaseTextField
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
      {...props}
    />
  )
})
