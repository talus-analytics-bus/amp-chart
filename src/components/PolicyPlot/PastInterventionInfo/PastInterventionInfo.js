import React from 'react'

import styles from './PastInterventionInfo.module.scss'

const PastInterventionInfo = props => {
  const setState = props.setPastInterventionProps
  props = { ...props.pastInterventionProps }

  const width = 300
  const arrowOffset = { x: 32, y: 28 }

  const xPos =
    props.x < window.innerWidth / 2
      ? props.x + arrowOffset.x
      : props.x - width - 6

  const yPos = props.y - arrowOffset.y

  const popupStyleName =
    props.x < window.innerWidth / 2 ? styles.leftPopup : styles.rightPopup

  const proposed = new Date(props.effectiveDate) > new Date()

  return (
    <section
      display={props.policyName !== '' ? 'block' : 'none'}
      className={popupStyleName}
      style={{
        top: yPos,
        left: xPos,
        width: width,
        opacity: props.policyName !== '' ? 1 : 0,
        pointerEvents: props.policyName !== '' ? 'all' : 'none',
      }}
      onMouseLeave={() => {
        setState({
          ...props,
          policyName: '',
          effectiveDate: '',
        })
      }}
    >
      <div className={styles.greySection}>
        <h1 className={styles.title}>
          {props.policyName}{' '}
          {!proposed && props.policyName !== 'Mixed distancing levels'
            ? 'Policies Implemented'
            : ''}
          {proposed && 'Policies Proposed'}
        </h1>
      </div>
      <div className={styles.content}>
        <p>
          {proposed ? 'Proposal Date: ' : 'Effective Date: '}
          {props.effectiveDate}
        </p>
        {!proposed && <a href="https://covidamp.org/data">view policy</a>}
      </div>
    </section>
  )
}

export default PastInterventionInfo
