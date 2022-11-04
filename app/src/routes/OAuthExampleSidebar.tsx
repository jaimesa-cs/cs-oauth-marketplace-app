import { Button } from "@contentstack/venus-components";
import Icon from "../images/sidebarwidget.svg";
import React from "react";
import axios from "axios";
import { useContentstackOAuth } from "../hooks/useContentstackOAuth";

axios.defaults.withCredentials = true;

const OAuthExampleSidebarExtension = () => {
  const { loadUserCode, token, setToken, setCode } = useContentstackOAuth();
  const [apiStatus, setApiStatus] = React.useState<"success" | "fail" | "in-progress" | "none">("none");

  return false ? (
    <>Loading...</>
  ) : (
    <div className="entry-sidebar">
      <div className="entry-sidebar-container">
        <div className="entry-sidebar-icon">
          <img src={Icon} alt="icon" />
        </div>
        <div className="app-component-content">
          <h4>Bulk Publishing </h4>
          {token ? (
            <>
              Token Ready!
              <hr />
              <Button
                onClick={() => {
                  setToken(undefined);
                  setCode(undefined);
                }}
              >
                Reset Token
              </Button>
              <hr />
              <Button
                onClick={() => {
                  setApiStatus("in-progress");
                  axios("http://localhost:8080/api/proxy/v3/locales", {
                    method: "GET",
                  })
                    .then((res) => {
                      console.log(
                        "🚀 ~ file: BulkPublishingSidebar.tsx ~ line 49 ~ BulkPublishingSidebarExtension ~ res",
                        res
                      );
                      setApiStatus("success");
                    })
                    .catch((err) => {
                      console.log(
                        "🚀 ~ file: BulkPublishingSidebar.tsx ~ line 51 ~ BulkPublishingSidebarExtension ~ err",
                        err
                      );
                      setApiStatus("fail");
                    });
                }}
              >
                Test API
              </Button>
              <hr />
              <Button
                onClick={() => {
                  axios(`http://localhost:8080/api/is-active`, {
                    method: "GET",
                  })
                    .then((res) => {
                      console.log(
                        "🚀 ~ file: BulkPublishingSidebar.tsx ~ line 49 ~ BulkPublishingSidebarExtension ~ res.data",
                        res.data
                      );
                    })
                    .catch((err) => {
                      console.log(
                        "🚀 ~ file: BulkPublishingSidebar.tsx ~ line 51 ~ BulkPublishingSidebarExtension ~ err",
                        err
                      );
                    });
                }}
              >
                Is Active?
              </Button>
              <hr />
              <Button
                onClick={() => {
                  axios(`http://localhost:8080/api/tokens`, {
                    method: "GET",
                  })
                    .then((res) => {
                      console.log(
                        "🚀 ~ file: BulkPublishingSidebar.tsx ~ line 49 ~ BulkPublishingSidebarExtension ~ res.data",
                        res.data
                      );
                    })
                    .catch((err) => {
                      console.log(
                        "🚀 ~ file: BulkPublishingSidebar.tsx ~ line 51 ~ BulkPublishingSidebarExtension ~ err",
                        err
                      );
                    });
                }}
              >
                Get Token Data
              </Button>
              {apiStatus !== "none" && (
                <>
                  <hr />
                  <p>API Status: {apiStatus}</p>
                </>
              )}
            </>
          ) : (
            <Button
              onClick={() => {
                setToken(undefined);
                setCode(undefined);
                loadUserCode();
              }}
            >
              Authorize
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthExampleSidebarExtension;
