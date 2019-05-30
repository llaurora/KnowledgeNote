const matchMode = (env, stage) => {
  let modeName;
  if (env === 'development' && stage === 'mock') {
    modeName = 'devmock';
  } else if (env === 'development' && !stage) {
    modeName = 'development';
  } else if (env === 'production') {
    modeName = 'production';
  }
  return modeName;
};
const apiUrl = {
  development: `http://${window.location.host}`,
  devmock: `http://${window.location.host}/devmock`,
  production: `http://${window.location.host}`,
};
const modeName = matchMode(process.env.NODE_ENV, process.env.NODE_STAGE);
const baseUrl = apiUrl[modeName];

export default {
  loginMock: `${baseUrl}/login/loginMock`,
  loginJson: `${baseUrl}/mock/login.json`,
};
