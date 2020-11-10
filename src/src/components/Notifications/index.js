import React from 'react'
import BaseComponent from '../../HOC/BaseComponent'
import NotificationList from '../NotificationList'

import './styles.scss'

class Notifications extends BaseComponent {
  constructor(props) {
      super(props)

      this.state = {
        list: [],
      }

      this.registerService({ kind: 'misc' })
  }

  componentDidMount() {
    this.subscribeToSharedState('notifications', notifications => {
      if (!notifications || notifications.notifications.length == 0) {
        this.sharedState.set('popup_window', null);
        // this.setState({ list: [] })  
      } else {
        this.setState({ list: notifications.notifications })
      }
    });
  }

  render() {
    return (
      <NotificationList list={this.state.list} />
    )
  }
}
export default Notifications
