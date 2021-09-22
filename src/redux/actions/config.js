/*
 * action types
 */

export const CONFIG = 'CONFIG'
/*
 * action creators
 */

export function getConfig(value) {
  return { type: CONFIG, value }
}