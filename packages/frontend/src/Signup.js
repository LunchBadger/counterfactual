import React, { Component } from 'react';
import styled from 'styled-components'
import { connect } from 'react-redux'
import { signup } from './actions'

const UI = {
  Header: styled.div`
    font-size: 1.1em;
    margin-bottom: 2em;
    font-weight: bold;
  `,
  Container: styled.div`
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
  `,
  Form: styled.form`
    display: block;
  `,
  Field: styled.div`
    display: block;
    margin-bottom: 1em;
  `,
  Input: styled.input`
    display: block;
    width: 100%;
    padding: 0.2em;
    font-size: 1em;
  `,
  Label: styled.div`
    display: block;
    margin-bottom: 0.5em;
    font-size: 0.8em;
    font-weight: bold;
    margin-bottom: 0.2em;
  `,
  Output: styled.output`
    font-size: 1em;
    display: block;
    margin: 0 auto;
    background: #f9f8f6;
    padding: 1em;
    margin-bottom: 1em;
    white-space: pre;
    overflow: auto;
  `,
  Error: styled.div`
    width: 100%;
    color: red;
    text-align: center;
    padding: 1em;
  `,
  Actions: styled.div`
    text-align: center;
  `,
  Button: styled.button`
    cursor: pointer;
  `
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      email: 'alice@example.com',
      password: 'helloworld123'
    }
  }

  async signup() {
    const { email, password } = this.state
    await this.props.signup(email, password)
    if (this.props.loggedIn) {
      this.props.history.push('/status')
    }

  }

  render() {
    const { email, password } = this.state

    return (
      <UI.Container>
        <UI.Header>
          Sign up
        </UI.Header>
        <UI.Form onSubmit={event => {
          event.preventDefault()
          this.signup()
        }}>
          <UI.Field>
            <UI.Label>Email</UI.Label>
            <UI.Input value={email} onChange={event => this.setState({email: event.target.value})} />
          </UI.Field>
          <UI.Field>
            <UI.Label>Password</UI.Label>
            <UI.Input type="password" value={password} onChange={event => this.setState({password: event.target.value})} />
          </UI.Field>
          <UI.Actions>
            <UI.Button type="submit">
              Sign up
            </UI.Button>
          </UI.Actions>
        </UI.Form>
      </UI.Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    loggedIn: state.loggedIn
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    signup: (email, password) => dispatch(signup(email, password)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App)
