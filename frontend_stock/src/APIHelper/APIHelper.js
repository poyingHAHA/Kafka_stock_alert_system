import axios from 'axios';

const APIHelper = axios.create({ 
  timeout: 3000,
});

const requestErrorHandler = (error) => {
  console.log(error);
  return Promise.reject(error);
}

const responseHandler = (response) => {
  return response.data;
}

const responseErrorHandler = (error) => {
  console.log(error);
  return Promise.reject(error);
}

const requestInterceptor = (config) => {
  return config;
}

APIHelper.interceptors.request.use(requestInterceptor, requestErrorHandler);
APIHelper.interceptors.response.use(responseHandler, responseErrorHandler);

const get = (url, config) => {
  return new Promise((resolve, reject) => {
    APIHelper.get(url, config)
      .then((response) => { resolve(response); })
      .catch((error) => { reject(error); })
  })
}

export default {
  get
}