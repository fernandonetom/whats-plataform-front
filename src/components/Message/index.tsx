import React from "react";
import { Avatar, Theme } from "@mui/material";
import { makeStyles } from "@material-ui/styles";

import { deepOrange } from "@mui/material/colors";

const useStyles = makeStyles((theme: Theme) => ({
  messageRow: {
    display: "flex",
    flex: 1,
  },
  messageRowRight: {
    display: "flex",
    justifyContent: "flex-end",
  },
  messageBlue: {
    position: "relative",
    marginLeft: "20px",
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#A8DDFD",
    width: "60%",
    //height: "50px",
    textAlign: "left",
    font: "400 .9em 'Open Sans', sans-serif",
    border: "1px solid #97C6E3",
    borderRadius: "10px",
    "&:after": {
      content: "''",
      position: "absolute",
      width: "0",
      height: "0",
      borderTop: "15px solid #A8DDFD",
      borderLeft: "15px solid transparent",
      borderRight: "15px solid transparent",
      top: "0",
      left: "-15px",
    },
    "&:before": {
      content: "''",
      position: "absolute",
      width: "0",
      height: "0",
      borderTop: "17px solid #97C6E3",
      borderLeft: "16px solid transparent",
      borderRight: "16px solid transparent",
      top: "-1px",
      left: "-17px",
    },
  },
  messageOrange: {
    position: "relative",
    marginRight: "20px",
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#f8e896",
    width: "60%",
    //height: "50px",
    textAlign: "left",
    font: "400 .9em 'Open Sans', sans-serif",
    border: "1px solid #dfd087",
    borderRadius: "10px",
    "&:after": {
      content: "''",
      position: "absolute",
      width: "0",
      height: "0",
      borderTop: "15px solid #f8e896",
      borderLeft: "15px solid transparent",
      borderRight: "15px solid transparent",
      top: "0",
      right: "-15px",
    },
    "&:before": {
      content: "''",
      position: "absolute",
      width: "0",
      height: "0",
      borderTop: "17px solid #dfd087",
      borderLeft: "16px solid transparent",
      borderRight: "16px solid transparent",
      top: "-1px",
      right: "-17px",
    },
  },

  messageContent: {
    padding: 0,
    margin: 0,
    width: "60%",
  },
  messageTimeStampRight: {
    position: "absolute",
    fontSize: ".85em",
    fontWeight: 300,
    marginTop: "10px",
    bottom: "-3px",
    right: "5px",
  },

  orange: {
    // color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
    width: 300,
    height: 300,
  },
  avatarNothing: {
    color: "transparent",
    backgroundColor: "transparent",
    width: 300,
    height: 300,
  },
  displayName: {
    marginLeft: "20px",
  },
}));

interface IProps {
  message: string | null;
  timestamp: string | null;
  src: string | null;
  type: string | null;
}

export const MessageLeft = (props: IProps) => {
  const message = props.message ? props.message : "no message";
  const timestamp = props.timestamp ? props.timestamp : "";
  // const photoURL = props.photoURL ? props.photoURL : "dummy.js";
  // const displayName = props.displayName;
  // const showAvatar = props.showAvatar;
  const classes = useStyles();

  return (
    <>
      <div className={classes.messageRow}>
        {/* {showAvatar && (
          <Avatar
            alt={displayName}
            className={classes.orange}
            src={photoURL}
          ></Avatar>
        )} */}
        <div style={{ flex: 1 }}>
          {/* {displayName && (
            <div className={classes.displayName}>{displayName}</div>
          )} */}
          <div className={classes.messageBlue}>
            <div>
              {props.type === "image" && (
                <img
                  src={`https://storage-api.daeletrica.com.br/view/${props.src}`}
                  style={{ maxHeight: "250px" }}
                />
              )}
              {props.type === "chat" && (
                <p className={classes.messageContent}>{message}</p>
              )}
              {props.type === "ptt" && (
                <audio controls>
                  <source
                    src={`https://storage-api.daeletrica.com.br/view/${props.src}`}
                    type="audio/ogg"
                  />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
            <div className={classes.messageTimeStampRight}>{timestamp}</div>
          </div>
        </div>
      </div>
    </>
  );
};
export const MessageRight = (props: IProps) => {
  const classes = useStyles();
  const message = props.message ? props.message : "no message";
  const timestamp = props.timestamp ? props.timestamp : "";
  return (
    <div className={classes.messageRowRight}>
      <div className={classes.messageOrange}>
        {props.type === "image" && (
          <img
            src={`https://storage-api.daeletrica.com.br/view/${props.src}`}
            style={{ maxHeight: "250px" }}
          />
        )}
        {props.type === "chat" && (
          <p className={classes.messageContent}>{message}</p>
        )}
        {props.type === "ptt" && (
          <audio controls>
            <source
              src={`https://storage-api.daeletrica.com.br/view/${props.src}`}
              type="audio/ogg"
            />
            Your browser does not support the audio element.
          </audio>
        )}
        <div className={classes.messageTimeStampRight}>{timestamp}</div>
      </div>
    </div>
  );
};
