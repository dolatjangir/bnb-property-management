import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

/* ---------- helper ---------- */
const parseDate = (str: string) => {
  if (!str) return null;
  // try ISO first
  let d = dayjs(str);
  if (d.isValid()) return d;

  // try DD-MM-YYYY
  d = dayjs(str, "DD-MM-YYYY");
  return d.isValid() ? d : null;
};

/* ---------- component ---------- */
interface DateSelectorProps {
  label: string;
  value?: string; // optional initial value
  onChange?: (selected: string) => void;
  error?: string;
}

export default function DateSelector({ label, value, onChange,error }: DateSelectorProps) {
  const [selectedDate, setSelectedDate] = React.useState<any>(
    value ? parseDate(value) : null
  );

  React.useEffect(() => {
    setSelectedDate(value ? parseDate(value) : null);
  }, [value]);

  const handleChange = (newValue: any) => {
    setSelectedDate(newValue);
    onChange?.(newValue ? newValue.format("DD-MM-YYYY") : ""); // emit DD-MM-YYYY
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
      <FormControl
        sx={{
          width: {
            xs: "100%",
            sm: "100%",
            md: "100%",
          },
          minWidth: {
            md: 200,
            lg: 200,
          },
        }}
      >
        <DatePicker
          label={label}
          value={selectedDate}
          onChange={handleChange}
          format="DD-MM-YYYY" // still show DD-MM-YYYY in the input
          slots={{ textField: TextField }}
          slotProps={{
            textField: {
              fullWidth: true,
              sx: {
                "& .MuiInputBase-root": {
                  borderRadius: "8px",
                  maxHeight: "3rem",
                },
                // move the placeholder label up a little
                "& .MuiInputLabel-root": {
                  transform: "translate(1rem,0.8rem)",
                },
                // keep the shrunk label where it is
                "& .MuiInputLabel-shrink": {
                  transform: "translate(1rem,-0.5rem)",
                  fontSize: "12px",
                },
              },
            },
          }}
          enableAccessibleFieldDOMStructure={false}
        />
      </FormControl>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </LocalizationProvider>
  );
}