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
  const [radioValue, setRadiovalue] = useState("Intrabank");
  const transferCheck = (e: any) => {
    setRadiovalue(e.target.value);
  };

  const [state, setAdd] = useState({
    transferType: 0,
    firstname: '',
    lastname: '',
    accountnumber: '',
    confirmaccountnumber: '',
    error: '',
    loading: false,
    banks: [],
    bic: '',
    bankname: '',
    formerror: '',
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
      error: ''
    }));
  };

  const onAdd = (event: any) => {
    event.preventDefault();
    if (!state.firstname) {
      setAdd(prevState => ({
        ...prevState,
        formerror: 'Please enter first name',
        error: ''
      }));
      return;
    }
    if (!state.lastname) {
      setAdd(prevState => ({
        ...prevState,
        formerror: 'Please enter last name',
        error: ''
      }));
      return;
    }
    if (!state.accountnumber) {
      setAdd(prevState => ({
        ...prevState,
        formerror: 'Please enter account number',
        error: ''
      }));
      return;
    }
    if (!state.confirmaccountnumber) {
      setAdd(prevState => ({
        ...prevState,
        formerror: 'Please enter confirm account number',
      }));
      return;
    }
    if (state.accountnumber !== state.confirmaccountnumber) {
      setAdd(prevState => ({
        ...prevState,
        formerror: 'Confirm account number doesn\'t match the account number',
        error: ''
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
        <h3 className="page-title">Create recipient</h3>
        <div className="form-container">
          <form onSubmit={onAdd}>
          <div className="rd">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="radioTranfer"
                id="exampleRadios1"
                value="Intrabank"
                onChange={transferCheck}
                checked={radioValue === "Intrabank"}
              />
              <label className="form-check-label" htmlFor="exampleRadios1">
                Intrabank transfer
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="radioTranfer"
                id="exampleRadios2"
                value="Interbank"
                onChange={transferCheck}
                checked={radioValue === "Interbank"}
              />
              <label className="form-check-label" htmlFor="exampleRadios2">
                Interbank transfer
              </label>
            </div>
          </div>

          <div className="select-input" hidden={radioValue === "Interbank" ? false : true}>
            <select className="form-select" aria-label="Default select example">
            {state.banks.map((data: any) => {
                return (
                  <>
                    <option value='Select account'>{data.bank_name}</option>
                  </>
                );
              })}
              
            </select>
          </div>
          <input
            className="form-control"
            type="text"
            placeholder="First name"
            required
            onChange={handleChange('firstname')}
          ></input>
          {!state.firstname && <div className="invalid-feedback">
            Please provide a first name.
          </div>}
          <input
            className="form-control"
            type="text"
            placeholder="Last name"
            required
            onChange={handleChange('lastname')}
          ></input>
          <input
            className="form-control"
            type="text"
            required
            placeholder="Account number"
            onChange={handleChange('accountnumber')}
          ></input>
          <input
            className="form-control"
            type="text"
            required
            placeholder="confirm account number"
            onChange={handleChange('confirmaccountnumber')}
          ></input>
          <div className="btn">
            <button type="submit" className="btn btn-success">Add </button>
            <button onClick={onCancel} className="btn btn-success">Cancel</button>
          </div>
          </form>
        </div>
      </div>
    </>
  );
}
