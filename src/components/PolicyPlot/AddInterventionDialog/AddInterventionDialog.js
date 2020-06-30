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
              <input type="date" />
            </label>

            <fieldset>
              <legend>Choose phase</legend>
              <label>
                <input
                  type="radio"
                  name="phase"
                  value="phase1"
                  // checked={true}
                />
                Lockdown (phase 1)
              </label>
              <label>
                <input
                  type="radio"
                  name="phase"
                  value="phase2"
                  // checked={true}
                />
                Stay at home (phase 2)
              </label>
              <label>
                <input
                  type="radio"
                  name="phase"
                  value="phase3"
                  // checked={true}
                />
                Safer at home (phase 3)
              </label>
              <label>
                <input
                  type="radio"
                  name="phase"
                  value="phase4"
                  // checked={true}
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
              <button>Appy &amp; run</button>
            </div>
          </div>
          <div className={styles.col}>
            <label>
              Use slider to adjust impact of policy on relative tranmission
              <input type="range" className={styles.verticalSlider} />
            </label>
          </div>
        </div>
      </form>
    </section>
  )
}

export default PastInterventionInfo
