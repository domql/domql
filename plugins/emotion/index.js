'use strict'

// import DOM from '../../src'
import { isObjectLike, isString, isNumber, isBoolean, exec } from '@domql/utils'
import { applyClassListOnNode } from '@domql/classlist'
import createEmotion from '@emotion/css/create-instance'

export const transformEmotionStyle = (emotion) => {
  return (params, element, state) => {
    const execParams = exec(params, element)
    if (params) {
      if (isObjectLike(element.class)) element.class.elementStyle = execParams
      else element.class = { elementStyle: execParams }
    }
    transformEmotionClass(emotion)(element.class, element, element.state, true)
  }
}

export const transformEmotionClass = (emotion) => {
  return (params, element, state, flag) => {
    if (element.style && !flag) return
    const { __ref } = element
    const { __class, __classNames } = __ref

    if (!isObjectLike(params)) return
    if (element.props.class) { __classNames.classProps = element.props.class }
    if (element.attr?.class) { __classNames.class = element.attr.class }

    // for (const key in params) {
    //   const prop = exec(params[key], element)

    //   if (!prop) {
    //     delete __class[key]
    //     continue
    //   }
    // }

    for (const key in __class) {
      const prop = __class[key]
      if (!prop) {
        delete __classNames[key]
        continue
      }
      // console.log(prop, key, element)
      let className
      if (isString(prop) || isNumber(prop)) className = prop
      else if (isBoolean(prop)) className = element.key
      else className = emotion.css(prop)
      // console.log(className)
      __classNames[key] = className
    }

    applyClassListOnNode(__classNames, element, element.node)
  }
}

export const transformDOMQLEmotion = (emotion, options) => {
  if (!emotion) emotion = createEmotion(options || { key: 'smbls' })

  return {
    style: transformEmotionStyle(emotion),
    class: transformEmotionClass(emotion)
  }
}
