import { Button, InstructionText } from "@contentstack/venus-components";

import Icon from "../images/sidebarwidget.svg";
import React from "react";
import axios from "axios";
import { useContentstackOAuth } from "../hooks/useContentstackOAuth";

axios.defaults.withCredentials = true;

const ResetTokenButton = () => {
  const { clearTokens } = useContentstackOAuth();
  return (
    <Button
      onClick={() => {
        clearTokens();
      }}
    >
      Reset Token
    </Button>
  );
};

const OAuthExampleSidebarExtension = () => {
  const { loadUserCode, tokenIsAvailable, tokenIsActive, clearTokens } = useContentstackOAuth();
  const [apiStatus, setApiStatus] = React.useState<"success" | "fail" | "in-progress" | "none">("none");
  const [languages, setLanguages] = React.useState<any[]>([]);
  return false ? (
    <>Loading...</>
  ) : (
    <div className="entry-sidebar">
      <div className="entry-sidebar-container">
        <div className="entry-sidebar-icon">
          <img src={Icon} alt="icon" />
        </div>
        <div className="app-component-content">
          <h4>OAuth Example</h4>
          {tokenIsAvailable && tokenIsActive && <h6>Token Ready</h6>}
          {tokenIsAvailable && !tokenIsActive && <h6>Token Expired</h6>}
          {!tokenIsAvailable && <h6>Authorization Required</h6>}
          <hr />
          {tokenIsAvailable ? (
            <>
              <ResetTokenButton />
              <hr />
              <Button
                isLoading={apiStatus === "in-progress"}
                onClick={() => {
                  setApiStatus("in-progress");
                  axios("http://localhost:8080/api/proxy/v3/locales", {
                    method: "GET",
                  })
                    .then((res) => {
                      setLanguages(res.data.locales);
                      console.log(
                        "🚀 ~ file: OAuthExampleSidebar.tsx ~ line 54 ~ .then ~ res.data.locales",
                        res.data.locales
                      );

                      setApiStatus("success");
                    })
                    .catch((err) => {
                      setApiStatus("fail");
                    });
                }}
              >
                Get Languages
              </Button>
              <hr />
              <Button
                onClick={() => {
                  axios(`http://localhost:8080/api/is-active`, {
                    method: "GET",
                  })
                    .then((res) => {
                      console.log("🚀 ~ file: OAuthExampleSidebar.tsx ~ line 69 ~ .then ~ res", res);
                    })
                    .catch((err) => {
                      console.log(
                        "🚀 ~ file: OAuthExampleSidebar.tsx ~ line 72 ~ OAuthExampleSidebarExtension ~ err",
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
                      console.log("🚀 ~ file: OAuthExampleSidebar.tsx ~ line 89 ~ .then ~ res", res);
                    })

                    .catch((err) => {
                      console.log(
                        "🚀 ~ file: OAuthExampleSidebar.tsx ~ line 96 ~ OAuthExampleSidebarExtension ~ err",
                        err
                      );
                    });
                }}
              >
                Get Token Data
              </Button>
              {apiStatus !== "none" && (
                <>
                  {languages && languages.length > 0 && (
                    <div className="languages-container">
                      <h6>Languages</h6>
                      <hr />
                      {languages.map((language) => {
                        return (
                          <div className="language-box">
                            {language.name} [{language.code}]<hr />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {(!tokenIsAvailable || !tokenIsActive) && (
                <Button
                  onClick={() => {
                    clearTokens();
                    loadUserCode();
                  }}
                >
                  Authorize
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthExampleSidebarExtension;
