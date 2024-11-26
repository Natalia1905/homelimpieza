import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withRouter, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Alert, Button, FormGroup, Label, InputGroup, InputGroupAddon, Input, InputGroupText } from 'reactstrap';
import Widget from '../../components/Widget';

class Login extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  static isAuthenticated(token) {
    return !!token; // Devuelve true si el token existe.
  }

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errorMessage: '',
      isLoading: false,
    };

    this.doLogin = this.doLogin.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  changeEmail(event) {
    this.setState({ email: event.target.value });
  }

  changePassword(event) {
    this.setState({ password: event.target.value });
  }

  async doLogin(e) {
    e.preventDefault();
    const { email, password } = this.state;
    this.setState({ isLoading: true, errorMessage: '' });

    try {
      // Hacer solicitud a la API de usuarios
      const response = await axios.get('https://apilimpieza.onrender.com/usuarios');
      const usuarios = response.data;

      // Verificar usuario y contraseña
      const usuario = usuarios.find((user) => user.email === email && user.contraseña === password);


      if (usuario) {
        // Guardar sesión (puede ser un token u objeto de usuario)
        localStorage.setItem('authenticated', JSON.stringify(usuario));
        this.props.history.push('/app'); // Redirigir a la página principal
      } else {
        this.setState({ errorMessage: 'Credenciales incorrectas. Verifica tu email y contraseña.' });
      }
    } catch (error) {
      console.error('Error al autenticar:', error);
      this.setState({ errorMessage: 'Error al conectar con el servidor. Inténtalo más tarde.' });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  signUp() {
    this.props.history.push('/register');
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/app' } }; // Página de redirección
    const { email, password, errorMessage, isLoading } = this.state;

    if (Login.isAuthenticated(JSON.parse(localStorage.getItem('authenticated')))) {
      return <Redirect to={from} />;
    }

    return (
      <div className="auth-page">
        <Container>
          <Widget className="widget-auth mx-auto" title={<h3 className="mt-0">INICIAR SESIÓN</h3>}>
            <p className="widget-auth-info">Usa tu email para iniciar sesión</p>
            <form onSubmit={this.doLogin}>
              {errorMessage && (
                <Alert className="alert-sm widget-middle-overflow rounded-0" color="danger">
                  {errorMessage}
                </Alert>
              )}
              <FormGroup className="mt">
                <Label for="email">Email</Label>
                <InputGroup className="input-group-no-border">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="la la-user text-white" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="email"
                    className="input-transparent pl-3"
                    value={email}
                    onChange={this.changeEmail}
                    type="email"
                    required
                    name="email"
                    placeholder="Email"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <InputGroup className="input-group-no-border">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="la la-lock text-white" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="password"
                    className="input-transparent pl-3"
                    value={password}
                    onChange={this.changePassword}
                    type="password"
                    required
                    name="password"
                    placeholder="Password"
                  />
                </InputGroup>
              </FormGroup>
              <div className="bg-widget auth-widget-footer">
                <Button type="submit" color="danger" className="auth-btn" size="sm" style={{ color: '#fff' }} disabled={isLoading}>
                  <span className="auth-btn-circle" style={{ marginRight: 8 }}>
                    <i className="la la-caret-right" />
                  </span>
                  {isLoading ? 'Cargando...' : 'Iniciar'}
                </Button>
                <p className="widget-auth-info mt-4">¿No tienes usuario? Regístrate!</p>
                <Link className="d-block text-center mb-4" to="register">
                  Crea un usuario
                </Link>
              </div>
            </form>
          </Widget>
        </Container>
        <footer className="auth-footer">{new Date().getFullYear()} &copy; Derechos reservados.</footer>
      </div>
    );
  }
}

export default withRouter(connect()(Login)); 