import React, { memo, useEffect, useRef, useState } from 'react';
import { connect, Dispatch } from 'umi';
import styles from './index.less';
import classnames from 'classnames';
import { IChatData, IChatDataItem, IChatDataSortItem } from '@/typings/dashboard';
import DraggableContainer from '@/components/DraggableContainer';
import Iconfont from '@/components/Iconfont';
import ChartItem from './chart-item';
import { Button } from 'antd';
import { ReactSortable, Store } from 'react-sortablejs';
import { GlobalState } from '@/models/global';

interface IProps {
  className?: string;
  setting: GlobalState['settings'];
  dispatch: Dispatch;
}

const initChartItemData: IChatDataItem = {
  sqlContext: 'sqlContext',
  sqlData: 'aa',
  chatType: 'Line',
  chatParam: {
    x: '',
    y: '',
  },
};

const initDataList: IChatData[] = [
  {
    name: 'Demo',
    data: [[initChartItemData]],
  },
];

function Chart(props: IProps) {
  const { className } = props;

  const [dataList, setDataList] = useState(initDataList);
  const [curItem, setCurItem] = useState<IChatData>(dataList[0]);

  useEffect(() => {
    // TODO: 获取列表数据
    //
    console.log('chart', props);
  }, []);

  const renderContent = () => {
    const { data, name } = curItem || {};
    if (!data) return;

    const sortData = (data || []).reduce((acc: IChatDataSortItem[], cur, i) => {
      const tmp = (cur || []).map((c, ii) => ({ id: `${i}_${ii}`, ...c }));
      acc.push(...tmp);
      return acc;
    }, []);

    console.log(sortData, 'sortData');
    return (
      <>
        <div className={styles.box_right_title}>
          <Iconfont code="&#xe60d;" />
          <div style={{ marginLeft: '8px' }}>{name}</div>
        </div>

        <div className={styles.box_right_content}>
          {/* <ReactSortable
            list={sortData}
            setList={(newState: IChatDataSortItem[], sortable: any, store: Store) => {
              // throw new Error('Function not implemented.');
            }}
            onAdd={() => {}}
          > */}
          {data.map((rowData, rowIndex) => (
            <div key={rowIndex} className={styles.box_right_content_row}>
              {rowData.map((item, colIndex) => (
                <div className={styles.box_right_content_column} style={{ width: `${100 / rowData.length}%` }}>
                  <ChartItem
                    id={`${rowIndex}_${colIndex}`}
                    index={colIndex}
                    key={`${rowIndex}_${colIndex}`}
                    data={item}
                    connections={[]}
                    canAddRowItem={rowData.length < 3}
                    addChartTop={() => {
                      data.splice(rowIndex, 0, [initChartItemData]);
                      setDataList([...dataList]);
                    }}
                    addChartBottom={() => {
                      data.splice(rowIndex + 1, 0, [initChartItemData]);
                      setDataList([...dataList]);
                    }}
                    addChartLeft={() => {
                      rowData.splice(colIndex, 0, initChartItemData);
                      setDataList([...dataList]);
                    }}
                    addChartRight={() => {
                      rowData.splice(colIndex + 1, 0, initChartItemData);
                      setDataList([...dataList]);
                    }}
                    onDelete={() => {
                      if (rowData.length === 1) {
                        data.splice(rowIndex, 1);
                        setDataList([...dataList]);
                      } else {
                        rowData.splice(colIndex, 1);
                        setDataList([...dataList]);
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
          {/* </ReactSortable> */}
        </div>
      </>
    );
  };

  return (
    <DraggableContainer layout="row" className={classnames(styles.box, className)}>
      <div className={styles.box_left}>
        <div className={styles.box_left_title}>Dashboard</div>
        {(dataList || []).map((i, index) => (
          <div key={index} className={styles.box_left_item} onClick={() => setCurItem(i)}>
            <div>{i.name}</div>
          </div>
        ))}
        {/* 
        <Button
          onClick={() => {
            props.dispatch({
              type: 'global/updateSettings',
              payload: {
                theme: 'dark',
                language: 'en',
              },
            });
          }}
        >
          测试dva
        </Button> */}
      </div>
      <div className={styles.box_right}>{renderContent()}</div>
    </DraggableContainer>
  );
}

export default connect(({ global }: { global: GlobalState }) => ({
  settings: global.settings,
}))(Chart);
