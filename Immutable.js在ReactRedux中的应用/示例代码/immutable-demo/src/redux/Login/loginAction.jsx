export function changeLoginState(type, data = {}) {
  return {
    type,
    data,
  };
}

// export const getAnalyseAllotRateChartData = (url, body) => dispatch => {
//   dispatch({ type: 'LOADING_SHOW' });
//   Util.fetchHandler({ url, body }).then(resdata => {
//     dispatch({ type: 'LOADING_HIDDEN' });
//     const data = Object.assign(
//       {
//         total: 0, // 调拨频次
//         LastYearIncrease: 0, // 同比增长数
//         LastYearIncreaseRatio: 0, // 同比增长率
//         LinkRelativeIncrease: 0, // 环比增长数
//         LinkRelativeIncreaseRatio: 0, // 环比增长率
//       },
//       resdata[0],
//     );
//     data.LastYearIncreaseRatio = `${Util.accMul(
//       data.LastYearIncreaseRatio,
//       100,
//     )}%`;
//     data.LinkRelativeIncreaseRatio = `${Util.accMul(
//       data.LinkRelativeIncreaseRatio,
//       100,
//     )}%`;
//     dispatch({
//       type: 'STORE_ChART_ANALYSE_ALLOTRATE',
//       data,
//     });
//   });
// };
