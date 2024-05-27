import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {Context as context} from "../../shared/context"
import {encrypt} from "../../shared/config"
import "./login.scss";

export function Login() {
  const auth = context();
  let navigate = useNavigate();
  const [login, setLogin] = useState({username: "", password: "", "formerror": "", error: "", loading: false});

  useEffect(() => {
    if(sessionStorage.getItem('logged')) {
      navigate('/home');
    }
  }, [sessionStorage.getItem('logged')])

  const onLogin = (event: any) => {
    event.preventDefault();
    if (!login.username) {
      setLogin(prevState => ({
        ...prevState,
        'formerror': 'Please fill Username',
      }));
      return;
    }
    if (!login.password) {
      setLogin(prevState => ({
        ...prevState,
        'formerror': 'Please fill Password',
      }));
      return;
    }

    setLogin(prevState => ({
      ...prevState,
      'loading': true,
      'formerror': ''
    }));
    auth.saveToken(login).then((data:any) => {
      if (data && data.status === 'mfa') {
        setLogin(prevState => ({
          ...prevState,
          'loading': false,
          'formerror': ''
        }));
        auth.setState((prevState: any) => ({
          ...prevState,
          secure: {
            hash: data.hash,
            session: data.session,
            username: login.username,
          },
          pwd: encrypt(login.password),
        }));
        return navigate("/auth");
      } else {
        setLogin(prevState => ({
          ...prevState,
          'loading': false,
          error: 'Invalid username or password',
        }));
      }
    });
  }

  const handleInput = (name:any) => (e:any) => {
    setLogin(prevState => ({
      ...prevState,
      [name]: e.target.value,
    }));
  };

  return (
    <>
      {login.error && (<div className="alert-box-center">
        <div className="alert alert-danger" role="alert">{login.error}</div>
      </div>)}
      {auth.state.error && (<div className="alert-box-center">
        <div className="alert alert-danger" role="alert">{auth.state.error}</div>
      </div>)}
    <div className="log-form">
      <div className="logo">
        <img src="src/assets/logo.png" alt="" />
      </div>
      <h2>Login to your account</h2>
      <form onSubmit={onLogin}>
        <div className="col-md-12 position-relative">
          <input type="text" className="form-control" required onChange={handleInput("username")} placeholder="Username" />
          <div className="invalid-feedback">
            hi
          </div>
        </div>
        <div className="col-md-12">
          <input type="password" title="username" className="form-control" required onChange={handleInput("password")} placeholder="Password" />
        </div>
        <button type="submit" className={login.loading ? "btn disabled": "btn btn-primary"}>
          {login.loading ? <>
            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
            <span role="status">Loading...</span>
          </>: <>Login</>}
        </button>
      </form>
    </div>
  </>
  );
}
