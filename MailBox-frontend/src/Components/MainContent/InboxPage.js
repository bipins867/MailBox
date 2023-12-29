import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./InboxPage.css";
import MailList from "./MailList";
import axios from "axios";
import getTokenHeaders, { baseUrl } from "../../Utils/utils";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import { authAction, dataAction } from "../../store";
import { useGet } from "../../Utils/useFetch";

const InboxPage = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const headers = getTokenHeaders();
  //const [data] = useGet(baseUrl + "mail/getMails", headers);
  
  const emails = useSelector((state) => state.data.inboxMail);
  const getInboxMails = () => {
    axios
      .get(baseUrl + "mail/getMails", { headers })
      .then((result) => {
        const mails = result.data.mails;

        
        dispatch(dataAction.setInboxMail(mails.reverse()));
        dispatch(dataAction.setNoOfUnreadMail(result.data.unread));
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 503) {
            history.push("/login");
            dispatch(authAction.logOut());
            alert("Session timeout");
          } else if (err.response.status === 500) {
            alert("Something went wrong");
          }
          console.log(err.response.data);
        } else {
          console.log(err);
        }
      });
  };

  useEffect(() => {
    setInterval(() => {
      getInboxMails();
    }, 2000);
  }, []);

  return (
    <Container className="mt-4">
      <MailList emails={emails} isInbox={true} />
    </Container>
  );
};

export default InboxPage;
