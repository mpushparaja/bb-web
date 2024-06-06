import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Context as context } from "../../shared/context";
import './account-details.scss'

const Accounts = () => {
  const auth = context();
  let route =  useLocation(); 
  const navigate = useNavigate();
  const [accountsData, setAccounts] = useState<any>({
    loan: {dataKey: 'loans', data: {}},
    deposit: {dataKey: 'account', data: {}},
  });

  const dateFormatter = (data:any) => {
    const date = new Date(data);
    const month:any = date.toLocaleString('default', {month: 'numeric'});
    const year:any = date.toLocaleString('default', {year: 'numeric'});
    return (month > 9 ? month : ('0' + month)) + '-' + date.getDate() + '-' + year;
  };

  const columns:any = {
    loans: [
      {
        loanNumber: {
          text: 'Loan Number'
        },
      },
      {
        productName: {
          text: 'Loan Poduct Name'
        },
      },
      {principalBalance: {text: 'Loan Balance'}},
      {
        branchName: {
          text: 'Loan Branch Name'
        },
      },
      {
        maturityDate: {
          text: 'Maturity Date',
          formatter: dateFormatter
        },
      },
      {
        grantDate: {
          text: 'Next Payment Due Date',
          formatter: dateFormatter
        },
      },
      {
        status: {
          text: 'Loan Status'
        },
      },
      {
        term: {
          text: 'Tenure'
        }
      }
    ],
    account: [
      {
        accountNumber: {
          text: 'Account Number'
        },
      },
      {
        productName: {
          text: 'Deposit Name'
        },
      },
      {availableBalance: {text: 'Available Balance'}},
      {
        branchName: {
          text: 'Account Branch Name'
        },
      },
      {
        maturityDate: {
          text: 'Maturity Date',
          formatter: dateFormatter
        },
      },
      {
        interestBalance: {
          text: 'Interest Balance'
        },
      },
      {term: {text: 'Tenure'}},
    ],
  };

  const columns1:any = {
    payments: [
      {
        postedDate: {
          text: 'Payment Date',
          formatter: dateFormatter
        },
      },
      {amount: {text: 'Amount'}},
    ],
    transactions: [
      {
        postedDate: {
          text: 'Payment Date',
          formatter: dateFormatter
        },
      },
      {
        transactionType: {
          text: 'Type'
        },
      },
      {amount: {text: 'Amount'}},
    ],
  };
  
  const method = accountsData[route.state.type];
  const details = method['data'] ? method['data'] : {};

  useEffect(() => {
    if (!route.state.viewId) {
      navigate('/account-list')
    }
  }, [route.state.viewId])

  useEffect(() => {
    auth.findAccounts(route.state.type, route.state.viewId).then((data:any) => {
      setAccounts((prevState:any) => {
        if (method.dataKey === 'loans') {
          return {
            ...prevState,
            [route.state.type]: {...method, data: data['loan']},
          };
        } else {
          return {
            ...prevState,
            [route.state.type]: {...method, data: data[method['dataKey']]},
          };
        }
      });
    });
  }, []);

  const [transData, setTrans] = useState<any>({
    loan: {dataKey: 'payments', data: [], search: []},
    deposit: {dataKey: 'transactions', data: [], search: []},
    loading: false,
  });
  const [query, setQuery] = useState<any>('');

  const method2 = transData[route.state.type];
  const details2 = method2['data'] ? method2['data'] : [];
  const search = method2['search'] ? method2['search'] : [];

  useEffect(() => {
    setTrans((prevState:any) => ({
      ...prevState,
      loading: true,
    }));
    auth
      .listTrans(route.state.type, route.state.type1, route.state.viewId)
      .then((data:any) => {
        setTrans((prevState:any) => {
          return {
            ...prevState,
            [route.state.type]: {
              ...method2,
              data: data[route.state.type1],
              search: data[route.state.type1],
            },
            loading: false,
          };
        });
      });
  }, []);

  const handleSearch = (text:any) => {
    const formattedQuery = text.target.value;
    let filteredData = details2.filter((item:any) => {
      return dateFormatter(item.postedDate).includes(formattedQuery);
    });

    if (formattedQuery === '') {
      filteredData = details2;
    }
    setTrans((prevState:any) => {
      return {
        ...prevState,
        [route.state.type]: {...method2, search: filteredData},
        loading: false,
      };
    });
    setQuery(formattedQuery);
  };
 
  return (
    <div className="width100">
      <h1 className="mt-1 mb-4 page-title">Loan details</h1>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb p-3 bg-body-tertiary rounded-3">
          <li className="breadcrumb-item">
            <Link className="link-body-emphasis fw-semibold text-decoration-none" to="/home">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link className="link-body-emphasis fw-semibold text-decoration-none" to="/account-list">Accounts</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {route.state.title}
          </li>
        </ol>
      </nav>
      {Object.keys(details).length ? (
        <div className="col-md-6">
          <ul className="list-group bg-body-tertiary border rounded-3 mb-3">
            {columns[method['dataKey']].map((item:any, index:any) => {
              const keyItem = Object.keys(item)[0];
              return (
                <li key={index} className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">{item[keyItem].text}</h6>
                  </div>
                  <span className="text-body-secondary">{item[keyItem].formatter ? item[keyItem].formatter(details[keyItem]) : details[keyItem]}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (<div className="container">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
      )}
      <div className="col-md-4">
        <div className="bg-body-tertiary border rounded-3 mb-3">
          <div className="input-group">
            <input
              className="form-control"
              autoCapitalize="none"
              value={query}
              onChange={handleSearch}
              placeholder="Search by payment date (mm-dd-yyyy)"
            />
          </div>
        </div>
      </div>
      <table className="table table-striped table-bb">
        <thead className="table-light">
          <tr>
            {columns1[method2['dataKey']].map((item:any, index:any) => {
              console.log("data",item);
              const keyItem = Object.keys(item)[0];
              return (
                <th key={index} scope="col">{item[keyItem].text}</th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {search.map((data: any) => {
            return (
              <tr>
                {columns1[method2['dataKey']].map((item:any, index:any) => {
                const keyItem = Object.keys(item)[0];
                return (
                  <td key={index} scope="row">{item[keyItem].formatter ? item[keyItem].formatter(data[keyItem]) : data[keyItem]}</td>
                )
              })}
              </tr>
            );
          })}
          {transData.loading && 
            <tr>
              <td colSpan={3} className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </td>
            </tr>
          }
          {(!search.length && !transData.loading) &&
            <tr>
              <td className="text-center pt-3 pb-3 border-bottom" colSpan={3}>
                No records
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );
}

export default Accounts;

