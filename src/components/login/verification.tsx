import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {Context as context} from "../../shared/context"
import {decrypt} from "../../shared/config"
import "./verification.scss";

export function Verification({checkLogIn} :any) {
  const auth = context();
  let navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(0);
  const inputs = useRef<any>([]);
  let resendOtpTimerInterval:any;

  const confirmToSubmitOtp = () => {
    let total = 0;
    otp.filter((data:any) => data !== '' && total++)
    return total === 6 ? false : true;
  }

  const isEnableConfirmButton = confirmToSubmitOtp();

  useEffect(() => {
    if (!auth.state.pwd) {
      navigate('/')
    }
  }, [auth.state.pwd])

  useEffect(() => {
    startResendOtpTimer();

    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
    };
  }, [resendButtonDisabledTime]);

  const startResendOtpTimer = () => {
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval);
    }
    resendOtpTimerInterval = setInterval(() => {
      if (resendButtonDisabledTime <= 0) {
        clearInterval(resendOtpTimerInterval);
      } else {
        setResendButtonDisabledTime(resendButtonDisabledTime - 1);
      }
    }, 1000);
  };
  
  const handleChange = (index:any) => (e:any) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);
    // Move focus to the next box if the current one has a value
    if (e.target.value && index < newOtp.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handlekeyDown = (index:any) => (event: any) => {
    if (event.code === 'Backspace' && otp[index] === '') {
      if (index >= 1) {
        inputs.current[index - 1].focus();
      }

      if (index > 0) {
        const otpCopy = otp.concat();
        otpCopy[index - 1] = ''; // clear the previous box which will be in focus
        setOtp(otpCopy);
      }
    }
  }
  const refCallback = (index:any) => (input:any) => {
    inputs.current[index] = input;
  };

  const onResend = () => {
    if (inputs.current[0]) {
      setOtp(['', '', '', '', '', '']);
      inputs.current[0].focus();
    }
    if (auth.state.success) {
      auth.setState((prevState:any) => ({
        ...prevState,
        success: '',
      }));
      setResendButtonDisabledTime(30);
    } else {
      callResendOtp();
    }
  };

  const callResendOtp = () => {
    auth.setState((prevState:any) => ({
      ...prevState,
      loading: true,
    }));
    auth
      .saveToken({
        username: auth.state.secure.username,
        password: decrypt(auth.state.pwd),
      })
      .then((data:any) => {
        if (data && data.status === 'mfa') {
          auth.setState((prevState:any) => ({
            ...prevState,
            error: '',
            success: 'A new OTP has been sent to your mobile number',
            loading: false,
            secure: {
              hash: data.hash,
              session: data.session,
              username: auth.state.secure.username,
            },
          }));
        }
      });
  };

  const onConfirm = () => {
    if (isEnableConfirmButton) {
      return false;
    }

    let params = {};
    params = {...auth.state.secure, code: otp.toString().split(',').join('')};
    auth.setState((prevState :any)=> ({
      ...prevState,
      confirmloading: true,
    }));
    auth.saveMFA(params).then((data:any) => {
      if (data.code && data.code === 'Successful') {
        auth.setState((prevState :any) => ({
          ...prevState,
          confirmloading: false,
          secure: '',
          pwd: '',
          userName: data.clientuser.userName,
          sessionId: data.session.accessToken.jwtToken,
          clientId: data.clientuser.clientId,
        }));
        sessionStorage.setItem('logged', "true")
        checkLogIn()
        navigate('/home', { replace: true });
      } else {
        auth.setState((prevState :any) => ({
          ...prevState,
          confirmloading: false,
          secure: '',
          sessionId: '',
          pwd: '',
          error: 'Error in submitting SMS code, Need to relogin'
        }));
        navigate('/');
      }
    });
  };

  useEffect(() => {
      setTimeout(() => {
        if (inputs.current[0]) {
          inputs.current[0].focus();
        }
      }, 60);
  }, []);

  return (
    <>
      <div className="title-container">
        <p className="title-text">Verification</p>
        <p style={{ color: "#a29e9e" }}>We sent your SMS Code on your registered phone number with us.</p>
      </div>
      {auth.state.success && resendButtonDisabledTime <= 0 && (
        <div className="alert-box-center">
          <div className="alert alert-success" role="alert">
            {auth.state.success}
          </div>
        </div>
        )}
      {resendButtonDisabledTime > 0 && (
        <div className="alert-box-center">
          <div className="alert alert-info" role="alert">
              Please wait {resendButtonDisabledTime} second(s) before requesting
              a new One Time Password (OTP).
          </div>
        </div>
      )}
      <div className="container">
        <div id="inputs" className="inputs">
        {otp.map((digit, index) => (
          <input
            className="input"
            type="text"
            value={digit}
            inputMode="numeric"
            maxLength={1}
            key={index}
            onKeyDown={handlekeyDown(index)}
            onChange={handleChange(index)}
            ref={refCallback(index)}
          />))}
        </div>
      </div>
      <div className="btn-container">
        <button
          type="submit"
          style={{ color: "#fff" }}
          className="btn btn-danger"
          onClick={onResend}
          disabled={resendButtonDisabledTime > 0 ? true : (auth.state.loading? true : false)}>
          {auth.state.loading ? <>
            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
            <span role="status">Loading...</span>
          </>: <>Resend</>}
        </button>
        <button
          type="submit"
          style={{ color: "#fff" }}
          className="btn btn-success"
          onClick={onConfirm}
          disabled={isEnableConfirmButton ? true: (auth.state.confirmloading ? true: false)}
        >
          {auth.state.confirmloading ? <>
            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
            <span role="status">Loading...</span>
          </>: <>Confirm</>}
        </button>
      </div>
    </>
  );
}
