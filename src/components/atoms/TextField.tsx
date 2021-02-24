import React from "react";
import MaterialTextField from "@material-ui/core/TextField";

export type Props = {
  label?: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const TextField: React.FC<Props> = React.memo(({ label, type, onChange }) => (
  <MaterialTextField fullWidth label={label} type={type} onChange={onChange} />
));

TextField.displayName = "TextField";

export default TextField;
