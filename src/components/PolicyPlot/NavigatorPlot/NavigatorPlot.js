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
      // style={{ height: props.proportion * 100 + '%' }}
      width={500}
      height={100}
      // height={(window.innerHeight / window.innerWidth) * 500 * props.proportion}
      padding={{ top: 0, bottom: 25, left: 0, right: 0 }}
      domainPadding={10}
      responsive={true}
      scale={{ x: 'time' }}
      // padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
      containerComponent={
        <VictoryBrushContainer
          brushDimension="x"
          brushComponent={<CustomBrush />}
          brushDomain={{ x: props.zoomDateRange }}
          onBrushDomainChange={(domain) => {
            // props.setZoomDomain({ x: domain.x, y: props.zoomDomain.y });
            props.setZoomDateRange(domain.x);
          }}
        />
      }
    >
      {}
      <VictoryAxis
        tickValues={props.data.actuals
          .concat(props.data.model)
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
        data={props.data.actuals}
      />
      <VictoryLine
        style={{
          data: { stroke: 'grey', strokeWidth: 1, strokeDasharray: 4 },
        }}
        data={props.data.model}
      />
      <VictoryArea
        style={{
          data: { fill: 'gray', opacity: 0.25 },
        }}
        data={[
          { x: props.domain[0], y: props.caseLoadAxis[1] },
          { x: props.zoomDateRange[0], y: props.caseLoadAxis[1] },
        ]}
      />
      <VictoryArea
        style={{
          data: { fill: 'gray', opacity: 0.25 },
        }}
        data={[
          { x: props.domain[1], y: props.caseLoadAxis[1] },
          { x: props.zoomDateRange[1], y: props.caseLoadAxis[1] },
        ]}
      />
      {
        // only show date line when date is outside the range
        (new Date() < props.zoomDateRange[0] ||
          new Date() > props.zoomDateRange[1]) && (
          <VictoryLine
            style={{ data: { stroke: 'skyblue', strokeWidth: 1 } }}
            data={[
              { x: new Date(), y: 0 },
              { x: new Date(), y: props.caseLoadAxis[1] },
            ]}
          />
        )
      }
    </VictoryChart>
  );
};

export default NavigatorPlot;
