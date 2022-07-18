import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Avatar,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItemAvatar,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { MessageLeft, MessageRight } from "../../components/Message";
import { Send } from "@mui/icons-material";
import useFetch from "../../hook/useFetch";
import { api } from "../../services/api.service";
import { DateUtils } from "../../utils/dateUtils";

const drawerWidth = 600;

function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}

interface IInstanceResponse {
  id: string;
  phone: string;
}
interface ISelected {
  instance: string | undefined;
  chat: string | undefined;
}
interface IChatResponse {
  id: string;
  name: string | null;
  phone: string;
  avatar: string;
  Message: {
    type: string;
    body: string | null;
    src: string | null;
    createdAt: string;
  }[];
}
interface IMessageResponse {
  id: string;
  venomId: string | null;
  type: string;
  fromMe: boolean;
  body: string | null;
  src: string | null;
  createdAt: string;
}

export default function ChatList() {
  const [, setWindowSize] = React.useState(getWindowSize());
  const [isMobile, setIsMobile] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [chatList, setChatList] = React.useState<IChatResponse[]>([]);
  const [messageList, setMessageList] = React.useState<IMessageResponse[]>([]);
  const [selected, setSelected] = React.useState<ISelected>({
    instance: undefined,
    chat: undefined,
  });
  const { loading: loadingInstance, data: instancies } =
    useFetch<IInstanceResponse[]>("/instance");

  const messagesEndRef = React.useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
      setIsMobile(getWindowSize().innerWidth < 680);
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  React.useEffect(() => {
    const fetchByInstance = async () => {
      if (selected.instance || (instancies && instancies.length === 1)) {
        try {
          const { data } = await api.get<IChatResponse[]>(
            `/chat/${selected.instance || ""}`
          );
          setChatList(data);
        } catch (error) {}
      }
    };

    void fetchByInstance();
  }, [selected.instance, instancies]);

  React.useEffect(() => {
    const fetchByInstance = async () => {
      if (selected.chat) {
        try {
          const { data } = await api.get<IMessageResponse[]>(
            `/chat/${selected.chat}/messages`
          );
          setMessageList(data.reverse());
          console.log(data);
        } catch (error) {}
      }
    };

    void fetchByInstance();
  }, [selected.chat]);

  React.useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleSelectInstance = ({ target }: SelectChangeEvent) => {
    setSelected({
      ...selected,
      instance: target.value,
    });
  };

  const handleSelectChat = (id: string) => {
    setSelected({
      ...selected,
      chat: id,
    });
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Conversas
            </Typography>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ ml: "auto" }}
            >
              <Avatar src="https://mui.com/static/images/avatar/1.jpg" />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={open}
          onClose={handleDrawerToggle}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          {!loadingInstance && instancies && instancies.length > 1 && (
            <Box>
              <FormControl variant="standard" fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Número do Whatsapp
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selected.instance}
                  label="Instância"
                  onChange={handleSelectInstance}
                >
                  {instancies.map((instance) => (
                    <MenuItem key={instance.id} value={instance.id}>
                      {instance.phone}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
          <Box sx={{ overflow: "auto" }}>
            <List>
              {chatList.map((chat, index) => (
                <ListItem key={chat.id}>
                  <ListItemButton onClick={() => handleSelectChat(chat.id)}>
                    <ListItemAvatar>
                      <Avatar
                        src={`https://storage-api.daeletrica.com.br/view/${chat.avatar}`}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={chat.name || chat.phone}
                      secondary={chat.Message[0].body}
                    />
                    <Typography variant="caption" gutterBottom>
                      {DateUtils.diffToString(chat.Message[0].createdAt)}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, position: "relative" }}>
          <Toolbar />
          <Box style={{ paddingBottom: 130 }}>
            {messageList.map((message) => {
              if (message.fromMe) {
                return (
                  <MessageRight
                    message={message.body}
                    timestamp={DateUtils.diffToString(message.createdAt)}
                    src={message.src}
                    type={message.type}
                  />
                );
              } else {
                return (
                  <MessageLeft
                    message={message.body}
                    timestamp={DateUtils.diffToString(message.createdAt)}
                    src={message.src}
                    type={message.type}
                  />
                );
              }
            })}
            <div ref={messagesEndRef} style={{ backgroundColor: "red" }} />
          </Box>
          <Box
            style={{
              backgroundColor: "white",
              position: "fixed",
              bottom: 0,
              left: 0,
              paddingLeft: isMobile ? 0 : 600,
              width: "100%",
            }}
          >
            <Box>Ações</Box>
            <Grid container spacing={2}>
              <Grid item xs={10}>
                <FormControl fullWidth sx={{ m: 1 }}>
                  <TextField
                    id="standard-multiline-static"
                    label="Mensagem"
                    multiline
                    rows={2}
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <IconButton
                  color="primary"
                  aria-label="add to shopping cart"
                  size="large"
                >
                  <Send />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </>
  );
}
