import { useEffect, useState } from "react";
import { Context as context } from "../../shared/context";
import { useNavigate } from "react-router-dom";
import "./account-list.scss";

export default function AccountList() {
  const auth = context();
  let navigate = useNavigate();

  const accountDetailsPage = (viewId:any, title:any, type:string, type1:string) => () => {
    return navigate("/account-details", {
      state:{
          viewId,
          title,
          type,
          type1
        },
    });
  };

  const [accountsData, setAccounts] = useState({
    loan: [],
    deposit: [],
    loanLoading: false,
    depositLoading: false,
    clientDetails: "",
  });

  useEffect(() => {
    auth
      .findClient(auth.state.clientId)
      .then((data: { status: string; client: any }) => {
        if (data.status === "success") {
          setAccounts((prevState) => ({
            ...prevState,
            clientDetails: data.client,
          }));
        }
      });
  }, []);

  useEffect(() => {
    setAccounts((prevState) => ({
      ...prevState,
      loanLoading: true,
    }));

    auth.listAccounts("loan", auth.state.clientId).then((data: any) => {
      if (data?.loans?.length) {
        setAccounts((prevState) => ({
          ...prevState,
          loan: data.loans,
          loanLoading: false,
        }));
      } else {
        setAccounts((prevState) => ({
          ...prevState,
          loanLoading: false,
        }));
      }
    });
  }, []);

  useEffect(() => {
    setAccounts((prevState) => ({
      ...prevState,
      depositLoading: true,
    }));

    auth.listAccounts("deposit", auth.state.clientId).then((data: any) => {
      if (data?.accounts?.length) {
        setAccounts((prevState) => ({
          ...prevState,
          deposit: data.accounts,
          depositLoading: false,
        }));
      } else {
        setAccounts((prevState) => ({
          ...prevState,
          depositLoading: false,
        }));
      }
    });
  }, []);

  return (
    <div className="width100">
      <div className="p-2 p-md-3 mb-2 rounded text-body-emphasis bg-body-secondary">
        <h3 className="title-name">Welcome to Bayanihan Bank</h3>
        <p className="lead my-3">
          <span className="subtitle">Account:</span>
          <span>{auth.state.userName ? " " + auth.state.userName : ""}</span>
        </p>
      </div>
      <div>
        <div className="card border-success mb-3 w-100">
          <div className="card-header">Loan Accounts </div>
          <div className="card-body text-success">
            <table className="table table-hover table-sm">
              <tbody>
                {accountsData.loan.map((data: any, index: any) => {
                  return (
                    <tr onClick={accountDetailsPage(data.id, 'Loan Accounts', 'loan', 'payments')}>
                      <td className="cursor" align="left" key={`${index}_loannumber`}>{data.loanNumber}</td>
                      <td className="cursor" align="left" key={`${index}_principlebalance`}>
                        <span>Available Balance: {data.principalBalance}</span> 
                      </td>
                      <td className="cursor" align="left" key={`${index}_loanproductname`}>{data.productName}</td>
                    </tr>
                );
               })}
              {(!accountsData.loan.length && !accountsData.loanLoading) && 
                <tr>
                  <td rowSpan={3} className="text-center">No records</td>
                </tr>
              }
              </tbody>
            </table>
            {accountsData.loanLoading && 
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
            </div>}
          </div>
        </div>

        <div className="card border-success mb-3 w-100">
          <div className="card-header">Deposit Accounts </div>
          <div className="card-body text-success">
            <table className="table table-hover table-sm">
              <tbody>
                {accountsData.deposit.map((data: any, index: any) => {
                  return (
                    <tr onClick={accountDetailsPage(data.accountId, 'Deposit Accounts', 'deposit', 'transactions')}>
                      <td className="cursor" align="left" key={`${index}_accountnumber`}>{data.accountNumber}</td>
                      <td className="cursor" align="left" key={`${index}_availablebalance`}>
                        <span>Available Balance: </span> {data.availableBalance}
                      </td>
                      <td className="cursor" align="left" key={`${index}_depositproductname`}>{data.productName}</td>
                    </tr>
                  );
                })}
                {(!accountsData.deposit.length && !accountsData.depositLoading) && 
                  <tr>
                    <td rowSpan={3} className="text-center">No records</td>
                  </tr>
                }
              </tbody>
            </table>
            {accountsData.depositLoading && 
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
}
