import axios from "axios";
export const getData = async ({ queryKey }: { queryKey: any[] }) => {
  const [url] = queryKey;
  const response = await axios.get(url, {
    method: "GET",
  });

  return response.data.data;
};
