import { useEffect, useMemo, useRef, useState } from 'react'
import getValue from 'rc-util/lib/utils/get'
import {
  FormInstance,
  InternalFormInstance,
  NamePath,
  Store,
  WatchOptions,
} from './types'
import { SECRET } from './useform'
import { getNamePath } from './utils'

export function stringify(value: any) {
  try {
    return JSON.stringify(value)
  } catch (err) {
    return Math.random()
  }
}

export function isFormInstance<T>(
  form: T | FormInstance
): form is FormInstance {
  return form && !!(form as InternalFormInstance)._init
}

function useWatch(
  ...args: [
    NamePath | ((values: Store) => any),
    FormInstance | WatchOptions<FormInstance>,
  ]
) {
  const [dependencies, _form = {}] = args
  const options = isFormInstance(_form) ? { form: _form } : _form
  const form = options.form
  const [value, setValue] = useState<any>()

  const valueStr = useMemo(() => stringify(value), [value])
  const valueStrRef = useRef(valueStr)
  valueStrRef.current = valueStr

  const formInstance = form as InternalFormInstance
  const isValidForm = formInstance && formInstance._init

  // @ts-ignore
  const namePath = getNamePath(dependencies)
  const namePathRef = useRef(namePath)
  namePathRef.current = namePath

  useEffect(() => {
    if (!isValidForm) {
      return
    }

    const { getFieldsValue, getInternal } = formInstance
    const { registerWatch } = getInternal(SECRET)

    const getWatchValue = (allValues: any) => {
      const watchValue = allValues
      return typeof dependencies === 'function'
        ? dependencies(watchValue)
        : getValue(watchValue, namePathRef.current)
    }

    const cancelRegister = registerWatch((allValues: any) => {
      const newValue = getWatchValue(allValues)
      const nextValueStr = stringify(newValue)
      // Compare stringify in case it's nest object
      if (valueStrRef.current !== nextValueStr) {
        valueStrRef.current = nextValueStr
        setValue(newValue)
      }
    })

    const initialValue = getWatchValue(getFieldsValue(true))

    if (value !== initialValue) {
      setValue(initialValue)
    }

    return cancelRegister
  }, [isValidForm])

  return value
}

export default useWatch
