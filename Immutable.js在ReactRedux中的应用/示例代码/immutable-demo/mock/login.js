const Mock = require('mockjs');
const express = require('express');
const router = express.Router();

router.use('/profile', (req, res) => {
  const data = Mock.mock({
    'list|1-10': [
      {
        'id|+1': 1,
      },
    ],
  });
  return res.json(data);
});

router.use('/loginMock', (req, res) => {
  const data = Mock.mock({
    success: true,
    errorMsg: null,
    result: {
      userName: '@first',
      userPwd: 123456,
    },
  });
  return res.json(data);
});

module.exports = router;
