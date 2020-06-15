import React from 'react';
import {
  VictoryChart,
  VictoryLine,
  VictoryArea,
  VictoryBrushContainer,
  VictoryAxis,
} from 'victory';

import CustomBrush from '../CustomBrush/CustomBrush';
import styles from './NavigatorPlot.module.scss';

const NavigatorPlot = (props) => {
  return (
    <VictoryChart
      className={styles.navigator}
      style={{ height: props.proportion * 100 + '%' }}
      width={500}
      height={(window.innerHeight / window.innerWidth) * 500 * props.proportion}
      padding={{ top: 0, bottom: 25, left: 0, right: 0 }}
      domainPadding={10}
      responsive={true}
      scale={{ x: 'time' }}
      // padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
      containerComponent={
        <VictoryBrushContainer
          brushDimension="x"
          brushComponent={<CustomBrush />}
          brushDomain={{ x: props.dateRange }}
          onBrushDomainChange={(domain) => {
            // props.setZoomDomain({ x: domain.x, y: props.zoomDomain.y });
            props.setDateRange(domain.x);
          }}
        />
      }
    >
      {}
      <VictoryAxis
        tickValues={props.data
          .map((day) => day.x)
          .filter((date, index) => index % 30 === 0)}
        tickFormat={(x) =>
          new Date(x).toLocaleString('default', { month: 'short' })
        }
        style={{
          tickLabels: {
            fontFamily: 'Rawline',
            fontWeight: '500',
            fontSize: '4',
          },
        }}
      />
      <VictoryLine
        style={{
          data: { stroke: 'grey', strokeWidth: 1 },
        }}
        data={props.data}
        // interpolation={'monotoneX'}
      />
      {/* <VictoryArea */}
      {/*   style={{ */}
      {/*     data: { fill: 'gray', opacity: 0.5 }, */}
      {/*   }} */}
      {/*   // data={ */}
      {/*   //   props.zoomDomain, */}
      {/*   // } */}
      {/* /> */}
    </VictoryChart>
  );
};

export default NavigatorPlot;
