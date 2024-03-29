import { Zoom, Alert, IconButton, AlertTitle, AlertColor } from "@mui/material";
import React from "react";
import { theme } from "../config/theme";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export interface ICoralyAlert {
  message: string;
  color: AlertColor | undefined;
}

interface ICoralyAlertProps {
  message: string;
  color: AlertColor | undefined;
  changeVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

const CoralyAlert: React.FC<ICoralyAlertProps> = ({
  message,
  color,
  changeVisibility,
}) => {
  return (
    <Zoom in timeout={500}>
      <Alert
        data-testid="alert-1"
        severity={color}
        iconMapping={{
          success: <CheckCircleOutlineIcon color={color} />,
          error: <ErrorOutlineIcon color={color} />,
        }}
        sx={{
          [theme.breakpoints.down("md")]: {
            marginTop: "10%",
          },
          [theme.breakpoints.up("md")]: {
            bottom: "-4.5vw",
            position: "relative",
            left: "-6vw",
          },
        }}
        action={
          <IconButton
            aria-label="close"
            color={color}
            size="small"
            onClick={() => changeVisibility(false)}
          >
            <CloseIcon />
          </IconButton>
        }
      >
        <AlertTitle color={color}>{message}</AlertTitle>
      </Alert>
    </Zoom>
  );
};

export default CoralyAlert;
