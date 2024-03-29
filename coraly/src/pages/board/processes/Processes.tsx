/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CoralyProgress from "../../../components/CoralyProgress";
import { theme } from "../../../config/theme";
import useApi, { HttpMethods } from "../../../hooks/useApi";
import { IRootState } from "../../../redux/rootReducer";
import { IProcess } from "../../../redux/workspace/workSpaceReducer";
import { styled } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  setActiveProcess,
  setProcesses as setProcessesRedux,
} from "../../../redux";

import AddIcon from "@mui/icons-material/Add";
import processesIcons from "./processesIcons";
import { Outlet, useNavigate } from "react-router";

const BaseProces = styled(Box)({
  width: "10.5vw",
  aspectRatio: "1/1",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  padding: "14px",
  justifyContent: "flex-start",
  alignItems: "center",
  borderRadius: "8px",
  "& .MuiSvgIcon-root": {
    fontSize: "2.5rem",
  },
  "&.MuiBox-root:hover": {
    cursor: "pointer",
  },
});

const CreateProcess = styled(BaseProces)({
  justifyContent: "center",
  border: "1px dashed " + theme.palette.grey[200],
  "& .MuiSvgIcon-root": {
    color: theme.palette.grey[700],
  },
});

interface ProcessProps {
  background: string;
}

const Process = styled(BaseProces)<ProcessProps>(({ background }) => {
  return {
    background: background,
    "& .MuiSvgIcon-root": {
      color: theme.palette.grey[700],
    },
  };
});

const Private = styled("div")({
  display: "flex",
  height: "24px",
  width: "100%",
  justifyContent: "space-between",

  "& .MuiSvgIcon-root": {
    fontSize: "1.5rem !important",
    fill: theme.palette.common.white,
  },
});

const ProcessesWrapper = styled(Box)({
  padding: `${theme.spacing(6.25)} ${theme.spacing(3)}`,
});

export default function Processes() {
  const [{ loading, response, error }, getProcesses] = useApi();
  const dispatch = useDispatch();
  const { user, workspace, processes } = useSelector(
    (state: IRootState) => state.workSpace
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (response) {
      dispatch(setProcessesRedux(response));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, error]);

  useEffect(() => {
    if (user && workspace) {
      getProcesses("/processes?workspaceId=" + workspace.id, {
        method: HttpMethods.GET,
      });
    }
  }, [user, workspace]);

  const getIcon = (icon: string) => {
    const index = processesIcons.findIndex((i) => i.name === icon);
    return processesIcons[index].icon;
  };

  const getIsPrivate = (isPrivate: boolean) => {
    return (
      <Private>
        {!isPrivate ? <LockOutlinedIcon /> : <LockOpenOutlinedIcon />}
        <MoreVertIcon />
      </Private>
    );
  };

  return !loading && user ? (
    <ProcessesWrapper>
      <Typography variant="h2" color={theme.palette.grey[900]} marginBottom={3}>
        Welcome, {user.name}&nbsp;{user.surname}
      </Typography>
      <Typography
        variant="h5"
        color={theme.palette.grey[800]}
        fontWeight={400}
        marginBottom={3}
      >
        Work with your team mates, take track of your process and
        <br /> close all tasks
      </Typography>

      <Grid container spacing={3}>
        <Grid item>
          <CreateProcess onClick={() => navigate("./create-process")}>
            <AddIcon />
            <Typography
              variant="caption"
              color={theme.palette.grey[700]}
              textAlign="center"
            >
              Create a new process
            </Typography>
          </CreateProcess>
        </Grid>

        {processes && processes.length
          ? processes.map((process: IProcess) => (
              <Grid item key={process.id}>
                <Process
                  background={process.color}
                  onClick={() => {
                    dispatch(setActiveProcess(process));
                    navigate(`./${process.id.toString()}`);
                  }}
                >
                  {process.isPrivate !== undefined ? (
                    getIsPrivate(process.isPrivate)
                  ) : (
                    <Private></Private>
                  )}
                  {getIcon(process.icon)}
                  <Typography
                    variant="caption"
                    color={theme.palette.common.white}
                    textAlign="center"
                  >
                    {process.name}
                  </Typography>
                </Process>
              </Grid>
            ))
          : null}
      </Grid>
      <Outlet />
    </ProcessesWrapper>
  ) : (
    <CoralyProgress />
  );
}
