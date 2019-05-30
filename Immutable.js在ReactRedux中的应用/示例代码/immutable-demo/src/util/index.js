import 'whatwg-fetch';

export const formatData = (size = 10000) => {
  const obj = {};
  for (let i = 1; i <= size; i += 1) {
    obj[`key${i}`] = {
      index: i,
      isShow: false,
    };
  }
  return obj;
};

export function fetchRequest({
  // fetch请求封装
  url,
  method = 'post',
  headers = { 'Content-Type': 'application/json;charset=utf-8' },
  body,
}) {
  const timeout = 25000; // 超时时间
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Timeout：网络请求超时')), timeout);
  });
  const checkStatus = response => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  };
  const sendUrl = () => {
    let formatUrl = url;
    if (method === 'get' && body) {
      // 如果是get请求，将body里面的键值拼接到url上
      const paramsArr = [];
      Object.keys(body).forEach(key => paramsArr.push(`${key}=${body[key]}`));
      formatUrl +=
        formatUrl.search(/\?/) === -1
          ? `?${paramsArr.join('&')}`
          : `&${paramsArr.join('&')}`;
    }
    return formatUrl;
  };
  const options = {
    headers,
    method,
    credentials: 'include',
    body: ['get', 'head'].includes(method) ? undefined : JSON.stringify(body),
  };
  return Promise.race([fetch(sendUrl(), options), timeoutPromise])
    .then(checkStatus)
    .then(response => response.json())
    .then(data => (data.success ? data.result : Promise.reject(data)))
    .catch(data => {
      console.log('request failed');
      alert(data.message || data.errorMsg || '网络异常，稍后再试');
      return Promise.reject(data);
    });
}
