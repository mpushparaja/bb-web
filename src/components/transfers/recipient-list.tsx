import { useEffect, useState } from "react";
import { Context as context } from "../../shared/context";
import "./recipient-list.scss";
import { useNavigate } from "react-router";

export function RecipientList() {
  const auth = context();
  const [receipient, setRecipient] = useState({
    loading: false,
    receipientDetails: [],
  });
  let navigate = useNavigate();
  const addRecipientPage = () => {
    return navigate("/add-recipient");
  };

  const recipientDetailsPage = (data:any) => () => {
    return navigate("/recipient-details",{
        state:data,
      });
  };

  useEffect(() => {
    setRecipient((prevState) => ({
      ...prevState,
      loading: true,
    }));
    auth.listRecipient(auth.state.clientId).then((data: any) => {
      if (data.recipients.length) {
        setRecipient((prevState) => ({
          ...prevState,
          receipientDetails: data.recipients,
          loading: false,
        }));
      } else {
        setRecipient((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    });
  }, []);

  return (
    <>
      <p className="mt-5"><button className="btn btn-primary" onClick={addRecipientPage}>Add Recipeint</button></p>
      <div className="row g-0 border rounded shadow-sm">
        <div className="list-container pt-2 pb-1">
          <h5>Recipient list</h5>
        </div>
        <div >
          <table className="table">
            <tbody>
              {receipient.receipientDetails.map((data: any, index:any) => {
                return (
                  <tr>
                    <td key={`${index}_name`} className="name">
                      {data.firstName} {data.lastName} <br />
                      {data.accountNumber}
                    </td>
                    <td key={`${index}_button`}><button className="btn btn-primary" onClick={recipientDetailsPage(data)}>Transfer</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
