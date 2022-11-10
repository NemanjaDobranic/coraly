import React, { useState, useEffect } from "react";
import GetStarted from "../layouts/GetStarted";
import { Typography, TextField, IconButton, Container } from "@mui/material";
import { theme } from "../config/theme";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Grid, Button } from "@mui/material";
import CoralyLink from "../components/CoralyLink";
import validate from "../helpers/functions/validate";
import Fade from "@mui/material/Fade";
import useApi, { HttpMethods } from "../hooks/useApi";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Zoom from "@mui/material/Zoom";

interface ILogin {
  email: string;
  password: string;
}

interface IUser extends ILogin {
  id: number;
  name: string;
  surname: string;
}

const Login: React.FC = () => {
  const initialValues = { email: "", password: "" };
  const [formValues, setFormValues] = useState<ILogin>(initialValues);
  const [formErrors, setFormErrors] = useState<Partial<ILogin>>({});
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [message, setMessage] = useState("");

  const [{ loading, response, error }, fetchUsers] = useApi({
    path: `/login`,
    options: {
      method: HttpMethods.POST,
      body: JSON.stringify({
        email: formValues.email,
        password: formValues.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    },
  });

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      fetchUsers();
    }
  }, [formErrors]);

  useEffect(() => {
    console.log(response);
    if (response) {
      const users = response as IUser[];
      if (users.length > 0) {
        const user = users.filter(
          (user) => user.password === formValues.password
        );
        setMessage("hiii");
        //neipsrvna sifra
      } else {
        //korisnik nije pronadjen
      }
    }

    if (error) {
      setMessage(error);
    }
  }, [response, error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    const validationResult = validate({ [name]: value })[name as keyof ILogin];
    validationResult !== undefined
      ? setFormErrors({ ...formErrors, ...{ [name]: validationResult } })
      : delete formErrors[name as keyof ILogin];
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  return (
    <GetStarted>
      <Typography variant="h4" color={theme.palette.grey[900]} marginBottom={1}>
        Log in
      </Typography>
      <Typography
        variant="body1"
        color={theme.palette.grey[700]}
        marginBottom={6.25}
      >
        Thanks to come back on Coraly
      </Typography>
      <form noValidate onSubmit={handleSubmit}>
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          name="email"
          fullWidth
          sx={{ marginBottom: "24px" }}
          value={formValues.email}
          onChange={handleChange}
          error={!!formErrors.email}
          helperText={
            <Fade in={!!formErrors.email}>
              {<span>{formErrors.email}</span>}
            </Fade>
          }
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          name="password"
          fullWidth
          sx={{ marginBottom: "18px" }}
          value={formValues.password}
          onChange={handleChange}
          error={!!formErrors.password}
          helperText={
            <Fade in={!!formErrors.password}>
              {<span>{formErrors.password}</span>}
            </Fade>
          }
        />

        <Grid container alignItems="center" marginBottom={4.25}>
          <Grid item>
            <FormControlLabel control={<Checkbox />} label="Remember me" />
          </Grid>
          <Grid item>
            <CoralyLink to="/reset-password">Forgot password</CoralyLink>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          sx={{ marginBottom: "2rem" }}
          color="actionSecondary"
          type="submit"
          fullWidth
        >
          <Typography variant="button">Login</Typography>
        </Button>

        <Typography variant="body1">
          Don’t you have an account?{" "}
          <CoralyLink to="/signup">Sign up now</CoralyLink>
        </Typography>
      </form>

      <Zoom in={!!message} timeout={500}>
        <Alert
          severity={error ? "error" : "success"}
          icon={<ErrorOutlineIcon color={error ? "error" : "success"} />}
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
              color={error ? "error" : "success"}
              size="small"
              onClick={() => setMessage("")}
            >
              <CloseIcon />
            </IconButton>
          }
        >
          <AlertTitle color={error ? "error" : "success"}>{message}</AlertTitle>
        </Alert>
      </Zoom>
    </GetStarted>
  );
};

export default Login;
