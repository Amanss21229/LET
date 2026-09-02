"use client";

import {

  useEffect,

  useState,

} from "react";


type Conversation = {

  id:
    string;

  batch:
    {

      title:
        string;

    };

  user:
    {

      name:
        string | null;

      email:
        string;

    };

};


type Message = {

  id:
    string;

  text:
    string | null;

  senderId:
    string;

  createdAt:
    string;

};


export default function AdminChatPanel() {


  const [

    conversations,

    setConversations,

  ] =
    useState<Conversation[]>([]);


  const [

    selected,

    setSelected,

  ] =
    useState<Conversation | null>(
      null
    );


  const [

    messages,

    setMessages,

  ] =
    useState<Message[]>([]);


  const [

    reply,

    setReply,

  ] =
    useState("");


  /* =====================
     LOAD CONVERSATIONS
  ===================== */

  const loadConversations =
    async () => {

      const response =
        await fetch(
          "/api/conversations"
        );


      if (!response.ok) {

        return;

      }


      const data =
        await response.json();


      setConversations(
        data
      );

    };


  /* =====================
     LOAD MESSAGES
  ===================== */

  const loadMessages =
    async (
      id: string
    ) => {

      const response =
        await fetch(

          `/api/conversations/${id}/messages`

        );


      if (!response.ok) {

        return;

      }


      const data =
        await response.json();


      setMessages(
        data
      );

    };


  useEffect(() => {

    loadConversations();

  }, []);


  const selectConversation =
    async (
      conversation:
        Conversation
    ) => {

      setSelected(
        conversation
      );


      await loadMessages(
        conversation.id
      );

    };


  /* =====================
     SEND ADMIN REPLY
  ===================== */

  const sendReply =
    async () => {

      if (

        !selected ||

        !reply.trim()

      ) {

        return;

      }


      const response =
        await fetch(

          `/api/conversations/${selected.id}/messages`,

          {

            method:
              "POST",

            headers: {

              "Content-Type":
                "application/json",

            },


            body:
              JSON.stringify({

                text:
                  reply,

              }),

          }

        );


      if (!response.ok) {

        alert(
          "Unable to send reply"
        );

        return;

      }


      setReply("");


      await loadMessages(
        selected.id
      );


      await loadConversations();

    };


  return (

    <div
      className="admin-chat"
    >


      {/* LEFT */}

      <div
        className="admin-chat-list"
      >

        <h3>

          Student Doubts

        </h3>


        {conversations.length ===
          0 && (

          <p className="muted">

            No doubts yet.

          </p>

        )}


        {conversations.map(

          (
            conversation
          ) => (

            <button

              key={
                conversation.id
              }

              className="chat-user"

              onClick={() =>

                selectConversation(
                  conversation
                )

              }

            >

              <b>

                {conversation.user.name ||

                  conversation.user.email}

              </b>


              <br />


              <small>

                {conversation.batch.title}

              </small>

            </button>

          )

        )}

      </div>


      {/* RIGHT */}

      <div
        className="admin-chat-window"
      >


        {!selected && (

          <p className="muted">

            Select a student
            conversation.

          </p>

        )}


        {selected && (

          <>


            <h3>

              {selected.user.name ||

                selected.user.email}

            </h3>


            <p className="muted">

              Batch:

              {" "}

              {selected.batch.title}

            </p>


            <div
              className="chat-messages"
            >

              {messages.map(

                (
                  message
                ) => (

                  <div

                    key={
                      message.id
                    }

                    className="chat-message"

                  >

                    {message.text}

                  </div>

                )

              )}

            </div>


            <textarea

              className="input"

              placeholder="Write your reply..."

              value={
                reply
              }

              onChange={(e) =>

                setReply(
                  e.target.value
                )

              }

            />


            <button

              className="btn primary"

              onClick={
                sendReply
              }

            >

              Send Reply

            </button>

          </>

        )}

      </div>

    </div>

  );

}
