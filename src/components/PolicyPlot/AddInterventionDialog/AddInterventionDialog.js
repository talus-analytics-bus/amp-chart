import React from 'react'

import styles from './AddInterventionDialog.module.scss'

const PastInterventionInfo = props => {
  const width = 600
  const arrowOffset = { x: 25, y: 41 }

  const xPos =
    props.position.x < window.innerWidth / 2
      ? props.position.x + arrowOffset.x
      : props.position.x - width - 6

  const yPos = props.position.y - arrowOffset.y + window.scrollY

  const popupStyleName =
    props.position.x < window.innerWidth / 2
      ? styles.leftPopup
      : styles.rightPopup

  const [rVal, setRVal] = React.useState(75)
  const [interDate, setInterDate] = React.useState(props.position.date)

  return (
    <section
      display={props.position.show ? 'block' : 'none'}
      className={popupStyleName}
      style={{
        top: yPos,
        left: xPos,
        width: width,
        opacity: props.position.show ? 1 : 0,
        pointerEvents: props.position.show ? 'all' : 'none',
      }}
    >
      <form>
        <div className={styles.greySection}>
          <h1>Add Intervention</h1>
        </div>
        <div className={styles.content}>
          <div className={styles.col}>
            <label>
              Effective Date
              <input
                type="date"
                defaultValue={
                  props.position.date === ''
                    ? null
                    : new Date(props.position.date).toISOString().substr(0, 10)
                }
                selected={interDate}
                onChange={e => {
                  setInterDate(new Date(e.target.value))
                }}
              />
            </label>

            <fieldset>
              <legend>Choose phase</legend>
              <label>
                <input
                  type="radio"
                  name="phase"
                  value="12.5"
                  checked={rVal <= 25}
                  onChange={e => setRVal(e.target.value)}
                />
                Lockdown (phase 1)
              </label>
              <label>
                <input
                  type="radio"
                  name="phase"
                  value="37.5"
                  checked={(rVal > 25) & (rVal <= 50)}
                  onChange={e => setRVal(e.target.value)}
                />
                Stay at home (phase 2)
              </label>
              <label>
                <input
                  type="radio"
                  name="phase"
                  value="62.5"
                  checked={(rVal > 50) & (rVal <= 75)}
                  onChange={e => setRVal(e.target.value)}
                />
                Safer at home (phase 3)
              </label>
              <label>
                <input
                  type="radio"
                  name="phase"
                  value="87.5"
                  checked={rVal > 75}
                  onChange={e => setRVal(e.target.value)}
                />
                New normal (phase 4)
              </label>
            </fieldset>

            <label>
              Name of intervention
              <input type="text" />
            </label>
            <div className={styles.buttonRow}>
              <button
                onClick={e => {
                  e.preventDefault()
                  props.setPosition({ ...props.position, show: false })
                }}
              >
                cancel
              </button>
              <button
                onClick={e => {
                  e.preventDefault()
                }}
              >
                Appy &amp; run
              </button>
            </div>
          </div>
          <div className={styles.col}>
            <label>
              Use slider to adjust impact of policy on relative tranmission
              <input
                type="range"
                className={styles.verticalSlider}
                min="0"
                max="100"
                value={rVal}
                onChange={e => {
                  setRVal(Number(e.target.value))
                }}
              />
            </label>
          </div>
        </div>
      </form>
    </section>
  )
}

export default PastInterventionInfo
