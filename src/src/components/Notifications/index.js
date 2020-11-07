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
      if (!notifications) {
        this.setState({ list: [] })  
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
