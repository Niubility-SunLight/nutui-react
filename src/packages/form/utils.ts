import { InternalNamePath, NamePath } from './types'

export function getNamePath(path: NamePath | null): InternalNamePath {
  if (path === undefined || path === null) {
    return []
  }

  return Array.isArray(path) ? path : [path]
}
