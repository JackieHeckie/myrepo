import { IChatData, IChatDataItem } from '@/typings/dashboard';
import React, { useRef, useState } from 'react';
import styles from './index.less';
import addImage from '@/assets/img/add.svg';
import cs from 'classnames';
import EchartsTest from '../echart-test';
import Line from '../chart/line';
import Pie from '../chart/pie';
import Bar from '../chart/bar';
import { DashOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps } from 'antd';
interface IChartItemProps {
  id: string;
  index: number;
  data: IChatDataItem;
  connections: Array<any>;
  canAddRowItem: boolean;

  onDelete?: () => void;
  addChartTop?: () => void;
  addChartBottom?: () => void;
  addChartLeft?: () => void;
  addChartRight?: () => void;
}

enum IChatType {
  'Pie' = 'Pie',
  'Column' = 'Column',
  'Line' = 'Line',
}

const defaultData: IChatDataItem = {
  sqlContext: '',
  sqlData: '',
  chatType: 'Line',
  chatParam: {},
};
const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        1st menu item
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        2nd menu item
      </a>
    ),
  },
  {
    key: '3',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
        3rd menu item
      </a>
    ),
  },
];
function ChartItem(props: IChartItemProps) {
  const [data, setData] = useState<IChatDataItem>(defaultData);
  const [isEditing, setIsEditing] = useState();
  const chartRef = useRef<any>();

  const renderLeftAndRightPlusIcon = () => {
    return (
      props.canAddRowItem && (
        <>
          <div onClick={props.addChartLeft} className={styles.left_overlay_add}>
            <div className={styles.add_chart_icon}>
              <img className={styles.add_chart_plus_icon} src={addImage} alt="Add chart" />
            </div>
          </div>

          <div onClick={props.addChartRight} className={styles.right_overlay_add}>
            <div className={styles.add_chart_icon}>
              <img className={styles.add_chart_plus_icon} src={addImage} alt="Add chart" />
            </div>
          </div>
        </>
      )
    );
  };

  const renderTopAndBottomPlusIcon = () => {
    return (
      <>
        <div onClick={props.addChartTop} className={styles.top_overlay_add}>
          <div className={cs(styles.add_chart_icon, styles.add_chart_icon_y)}>
            <img className={styles.add_chart_plus_icon} src={addImage} alt="Add chart" />
          </div>
        </div>

        <div onClick={props.addChartBottom} className={styles.bottom_overlay_add}>
          <div className={cs(styles.add_chart_icon, styles.add_chart_icon_y)}>
            <img className={styles.add_chart_plus_icon} src={addImage} alt="Add chart" />
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={styles.container}>
      {renderLeftAndRightPlusIcon()}
      {renderTopAndBottomPlusIcon()}
      <div className={styles.title_bar}>
        <div className={styles.title}>{IChatType[data?.chatType]}</div>

        <Dropdown
          menu={{
            items: [
              {
                key: '1',
                label: 'Export to image',
                onClick: () => {
                  console.log('chartRef.current', chartRef);
                  const echartInstance = chartRef.current.getEchartsInstance();
                  let img = new Image();
                  img.src = echartInstance.getDataURL({
                    type: 'png',
                    devicePixelRatio: 4,
                    backgroundColor: '#FFF',
                  });
                  img.onload = function () {
                    let canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    let ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0);
                    let dataURL = canvas.toDataURL('image/png');

                    var a = document.createElement('a');
                    let event = new MouseEvent('click');
                    a.download = 'image.png';
                    a.href = dataURL;
                    a.dispatchEvent(event);
                  };
                },
              },
            ],
          }}
          placement="bottomLeft"
        >
          <DashOutlined className={styles.edit} />
        </Dropdown>
      </div>

      <div>
        {
          // test
          props.index === 0 ? (
            <Pie ref={chartRef} />
          ) : props.index === 1 ? (
            <Line ref={chartRef} />
          ) : (
            <Bar ref={chartRef} />
          )
        }
      </div>

      <div>数据区块{props.id}</div>

      <div></div>
    </div>
  );
}

export default ChartItem;
