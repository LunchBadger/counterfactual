import React, { Component } from 'react';
import styled from 'styled-components'
import {
  getModels,
} from './utils';

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
      error: null,
      output: null,
      password: '',
      passwordConfirm: '',
    }
  }

  async resetPassword() {
    this.clearOutput()

    try {
      const { password, passwordConfirm } = this.state

      if (password !== passwordConfirm) {
        throw Error('passwords do not match')
      }

      const params = new URLSearchParams(window.location.search)
      const token = params.get('access_token')
      const accessToken = getModels().accessToken(token)

      await getModels().user.updatePasswordFromToken(
        accessToken,
        token,
        password,
      )

      this.setState({
        output: {

        },
        password: '',
        passwordConfirm: '',
      })
    } catch(err) {
      this.handleError(err)
    }
  }

  clearOutput() {
    this.setState({
      error: null,
      output: null,
    })
  }

  handleError(err) {
    console.error(err.message)
    this.setState({
      error: err.message
    })
  }

  render() {
    let output = null
    if (this.state.output) {
      output = JSON.stringify(this.state.output, null, 2)
    }

    const { password, passwordConfirm, error } = this.state

    return (
      <UI.Container>
        {error && <UI.Error>
          {error}
        </UI.Error>}
        {output && <UI.Output>
          {output}
        </UI.Output>}
        <UI.Header>
          Reset password
      </UI.Header>
        <UI.Form onSubmit={event => {
          event.preventDefault()
          this.resetPassword()
        }}>
          <UI.Field>
            <UI.Label>New password</UI.Label>
            <UI.Input type="password" value={password} onChange={event => this.setState({password: event.target.value})} />
          </UI.Field>
          <UI.Field>
            <UI.Label>Confirm New password</UI.Label>
            <UI.Input type="password" value={passwordConfirm} onChange={event => this.setState({passwordConfirm: event.target.value})} />
          </UI.Field>
          <UI.Actions>
            <UI.Button type="submit">
              Set password
            </UI.Button>
          </UI.Actions>
        </UI.Form>
      </UI.Container>
    );
  }
}

export default App;
