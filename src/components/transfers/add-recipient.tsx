import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Context as context } from "../../shared/context";
import {Modal} from 'bootstrap'
import Modals from "../../shared/modal";
import "./add-recipient.scss";

export function AddRecipient(this: any) {
  const auth = context();
  const show = useRef<any>();
  let navigate = useNavigate();

  let forms = {
    firstnameerror: '',
    lastnameerror: '',
    accountnumbererror: '',
    confirmaccountnumbererror: '',
    bicerror: ''
  }

  const [state, setAdd] = useState({
    transferType: 0,
    firstname: '',
    lastname: '',
    accountnumber: '',
    confirmaccountnumber: '',
    firstnameerror: '',
    lastnameerror: '',
    accountnumbererror: '',
    confirmaccountnumbererror: '',
    bicerror: '',
    error: '',
    loading: false,
    banks: [],
    bic: '',
    bankname: '',
  });

  useEffect(() => {
      setAdd(prevState => ({
        ...prevState,
        loading: true,
        error: ''
      }));
      auth.getPesonetBanklist().then((data: any) => {
        if (data.status === 'success') {
          setAdd(prevState => ({
            ...prevState,
            banks: data.banks,
            loading: false,
            error: ''
          }));
        }
      });
    // }
  }, []);

  const handleChange = (name:any) => (e:any) => {
    setAdd(prevState => ({
      ...prevState,
      [name]: e.target.value,
      [`${name}error`]: '',
      error: ''
    }));
  };

  const selectChange = (e:any) => {
    const banks:any = state.banks[e.target.value]
    setAdd(prevState => ({
      ...prevState,
      'bic': banks.BICFI,
      'bankname': banks.bank_name,
      'bicerror': '',
      error: ''
    }));
  };

  const setChecked = (e:any) => {
    setAdd(prevState => ({
      ...prevState,
      ...forms,
      'transferType': Number(e.target.value),
      'bic': '',
      'bankname': '',
      error: ''
    }));
  }

  const onAdd = (event: any) => {
    event.preventDefault();
    if(!state.firstname) {
      forms = {...forms, firstnameerror: 'Please provide a first name'}
    }
    if(!state.lastname) {
      forms = {...forms, lastnameerror: 'Please provide a last name'}
    }
    if(!state.accountnumber) {
      forms = {...forms, accountnumbererror: 'Please provide a account number'}
    }
    if(!state.confirmaccountnumber) {
      forms = {...forms, confirmaccountnumbererror: 'Please provide a confirm account number'}
    }
    if(!state.bic && state.transferType === 1) {
      forms = {...forms, bicerror: 'Please select BIC'}
    }

    if(!state.firstname || !state.lastname || !state.accountnumber || !state.confirmaccountnumber) {
      setAdd(prevState => ({
        ...prevState,
        ...forms
      }));
      return;
    }

    if(state.accountnumber && state.accountnumber !== state.confirmaccountnumber) {
      setAdd(prevState => ({
        ...prevState,
        confirmaccountnumbererror: 'Confirm account number doesn\'t match the account number'
      }));
      return;
    }

    const bsModal = new Modal(show.current, {
        backdrop: 'static',
        keyboard: false,
    })
    bsModal.show()
 }

  const onConfirmAdd = () => {
    setAdd(prevState => ({
      ...prevState,
      loading: true,
      error: ''
    }));

    auth.addRecipient(state, auth.state.clientId).then((data:any) => {
      if (data && data.status === 'success') {
        setAdd(prevState => ({
          ...prevState,
          loading: false,
          error: ''
        }));
        navigate('/recipient-list');
      } else {
        setAdd(prevState => ({
          ...prevState,
          loading: false,
          error: data.code,
        }));
      }
    });
  };

  const onCancel = () => {
    navigate('/recipient-list');
  }

  return (
    <>
      <div className="add-container">
        {state.error && (<div className="alert-box-center">
          <div className="alert alert-danger" role="alert">{state.error}</div>
        </div>)}
        <Modals modalId={show} title="Are you sure to add the recipient" onConfirm={onConfirmAdd} />
        <h4 className="mb-3">Create recipient</h4>
        <div>
          <form onSubmit={onAdd} noValidate>
          <div className="d-inline-flex gap-2 mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="bic"
                id="Intrabank"
                value={0}
                onChange={setChecked}
                checked={state.transferType === 0}
              />
              <label className="form-check-label" htmlFor="Intrabank">
                Intrabank transfer
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="bic"
                id="Interbank"
                value={1}
                onChange={setChecked}
                checked={state.transferType === 1}
              />
              <label className="form-check-label" htmlFor="Interbank">
                Interbank transfer
              </label>
            </div>
          </div>

          <div className="col-md-12 mb-3" hidden={state.transferType === 1 ? false : true}>
            <select className="form-select" onChange={selectChange} aria-label="Default select example">
              <option value="">Select BIC</option>
              {state.banks.map((data: any, index: any) => {
                return (
                  <option value={index}>{data.bank_name}</option>
                );
              })}
            </select>
            {state.bicerror && <span className="text-danger">
              {state.bicerror}
            </span>}
          </div>
          <div className="col-md-12 mb-3">
            <input
                className="form-control"
                type="text"
                placeholder="First name"
                required
                onChange={handleChange('firstname')}
            />
            {state.firstnameerror && <span className="text-danger">
              {state.firstnameerror}
            </span>}
          </div>
          <div className="col-md-12 mb-3">
            <input
              className="form-control"
              type="text"
              placeholder="Last name"
              required
              onChange={handleChange('lastname')}
            />
            {state.lastnameerror && <span className="text-danger">
              {state.lastnameerror}
            </span>}
          </div>
          <div className="col-md-12 mb-3">
            <input
              className="form-control"
              type="password"
              required
              placeholder="Account number"
              onChange={handleChange('accountnumber')}
            />
            {state.accountnumbererror && <span className="text-danger">
            {state.accountnumbererror}
            </span>}
          </div>
          <div className="col-md-12 mb-3">
            <input
              className="form-control"
              type="password"
              required
              placeholder="Confirm account number"
              onChange={handleChange('confirmaccountnumber')}
            />
            {state.confirmaccountnumbererror && <span className="text-danger">
            {state.confirmaccountnumbererror}
          </span>}
          </div>
          <div className="d-inline-flex gap-2 mb-5">
            <button type="submit" className="btn btn-primary">Add </button>
            <button onClick={onCancel} className="btn btn-secoundary">Cancel</button>
          </div>
          </form>
        </div>
      </div>
    </>
  );
}
