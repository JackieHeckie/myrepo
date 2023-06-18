import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import * as charts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import './index.less';
type EChartsOption = charts.EChartsOption;

const LineChart = (props, ref) => {
  const lineRef = useRef<any>(null);
  const getOption = () => {
    const option: EChartsOption = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
        },
      ],
    };
    return option;
  };

  useImperativeHandle(ref, () => ({
    getEchartsInstance: () => lineRef.current.getEchartsInstance(),
  }));
  return <ReactEcharts ref={lineRef} option={getOption()} />;
};

export default forwardRef(LineChart);
