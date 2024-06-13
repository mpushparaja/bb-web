import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {Context as context} from "./shared/context"
import Footer from "./components/footer";
import { Login } from "./components/login/login";
import { NavBar } from "./components/navBar";
import NotFound from "./components/not-found";
import { Verification } from "./components/login/verification";
import Home from "./components/home/home";
import AccountList from "./components/accounts/account-list";
import AccountDetails from "./components/accounts/account-details";
import { RecipientList } from "./components/transfers/recipient-list";
import { AddRecipient } from "./components/transfers/add-recipient";
import { RecipientDetails } from "./components/transfers/recipient-details";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min";
import "./App.css";

function App() {
  const auth = context();
  const [isLogin, loggedIn] = useState(0);
  const uuid = auth.state.uuid && sessionStorage.getItem(auth.state.uuid)

  useEffect(() => {
    if (!isLogin) {
      sessionStorage.clear();
    }
  }, [isLogin]);

  const PrivateRoute = ({ children }: any) => {
    return isLogin && uuid ? (
      children
    ) : (
      <Navigate to="/" replace />
    );
  };

  const onVerifyLogin = () => {
    loggedIn(1);
  };

  return (
    <div className="container py-3">
        {isLogin && uuid ? <NavBar /> : ""}
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route
            path="/auth"
            element={<Verification checkLogIn={onVerifyLogin} />}
          ></Route>
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/account-list"
            element={
              <PrivateRoute>
                <AccountList />
              </PrivateRoute>
            }
          />
          <Route
            path="/account-details"
            element={
              <PrivateRoute>
                <AccountDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/recipient-list"
            element={
              <PrivateRoute>
                <RecipientList />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-recipient"
            element={
              <PrivateRoute>
                <AddRecipient />
              </PrivateRoute>
            }
          />
          <Route
            path="/recipient-details"
            element={
              <PrivateRoute>
                <RecipientDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/404"
            element={
              <PrivateRoute>
                <NotFound />
              </PrivateRoute>
            }>
          </Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      <Footer />
    </div>
  );
}

export default App;
