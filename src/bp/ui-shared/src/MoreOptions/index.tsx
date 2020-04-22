import { Button, Icon } from '@blueprintjs/core'
import cx from 'classnames'
import React, { FC, Fragment } from 'react'

import style from './style.scss'
import { MoreOptionsProps } from './typings'

const MoreOptions: FC<MoreOptionsProps> = props => {
  const { show, onToggle, items, element } = props

  const handleToggle = e => {
    e.stopPropagation()
    onToggle(!show)
  }

  const onAction = (e, action) => {
    e.stopPropagation()
    action()
  }

  return (
    <Fragment>
      {!element && (
        <button onClick={handleToggle} type="button" className={cx(style.moreBtn, { [style.active]: show })}>
          <span className={style.moreBtnDots}></span>
        </button>
      )}
      {element}
      {show && (
        <ul className={style.moreMenu}>
          {items.map((item, index) => {
            const { action, icon, label, type } = item

            return (
              <li key={index}>
                {action && (
                  <Button
                    icon={icon}
                    minimal
                    className={cx(style.moreMenuItem, { [style.delete]: type === 'delete' })}
                    onClick={e => onAction(e, action)}
                  >
                    {label}
                  </Button>
                )}
                {!action && (
                  <span className={cx(style.moreMenuItem, style.noHover, { [style.delete]: type === 'delete' })}>
                    <Icon icon={icon} iconSize={16} />
                    {label}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      )}
      {show && <div className={style.overlay} onClick={handleToggle}></div>}
    </Fragment>
  )
}

export default MoreOptions
