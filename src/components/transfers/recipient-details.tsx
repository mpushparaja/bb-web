import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Context as context } from "../../shared/context";
import "./recipient-details.scss";
import {Modal} from 'bootstrap'
import Modals from "../../shared/modal";

export function RecipientDetails() {
  let route = useLocation();
  let navigate = useNavigate();
  const showModal = useRef<any>();
  const auth = context();
  const [show, SetShow] = useState(false);
  const [selected, setSelected] = useState({accountId: 0, availableBalance: 0});

  const setEnable = () => {
    SetShow(true);
  };

  const onCancel = () => {
    navigate('/recipient-list');
  }

  const [state, setState] = useState({
    amount: '',
    error: '',
    loading: false,
    accounts: []
  });

  const selectedInput = ((e:any) => {
    const selected:any = state.accounts[e.target.value];
    setSelected(prevState => ({
      ...prevState,
      accountId: selected.accountId,
      availableBalance: selected.availableBalance
    }));
  })

  const onTransferAmount = () => {
    setState(prevState => ({
      ...prevState,
      loading: true,
    }));
    auth.moneyTransfer(selected.accountId, route.state.id, state.amount, route.state.is_intrabank).then((data:any) => {
      if (data && data.status === 'success') {
        navigate('/recipient-list');
      } else {
        setState(prevState => ({
          ...prevState,
          error: data.code,
          loading: false,
        }));
      }
    })
  };

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    auth.listAccounts("deposit", auth.state.clientId).then((data:any) => {
      if (data.status === "success") {
        setState((prevState) => ({
          ...prevState,
          accounts: data.accounts,
          loading: false,
        }));
      }
    });
  }, []);

  const handleChange = (e:any) => {
    setState(prevState => ({
      ...prevState,
      amount: e.target.value,
    }));
  };

  const onTransferRequest = (event:any) => {
    event.preventDefault();
    const bsModal = new Modal(showModal.current, {
      backdrop: 'static',
      keyboard: false,
    })
    bsModal.show()
  }

  return (
    <>
      {state.error && (<div className="alert-box-center">
        <div className="alert alert-danger" role="alert">{state.error}</div>
      </div>)}
      <h3 className="page-title">Recipient Details</h3>
      <Modals modalId={showModal} title="Are you sure to transfer the amount" onConfirm={onTransferAmount} />
      <div className="container">
        <div className="details">
          <p className="name">{route.state.firstName} {route.state.lastName}</p>
          <p className="number">{route.state.accountNumber}</p>
          <p className="bank">{route.state.name}</p>
          <button className="btn btn-primary" onClick={setEnable}>
            Pay
          </button>
        </div>
        <div className="form-container" hidden={show ? false : true}>
          <form onSubmit={onTransferRequest}>
            <h4>Payee Details</h4>
            <p>
              <label>
                Name : <span> {route.state.firstName} {route.state.lastName} </span>
              </label>
            </p>
            {route.state.name && <p>
              <label>
                Branch Name : <span> {route.state.name} </span>
              </label>
            </p>}
            <p>
              <label>
                Account Number :
              </label>
            </p>
            <p>
            <select className="form-select" onChange={selectedInput} aria-label="Default select example" >
              <option value="">Select Account</option>
              {state.accounts.map((data: any, index:any) => {
                return (
                  <option key={index} value={index}>{data.accountNumber}</option>
                );
                })} 
              </select>
            </p>
            <p>
              <label>
                Available Balance : <span>{selected.availableBalance}</span>
              </label>
            </p>
            <p>
              <label>
                Amount : <span><input type="text" onChange={handleChange} placeholder="XXXX"/></span>
              </label>
            </p>
            <div className="action">
              <button type="submit" className="btn btn-primary">
                Send
              </button>
              <button className="btn btn-secondary"onClick={onCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
