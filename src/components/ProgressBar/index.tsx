import React, { useEffect, useState } from 'react'
import style from './progress-bar.module.css'

const ProgressBar = ({ width, percent }) => {
  const [value, setValue] = useState(0)
  const [pillColor, setPillColor] = useState('#e9e9e9')
  const [bgOpacity, setBgOpacity] = useState(1)

  useEffect(() => {
    if (percent <= 0) {
      setBgOpacity(0.1)
    }
    if (percent > 0 && percent <= 0.2) {
      setPillColor('#f70305')
    } else if (percent > 0.2 && percent <= 0.5) {
      setPillColor('linear-gradient(90deg, #f70305 0%,  #fec400 100%)')
    } else if (percent > 0.5) {
      setPillColor('linear-gradient(90deg, rgba(247,3,5,1) 0%, rgba(254,196,0,1) 50%, rgba(66,219,67,1) 80%)')
    }
  }, [])

  useEffect(() => {
    setValue(percent * width)
  })
  return (
    <div>
      <div className={style.progressDiv} style={{ width: `${width}%`, opacity: bgOpacity }}>
        <div
          className={style.progress}
          style={{
            width: `${percent * 100}%`,
            background: pillColor,
          }}
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar
