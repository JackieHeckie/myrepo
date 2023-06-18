import React, { LegacyRef, useImperativeHandle, useRef } from 'react';
import * as charts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import './index.less';
import { Button } from 'antd';
import { forwardRef } from 'react';
type EChartsOption = charts.EChartsOption;

const PieChart = (props, ref) => {
  const pieRef = useRef<any>(null);
  const getOption = () => {
    const option: EChartsOption = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '5%',
        left: 'center',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' },
          ],
        },
      ],
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            name: 'pie',
            title: '保存图片',
            show: true,
            excludeComponents: ['toolbox'],
            pixelRatio: 2,
          },
        },
      },
    };
    return option;
  };

  useImperativeHandle(ref, () => ({
    getEchartsInstance: () => pieRef.current.getEchartsInstance(),
  }));

  return <ReactEcharts ref={pieRef} option={getOption()} />;
};

export default forwardRef(PieChart);
