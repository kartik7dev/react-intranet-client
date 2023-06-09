import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./use-refresh-token";
import { useAuth } from 'src/hooks/use-auth';

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { token } = useAuth();

    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
              const prevRequest = error?.config;
              if (error?.response?.status === 403 && !prevRequest?.sent) {
                prevRequest.sent = true;
                try {
                  const newAccessToken = await refresh();
                  console.log("newAccessToken",newAccessToken)
                  prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                  return axiosPrivate(prevRequest);
                } catch (refreshError) {
                  // Handle error during token refresh, e.g., log or display an error message
                  return Promise.reject(refreshError);
                }
              }
              return Promise.reject(error);
            }
          );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [token, refresh])

    return axiosPrivate;
}

export default useAxiosPrivate;