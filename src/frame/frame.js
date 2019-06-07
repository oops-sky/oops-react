import React, {Component} from 'react'
import {observer} from 'mobx-react'


@observer
export default class Frame extends Component {
  render() {
    const {
      children,
      uid,
    } = this.props
    
    return (
      <div key={uid}>
        <div>33333333</div>
      </div>
    )
  }
}
