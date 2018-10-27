// @flow

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import T from 'i18n-react';

import Textbox from 'common/components/Textbox';
import Button from 'common/components/Button';
import PasswordForm from 'common/components/PasswordForm';
import Message from 'common/components/Message';

import { validatePasswords } from 'features/Join/actions';

import config from 'config';
import styles from '../../styles.less';

type Props = {
  initialToken?: string,
};

export default class Finish extends Component<Props, *> {
  props: Props;

  state = {
    token: this.props.initialToken || '',
    message: this.props.initialToken ? '' : T.translate('forgotPassword.checkEmail'),
    password: '',
    passwordConfirm: '',
    passwordError: '',
    busy: false,
    valid: false,
    complete: false,
  };

  fieldChanged = ({ target: { id, value } }: SyntheticInputEvent<*>) => {
    const newState = {
      ...this.state,
      [id]: value,
    };

    const action = validatePasswords(newState.password, newState.passwordConfirm);

    newState.passwordError = action.error && action.payload;
    newState.valid = !action.error && !!this.state.token;

    this.setState(newState);
  };

  changePassword = (event: Event) => {
    event.preventDefault();

    const { token, password } = this.state;

    this.setState({
      busy: true,
      passwordError: '',
    });

    return axios
      .put(`${config.api.endpoint}forgot-my-password`, {
        token,
        password,
      })
      .then(
        () => {
          this.setState({
            busy: false,
            complete: true,
          });
        },
        ({ response }) =>
          this.setState({
            busy: false,
            message: response.data,
          })
      );
  };

  render() {
    if (this.state.complete) {
      return (
        <Message>
          <Link to="/login">{T.translate('forgotPassword.success')}</Link>
        </Message>
      );
    }

    return (
      <form onSubmit={this.changePassword}>
        <Message type="error">{this.state.message}</Message>

        <Textbox
          required
          id="token"
          label="Token"
          value={this.state.token}
          onChange={this.fieldChanged}
        />

        <PasswordForm
          error={this.state.passwordError}
          onFieldChange={this.fieldChanged}
          valid={this.state.valid}
          passwordValue={this.state.password}
          passwordConfirmValue={this.state.passwordConfirm}
        />

        <div className={styles.buttons}>
          <Button type="primary" busy={this.state.busy} disabled={!this.state.valid}>
            {T.translate('forgotPassword.changeCta')}
          </Button>
        </div>
      </form>
    );
  }
}
