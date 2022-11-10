import { Button } from "@contentstack/venus-components";
import Icon from "../images/sidebarwidget.svg";
import React from "react";
import useAuth from "../hooks/oauth/useAuth";
import useContenstackAxios from "../hooks/oauth/useContetstackAxios";

const ResetTokenButton = () => {
  const { setAuth } = useAuth();
  return (
    <Button
      onClick={() => {
        setAuth(undefined);
      }}
    >
      Reset Token
    </Button>
  );
};

const OAuthExampleSidebarExtension = () => {
  const { auth } = useAuth();
  const [apiStatus, setApiStatus] = React.useState<"success" | "fail" | "in-progress" | "none">("none");
  const [languages, setLanguages] = React.useState<any[]>([]);
  const axios = useContenstackAxios();
  return (
    <>
      <ResetTokenButton />
      <hr />
      <Button
        isLoading={apiStatus === "in-progress"}
        onClick={() => {
          setApiStatus("in-progress");
          axios("/v3/locales", {
            method: "GET",
          })
            .then((res) => {
              setLanguages(res.data.locales);
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
          console.log("🚀 ~ file: OAuthExampleSidebar.tsx ~ line 69 ~ .then ~ res", auth);
        }}
      >
        Log Data
      </Button>

      {apiStatus !== "none" && (
        <>
          {languages && languages.length > 0 && (
            <div className="languages-container">
              <h6>Languages</h6>
              <hr />
              {languages.map((language) => {
                return (
                  <div className="language-box" key={language.code}>
                    {language.name} [{language.code}]<hr />
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default OAuthExampleSidebarExtension;
