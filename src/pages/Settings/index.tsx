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
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItemAvatar,
  Menu,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import { MessageLeft, MessageRight } from "../../components/Message";
import { Send } from "@mui/icons-material";
import useFetch from "../../hook/useFetch";
import { api } from "../../services/api.service";
import { DateUtils } from "../../utils/dateUtils";
import useAuth from "../../hook/useAuth";
import { useNavigate } from "react-router-dom";
import { makeSocket } from "../../services/socket.service";

const drawerWidth = 400;

function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}

enum StatusInstance {
  Criada = 1,
  Iniciando = 2,
  Ativo = 3,
  Desligada = 4,
  Bloqueada = 5,
  Erro = 6,
}

interface IInstanceResponse {
  id: string;
  phone: string;
  status: {
    id: StatusInstance;
    name: string;
  };
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

export default function Settings() {
  const [, setWindowSize] = React.useState(getWindowSize());
  const navigation = useNavigate();
  const [isMobile, setIsMobile] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [chatList, setChatList] = React.useState<IChatResponse[]>([]);
  const [messageList, setMessageList] = React.useState<IMessageResponse[]>([]);
  const [selected, setSelected] = React.useState<ISelected>({
    instance: undefined,
    chat: undefined,
  });
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const [instancies, setInstancies] = React.useState<IInstanceResponse[]>([]);

  const [actualMenu, setActualMenu] = React.useState("instance");

  const { user } = useAuth();
  const socket = makeSocket(String(user?.token));

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        switch (actualMenu) {
          case "instance":
            const { data } = await api.get<IInstanceResponse[]>(`/instance`);
            setInstancies(data);
            break;

          default:
            break;
        }
      } catch (error) {}
    };

    void fetchData();
  }, [actualMenu]);

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
    socket.on("connect", () => {
      console.log("conectou");
    });

    socket.on("disconnect", () => {
      console.log("desconectou");
    });

    socket.on(`${user?.companyId}.instance.status`, (data) => {
      updateStatusBySocket(data);
    });

    socket.on("error", (error: any) => {
      console.log(error);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off(`${user?.companyId}.instance.status`);
    };
  }, []);

  const updateStatusBySocket = (data: {
    instance: string;
    status_id: string;
    status_text: string;
  }) => {
    console.log(data);
    const find = instancies.findIndex((item) => item.id === data.instance);
    console.log(instancies, find);
    if (find >= 0) {
      let aux = [...instancies];
      aux[find] = {
        ...aux[find],
        status: {
          id: data.status_id as any,
          name: data.status_text,
        },
      };
      setInstancies(aux);
    }
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleClickOptions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseOptions = async (action?: string, id?: string) => {
    if (action && id) {
      try {
        switch (action) {
          case "ligar":
            await api.patch(`/instance/${id}/start`);
            break;

          case "desligar":
            await api.patch(`/instance/${id}/stop`);
            break;
        }
      } catch (error) {}
    }
    setAnchorEl(null);
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
              Configurações
            </Typography>
            <Box sx={{ flexGrow: 0, ml: "auto" }}>
              <Tooltip title="Opções">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={() => navigation("/chats")}>
                  <Typography textAlign="center">Conversas</Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Sair</Typography>
                </MenuItem>
              </Menu>
            </Box>
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
          <Box sx={{ overflow: "auto" }}>
            <List>
              <ListItem>
                <ListItemButton>
                  <ListItemText primary="Instâncias" />
                </ListItemButton>
              </ListItem>

              <ListItem>
                <ListItemButton>
                  <ListItemText primary="Usuários" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, position: "relative" }}>
          <Toolbar />
          <Box style={{ paddingBottom: 130 }}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Instâncias
                </Typography>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Configurar números de WhatsApp
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 275, mt: 2 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Criar instância
                </Typography>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Adicione um novo número ao sistema
                </Typography>

                <Box
                  component="form"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="filled-basic"
                    label="Número"
                    variant="outlined"
                    required
                  />

                  <TextField
                    id="filled-basic"
                    label="Descrição"
                    variant="outlined"
                  />

                  <Button sx={{ ml: 2 }} variant="contained">
                    Adicionar
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ minWidth: 275, mt: 2 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Instâncias criadas
                </Typography>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table
                    sx={{ minWidth: 650 }}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Número</TableCell>
                        <TableCell align="right">Status</TableCell>
                        <TableCell align="right">Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {instancies.map((row) => (
                        <TableRow
                          key={row.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {row.phone}
                          </TableCell>
                          <TableCell align="right">{row.status.name}</TableCell>
                          <TableCell align="right">
                            <Button
                              id="basic-button"
                              aria-controls={
                                Boolean(anchorEl) ? "basic-menu" : undefined
                              }
                              aria-haspopup="true"
                              aria-expanded={
                                Boolean(anchorEl) ? "true" : undefined
                              }
                              onClick={handleClickOptions}
                            >
                              Opções
                            </Button>
                            <Menu
                              id="basic-menu"
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={() => handleCloseOptions()}
                              MenuListProps={{
                                "aria-labelledby": "basic-button",
                              }}
                            >
                              <MenuItem
                                onClick={() =>
                                  handleCloseOptions("ligar", row.id)
                                }
                              >
                                Iniciar
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  handleCloseOptions("ligar", row.id)
                                }
                              >
                                Desligar
                              </MenuItem>
                            </Menu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </>
  );
}
