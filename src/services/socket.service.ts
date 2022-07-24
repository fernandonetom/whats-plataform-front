import io from "socket.io-client";

export const makeSocket = (token: string) => {
  return io(String(process.env.REACT_APP_API_URL), {
    extraHeaders: {
      authorization: `Bearer: ${token}`,
    },
  });
};
