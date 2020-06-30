import React from 'react'
import {
  VictoryChart,
  VictoryZoomContainer,
  VictoryLine,
  VictoryArea,
  VictoryAxis,
  VictoryScatter,
  VictoryLabel,
  createContainer,
  LineSegment,
} from 'victory'

import NavigatorPlot from './NavigatorPlot/NavigatorPlot'
import AddInterventionCursor from './AddInterventionCursor/AddInterventionCursor'
import PastInterventionInfo from './PastInterventionInfo/PastInterventionInfo'
import AddInterventionDialog from './AddInterventionDialog/AddInterventionDialog'

import styles from './PolicyPlot.module.scss'

const plotColors = ['#00a79d', '#00447c', '#7a4500', '#774573']

const VictoryZoomCursorContainer = createContainer('zoom', 'cursor')

const PolicyModel = props => {
  const [pastInterventionProps, setPastInterventionProps] = React.useState({
    x: 0,
    y: 0,
    policyName: '',
    effectiveDate: '',
  })

  const [addIntDialogState, setAddIntDialogState] = React.useState({
    show: false,
    x: 0,
    y: 0,
  })

  // not resizing plots to match
  // window aspect ratio anymore
  // just setting the main witdth to
  // the width of the rest of the amp
  // site now.

  // const percentProportion = 0.15;
  // const chartProportion = 0.6;
  // const navigatorProportion = 0.2;

  // The actuals lines of the plot
  const actualsLines = Object.entries(props.data.curves).map(
    ([curveName, data], index) => {
      if (curveName !== 'R effective') {
        return (
          <VictoryLine
            key={curveName}
            style={{
              data: { stroke: plotColors[index], strokeWidth: 1 },
            }}
            data={data.actuals}
            // interpolation={'monotoneX'}
          />
        )
      } else {
        return false
      }
    }
  )

  // WHY doesn't Victory let me return multiple lines from
  // the same map function? no reason that shouldn't work.
  // the model (dashed) lines of the plot
  const modelLines = Object.entries(props.data.curves).map(
    ([curveName, data], index) => {
      if (curveName !== 'R effective') {
        return (
          <VictoryLine
            key={curveName}
            style={{
              data: {
                stroke: plotColors[index],
                strokeWidth: 1,
                strokeDasharray: 4,
              },
            }}
            data={data.model}
            interpolation={'monotoneX'}
          />
        )
      } else {
        return false
      }
    }
  )

  const interventionLines = props.data.interventions.map(intervention => (
    <VictoryLine
      key={intervention.name + intervention.intervention_start_date}
      style={{ data: { stroke: 'firebrick', strokeWidth: 1 } }}
      data={[
        { x: Date.parse(intervention.intervention_start_date), y: 0 },
        {
          x: Date.parse(intervention.intervention_start_date),
          y: props.caseLoadAxis[1],
        },
      ]}
    />
  ))

  const interventionPoints = props.data.interventions.map(intervention => (
    <VictoryScatter
      key={intervention.name + intervention.intervention_start_date}
      labelComponent={<VictoryLabel style={{ display: 'none' }} />}
      size={5.5}
      style={{
        data: { fill: 'firebrick', stroke: 'white', strokeWidth: 1 },
      }}
      events={[
        {
          childName: 'all',
          target: 'data',

          eventHandlers: {
            onMouseEnter: (event, eventKey) => {
              setPastInterventionProps({
                policyName: intervention.name,
                effectiveDate: intervention.intervention_start_date,
                x:
                  window.pageXOffset +
                  event.target.getBoundingClientRect().left,
                y:
                  window.pageYOffset + event.target.getBoundingClientRect().top,
              })
            },
          },
        },
      ]}
      data={[
        {
          x: Date.parse(intervention.intervention_start_date),
          y: props.caseLoadAxis[1] * 0.8,
          label: intervention.name,
        },
      ]}
    />
  ))

  return (
    <section className={styles.main}>
      <PastInterventionInfo
        {...{ pastInterventionProps, setPastInterventionProps }}
      />
      <AddInterventionDialog
        position={addIntDialogState}
        setPosition={setAddIntDialogState}
      />
      <svg style={{ height: 0 }}>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#00447c', stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: '#00447c', stopOpacity: 0 }}
          />
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop
            offset="0%"
            style={{ stopColor: '#00447c', stopOpacity: 0.5 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: '#00447c', stopOpacity: 0 }}
          />
        </linearGradient>
      </svg>
      <VictoryChart
        padding={{ top: 5, bottom: 0, left: 30, right: 10 }}
        domainPadding={10}
        responsive={true}
        width={500}
        height={80}
        // height={
        //   (window.innerHeight / window.innerWidth) * 500 * percentProportion
        // }
        // style={{ height: percentProportion * 100 + '%' }}
        scale={{ x: 'time' }}
        containerComponent={
          <VictoryZoomContainer
            className={styles.pct}
            allowZoom={false}
            zoomDimension="x"
            zoomDomain={{ x: props.zoomDateRange }}
            onZoomDomainChange={domain => {
              props.setZoomDateRange(domain.x)
            }}
          />
        }
      >
        <VictoryAxis
          dependentAxis
          // tickFormat={(tick) => tick / 1000 + 'K'}
          style={{
            grid: {
              stroke: '#aaaaaa',
              strokeWidth: 2,
            },
            axis: { stroke: '#fff', strokeWidth: 0 },
            ticks: { strokeWidth: 0 },
            tickLabels: {
              fill: '#aaa',
              fontFamily: 'Rawline',
              fontWeight: '500',
              fontSize: 4,
            },
          }}
        />
        <VictoryArea
          style={{
            data: { stroke: 'grey', strokeWidth: 0.5, fill: 'url(#grad1)' },
          }}
          data={props.data.curves['R effective'].actuals}
        />
        <VictoryArea
          style={{
            data: { stroke: 'grey', strokeWidth: 0.5, fill: 'url(#grad2)' },
          }}
          data={props.data.curves['R effective'].model}
        />
        <VictoryLine
          style={{ data: { stroke: 'skyblue', strokeWidth: 1 } }}
          data={[
            { x: new Date(), y: 0 },
            { x: new Date(), y: 3 },
          ]}
        />
      </VictoryChart>
      <VictoryChart
        padding={{ top: 0, bottom: 15, left: 30, right: 10 }}
        domainPadding={10}
        responsive={true}
        width={500}
        height={300}
        events={[
          {
            target: 'parent',
            eventHandlers: {
              onClick: (event, eventKey) => {
                const today = new Date()
                if (eventKey.cursorValue.x > today) {
                  setAddIntDialogState({
                    show: true,
                    x: event.clientX,
                    y: event.clientY,
                  })
                }
              },
            },
          },
        ]}
        // height={
        // (window.innerHeight / window.innerWidth) * 500 * chartProportion
        // }
        // style={{ height: chartProportion * 100 + '%' }}
        scale={{ x: 'time' }}
        containerComponent={
          <VictoryZoomCursorContainer
            className={styles.chart}
            cursorLabelComponent={
              <AddInterventionCursor showLabel={!addIntDialogState.show} />
            }
            cursorComponent={<LineSegment style={{ display: 'none' }} />}
            cursorLabel={({ datum }) => `add intervention`}
            allowZoom={false}
            // If we want to re-enable panning, there will
            // need to be better event handling to separate
            // panning and clicking to add interventions.
            allowPan={false}
            zoomDimension="x"
            zoomDomain={{ x: props.zoomDateRange }}
            onZoomDomainChange={domain => {
              props.setZoomDateRange(domain.x)
            }}
          />
        }
      >
        <VictoryAxis
          dependentAxis
          tickFormat={tick => tick / 1000 + 'K'}
          style={{
            grid: {
              stroke: '#aaaaaa',
              strokeWidth: 2,
            },
            axis: { stroke: '#fff', strokeWidth: 0 },
            ticks: { strokeWidth: 0 },
            tickLabels: {
              fill: '#aaa',
              fontFamily: 'Rawline',
              fontWeight: '500',
              fontSize: 4,
            },
          }}
        />
        <VictoryAxis
          orientation="bottom"
          style={{
            tickLabels: {
              fontFamily: 'Rawline',
              fontWeight: '500',
              fontSize: '4',
            },
          }}
        />
        {/* Today marker */}
        <VictoryLine
          style={{ data: { stroke: 'skyblue', strokeWidth: 1 } }}
          data={[
            { x: new Date(), y: 0 },
            { x: new Date(), y: props.caseLoadAxis[1] },
          ]}
        />

        {actualsLines}
        {modelLines}
        {interventionLines}
        {interventionPoints}
      </VictoryChart>

      <NavigatorPlot
        curves={props.data.curves}
        zoomDateRange={props.zoomDateRange}
        setZoomDateRange={props.setZoomDateRange}
        domain={props.domain}
        caseLoadAxis={props.caseLoadAxis}
      />
    </section>
  )
}

export default PolicyModel
