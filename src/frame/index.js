import {asyncComponent} from '../common/util'
import Frame from './frame'

export default asyncComponent(async () => {
  try {
    const module = await import('./Frame')
    return module.default
  } catch (error) {
    console.log(error)
  }
  return null
})
