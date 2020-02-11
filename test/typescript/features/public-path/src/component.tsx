import React from 'react';

export default class Component extends React.Component {
  state = {
    text: ''
  }

  componentDidMount() {
    import('./text').then(({ text }) => this.setState({ text }))
  }

  render() {
    return (
      <div id="component">{this.state.text}</div>
    )
  }
}
