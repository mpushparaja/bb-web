import { createContext, useState, useContext } from "react";

const initialState = {
  loading: false,
  token: "",
  error: "",
  success: "",
  secure: "",
  pwd: "",
  clientId: "",
};

const config = {
  API_URL: import.meta.env.VITE_API_URL,
};

const MyContext = createContext<any>(initialState);

export const Provider = ({ children }: any) => {
  const [state, setState] = useState<any>(initialState);

  const saveToken = async (auth: any) => {
    try {
      const response = await fetch(config.API_URL + "auth/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: auth.username,
          password: auth.password,
        }),
      });
      const responseJson = await response.json();
      return responseJson;
    } catch (err) {
      // catches errors both in fetch and response.json
      console.log("api error", err);
    }
  };

  const saveMFA = async (auth: any) => {
    try {
      const response = await fetch(config.API_URL + "auth/password/mfa", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: auth.username,
          code: auth.code,
          hash: auth.hash,
          session: auth.session,
        }),
      });
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  };

  const listAccounts = async (type: any, clientId: any) => {
    try {
      const response = await fetch(config.API_URL + type + "/account/list", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: clientId,
        }),
      });
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  };

  const findClient = async (clientId: string) => {
    try {
      const response = await fetch(
        config.API_URL + "/client/find/detail?id=" + clientId,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  };
  /**
   *
   * @param type Account details
   * @param id
   * @returns
   */
  const findAccounts = async (type: any, id: any) => {
    try {
      const response = await fetch(config.API_URL + type + "/account/find", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Recipient list api
   * @param clientId
   * @returns
   */
  const listRecipient = async (clientId: any) => {
    try {
      const response = await fetch(
        config.API_URL + "client/find/recipients?id=" + clientId,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  };

  const listTrans = async (type1: any, type2: any, clientId: any) => {
    try {
      const response = await fetch(
        config.API_URL + type1 + "/account/" + type2,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: clientId,
          }),
        }
      );
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  };

  const getPesonetBanklist = async () => {
    try {
      const response = await fetch(
        config.API_URL + "/deposit/transaction/pesonet/banklist",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  };

  const addRecipient = async (auth: any, clientid: any) => {
    let data = {
      clientid: clientid.toString(),
      firstname: auth.firstname,
      lastname: auth.lastname,
      accountnumber: auth.accountnumber,
      isintrabank: !auth.transferType,
    };
    if (auth.transferType) {
      data = {
        ...data,
        ...{
          bic: auth.bic,
          bankname: auth.bankname,
        },
      };
    }
    try {
      const response = await fetch(config.API_URL + "recipient/add", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error("error", error);
    }
  };

  /**
   * Money tranfer
   * @param senderaccountid
   * @param recipientid
   * @param amount
   * @param isintrabank
   * @returns
   */
  
  const moneyTransfer = async (senderaccountid: any, recipientid: any, amount: any, isintrabank: any) => {
    try {
      let url = "deposit/transaction/moneytransfer";
      if (isintrabank === 0) {
        url = "deposit/transaction/pesonet/add";
      }
      const response = await fetch(config.API_URL + url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderaccountid: senderaccountid,
          recipientid: recipientid,
          amount: parseFloat(amount),
        }),
      });
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MyContext.Provider
      value={{
        state,
        setState,
        saveToken,
        findClient,
        listAccounts,
        findAccounts,
        listRecipient,
        getPesonetBanklist,
        saveMFA,
        listTrans,
        addRecipient,
        moneyTransfer
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

/**
 *  Context initialisation
 */
export function Context() {
  const context = useContext(MyContext);
  // if (!context) {
  //   throw new Error('useAuth must be used within an AuthProvider');
  // }
  return context;
}
