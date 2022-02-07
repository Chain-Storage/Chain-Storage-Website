import React from "react";
import { GetFiles } from "../Components/Profile/GetFiles";
import { SendFiles } from "../Components/Profile/SendFile";

export class Profile extends React.Component {
  render() {
    return (
      <>
        <SendFiles />
        <GetFiles />
      </>
    );
  }
}
