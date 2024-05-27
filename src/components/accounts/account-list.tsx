import { useEffect, useState } from "react";
import { Context as context } from "../../shared/context";
import { useNavigate } from "react-router-dom";
import "./account-list.scss";

export default function AccountList() {
  const auth = context();
  let navigate = useNavigate();

  const accountDetailsPage = (viewId:any, type:string, type1:string) => () => {
    return navigate("/account-details", {
      state:{
          viewId,
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
        <h3>Welcome to Bayanihan Bank</h3>
        <p className="lead my-3">
          Account:
          <span>{auth.state.userName ? " " + auth.state.userName : ""}</span>
        </p>
      </div>
      <div>
        <div className="card border-success mb-3 width100">
          <div className="card-header">Loan Accounts </div>
          <div className="card-body text-success">
            {accountsData.loan.map((data: any) => {
              return (
                <>
                  <table className="table table-hover">
                    <tbody>
                      <tr onClick={accountDetailsPage(data.id,'loan', 'payments')}>
                        <td key={data.loanNumber}></td>
                        <td key={data.principalBalance}>
                          <span>Loan Balance: </span> 
                        </td>
                        <td key={data.productName}></td>
                      </tr>
                    </tbody>
                  </table>
                </>
              );
            })}
            {(!accountsData.loan.length && !accountsData.loanLoading) && 
              <div className="text-center">
                No records
            </div>}
            {accountsData.loanLoading && 
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
            </div>}
          </div>
        </div>

        <div className="card border-success mb-3 width100">
          <div className="card-header">Deposit Accounts </div>
          <div className="card-body text-success">
            {accountsData.deposit.map((data: any) => {
              return (
                <>
                  <table className="table table-hover">
                    <tbody>
                      <tr onClick={accountDetailsPage(data.accountId,'deposit', 'transactions')}>
                        <td>{data.accountNumber}</td>
                        <td>
                          <span>Loan Balance: </span> {data.availableBalance}
                        </td>
                        <td>{data.productName}</td>
                      </tr>
                    </tbody>
                  </table>
                </>
              );
            })}
            {(!accountsData.deposit.length && !accountsData.depositLoading) && 
              <div className="text-center">
                No records
            </div>}
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
