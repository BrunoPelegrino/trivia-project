/* eslint-disable react/jsx-max-depth */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './style/login.css';
import logo from '../trivia.png';
import { saveUserAction } from '../redux/action';

class Login extends React.Component {
  state = {
    userName: '',
    email: '',
  }

  onHandleChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value,
    });
  }

  isButtonDisabled = () => {
    const { userName, email } = this.state;
    if (userName.length > 0 && email.length > 0) {
      return false;
    } return true;
  }

  onHandleClick = async () => {
    const { saveUser, history } = this.props;
    const response = await fetch('https://opentdb.com/api_token.php?command=request');
    const data = await response.json();
    localStorage.setItem('token', data.token);
    saveUser(this.state);
    history.push('/game');
  }

  render() {
    const { userName, email } = this.state;
    const { onHandleChange, isButtonDisabled, onHandleClick } = this;
    const { history } = this.props;
    return (
      <div>
        <div className="d-flex justify-content-center ">
          <img src={ logo } className="App-logo" alt="logo" />
        </div>
        <section className="d-flex justify-content-center">
          <Form className="position-absolute top-50 start-50 translate-middle">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>
                Name
                <Form.Control
                  id="name"
                  placeholder="name"
                  name="userName"
                  type="text"
                  value={ userName }
                  onChange={ onHandleChange }
                  data-testid="input-player-name"
                />
              </Form.Label>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>
                Email
                <Form.Control
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email"
                  value={ email }
                  onChange={ onHandleChange }
                  data-testid="input-gravatar-email"
                />
              </Form.Label>
            </Form.Group>
            <div className="button">
              <Button
                variant="outline-success"
                type="button"
                disabled={ isButtonDisabled() }
                data-testid="btn-play"
                onClick={ onHandleClick }
              >
                Play
              </Button>
              <Button
                variant="outline-dark"
                data-testid="btn-settings"
                type="button"
                onClick={ () => history.push('/settings') }
              >
                Configurações
              </Button>
            </div>
          </Form>
        </section>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  saveUser: (state) => dispatch(saveUserAction(state)),
});

Login.propTypes = {
  saveUser: PropTypes.func,
}.isRequired;

export default connect(null, mapDispatchToProps)(Login);
