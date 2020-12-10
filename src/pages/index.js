import React from "react";
import AuthSection from "./../components/AuthSection";

function IndexPage(props) {
  return (
    <AuthSection
      bg="white"
      textColor="dark"
      size="md"
      bgImage=""
      bgImageOpacity={1}
      type="signup"
      providers={["google", "facebook", "twitter"]}
      afterAuthPath="/dashboard"
    />
  );
}

export default IndexPage;
