import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {Context as context} from "../../shared/context"
import {encrypt} from "../../shared/config"
import "./login.scss";

export function Login() {
  const auth = context();
  const username = useRef<any>('');
  const password = useRef<any>('');
  let navigate = useNavigate();
  const [login, setLogin] = useState({username: "", password: "", "usernameerror": "", "passworderror": "", error: "", loading: false});

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
        'usernameerror': 'Please fill Username',
      }));
      username.current.focus();
      return;
    }
    if (!login.password) {
      setLogin(prevState => ({
        ...prevState,
        'passworderror': 'Please fill Password',
      }));
      password.current.focus();
      return;
    }

    setLogin(prevState => ({
      ...prevState,
      'loading': true,
      'usernameerror': '',
      'passworderror': '',
      'error': ''
    }));
    auth.saveToken(login).then((data:any) => {
      if (data && data.status === 'mfa') {
        setLogin(prevState => ({
          ...prevState,
          'loading': false,
          'usernameerror': '',
          'passworderror': '',
          'error': ''
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
      [`${name}error`]: '',
      'error': ''
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
    <div className="log-form w-100 m-auto">
      <form onSubmit={onLogin} noValidate>
       <div className="logo">
          <img src="src/assets/logo.png" alt="" />
        </div>
        <h1 className="h3 mb-3 fw-normal">Login to your account</h1>
        <div className=" mb-3">
          <input type="text" ref={username} autoFocus className="form-control" required onChange={handleInput("username")} placeholder="Username" />
          {login.usernameerror && <div className="text-danger mt-2">{login.usernameerror}</div>}
        </div>
        <div className="mb-3">
          <input type="password" ref={password} title="username" className="form-control" required onChange={handleInput("password")} placeholder="Password" />
          {login.passworderror && <div className="text-danger mt-2">{login.passworderror}</div>}
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
