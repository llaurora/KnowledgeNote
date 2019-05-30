import React from 'react';
import classname from 'classnames';
import PropTypes from 'prop-types';
import './style.scss';

const formatGridList = (list, len) => {
  const listLength = list.length;
  const formatList = [];
  if (listLength <= len) {
    // 只有一行的情况下
    formatList.push(
      list.slice(0, listLength).map((item, index) => ({
        comp: item,
        isBlank: false,
        isLast: index === listLength - 1,
      })),
    );
  } else {
    const segmentsNum = Math.ceil(listLength / len);
    for (let i = 0; i < segmentsNum; i += 1) {
      if (i < segmentsNum - 1) {
        formatList.push(
          list.slice(i * len, i * len + len).map((item, index) => ({
            comp: item,
            isBlank: false,
            isLast: index === len - 1,
          })),
        );
      } else if (listLength - len * i < len) {
        const endSliceList = list.slice(len * i - listLength).map(item => ({
          comp: item,
          isBlank: false,
          isLast: false,
        }));
        const fillList = new Array(len + len * i - listLength - 1).fill({
          isBlank: true,
          isLast: false,
        });
        fillList.push({
          isBlank: true,
          isLast: true,
        });
        formatList.push([...endSliceList, ...fillList]);
      } else {
        const endSliceList = list.slice(len * i - listLength, -1).map(item => ({
          comp: item,
          isBlank: false,
          isLast: false,
        }));
        const fillList = list.slice(-1).map(item => ({
          comp: item,
          isBlank: false,
          isLast: true,
        }));
        formatList.push([...endSliceList, ...fillList]);
      }
    }
  }
  return formatList;
};

export function GridLayout({
  gridParams: {
    nodeList,
    len = 3,
    rowHeight = '300px',
    rowSpace = 0,
    colSpace = 0,
    alignItems = 'flex-start',
  },
}) {
  const formatCompWrapperList = formatGridList(nodeList, len); // eslint-disable-line
  const formatCompWrapperListLength = formatCompWrapperList.length; // 3
  // const segmentsNum = Math.ceil(listLength / len); // 3
  return (
    <ul className="gridArea">
      {formatCompWrapperList.map((row, index) => (
        <li
          className="gridRow"
          key={index} // eslint-disable-line react/no-array-index-key
          style={{
            height: rowHeight,
            marginTop:
              formatCompWrapperListLength !== 1 && index !== 0 ? rowSpace : 0,
          }}
        >
          <ul className="lineRow">
            {row.map((col, key) => (
              <li
                className={classname('lineCol', {
                  isBlank: col.isBlank,
                  isLast: col.isLast,
                })}
                key={key} // eslint-disable-line react/no-array-index-key
                style={{
                  alignItems,
                  marginRight: col.isLast ? 0 : colSpace,
                }}
              >
                {!col.isBlank && col.comp}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

GridLayout.propTypes = {
  gridParams: PropTypes.shape({
    nodeList: PropTypes.array, // 组件集合
    len: PropTypes.number, // 一行布局列数
    alignItems: PropTypes.string, // 弹性布局方向
    rowHeight: PropTypes.string, // 行高
    rowSpace: PropTypes.oneOfType([
      // 行间距
      PropTypes.string,
      PropTypes.number,
    ]),
    colSpace: PropTypes.oneOfType([
      // 列间距
      PropTypes.string,
      PropTypes.number,
    ]),
  }),
};
