import { useEffect, useState } from "react";
import { api } from "../services/api.service";

interface State<T> {
  data?: T;
  error?: Error;
  loading: boolean;
}

function useFetch<T = unknown>(url?: string): State<T> {
  const [state, setData] = useState<State<T>>({
    loading: false,
  });

  useEffect(() => {
    // Do nothing if the url is not given
    if (!url) return;

    setData({
      loading: true
    })

    const fetchData = async () => {
      try {
        const { data } = await api.get<T>(url);
        setData({
          loading: false,
          data,
        });
      } catch (error: any) {
        setData({
          loading: false,
          error: error.message,
        });
      }
    };

    void fetchData();
  }, [url]);

  return state;
}

export default useFetch;
