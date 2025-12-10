import React from 'react';
import { TextField } from '@mui/material';
import PropTypes from 'prop-types';

const CustomTextField = React.forwardRef((props, ref) => {
  const {
    label,
    name,
    required = false,
    type = 'text',
    value,
    errorText,
    onChange,
    inputProps,
    sx,
    ...otherProps
  } = props;
  const hasError = Boolean(errorText);

  return (
    <TextField
      ref={ref}
      fullWidth
      margin="normal"
      variant="outlined"
      
      // Core functionality props
      id={name}
      name={name}
      label={label}
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      
      // Error handling props
      error={hasError}
      helperText={hasError ? errorText : null}
      
      // Custom props
      inputProps={inputProps}
      sx={sx}
            {...otherProps}
    />
  );
});

CustomTextField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  errorText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  inputProps: PropTypes.object,
  sx: PropTypes.object,
};

CustomTextField.displayName = 'CustomTextField';

export default CustomTextField;