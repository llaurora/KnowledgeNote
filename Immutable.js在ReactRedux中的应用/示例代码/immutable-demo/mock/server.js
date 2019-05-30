const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const { devMockPort } = require('../config/server.config');

app.use(bodyParser.json()); // body-parser解析json格式数据
app.use(
  bodyParser.urlencoded({
    // 此项必须在 bodyParser.json下面,为参数编码
    extended: true,
  }),
);

app.get('/', (req, res) => {
  res.send('Hello mockServer');
});

app.use('/devmock', router);

router.use('/login', require('./login'));

app.listen(devMockPort);
