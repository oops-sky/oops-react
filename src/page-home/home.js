
import React, {Component} from 'react'
import {observer} from 'mobx-react'
import HomeStore from './store-home'
import './home.styl'

@observer
class Home extends Component {
  constructor(props) {
    super(props)
    this.store = new HomeStore()
  }



  render() {
    const {store} = this
    return (
      <div className="page-home FBH FBAC FBJC">
        {store.content}
      </div>
    )
  }
}
export default Home
