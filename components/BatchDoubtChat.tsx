"use client";

import {
  useEffect,
  useState,
} from "react";


type Message = {

  id: string;

  text:
    string | null;

  attachmentUrl:
    string | null;

  attachmentType:
    string | null;

  senderId:
    string;

  createdAt:
    string;

};


type Conversation = {

  id: string;

};


export default function BatchDoubtChat({

  batchId,

}: {

  batchId: string;

}) {


  const [

    conversation,

    setConversation,

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

    text,

    setText,

  ] =
    useState("");


  const [

    loading,

    setLoading,

  ] =
    useState(true);


  const [

    sending,

    setSending,

  ] =
    useState(false);


  /* =====================
     LOAD CONVERSATION
  ===================== */

  const loadConversation =
    async () => {

      try {

        setLoading(true);


        const response =
          await fetch(
            "/api/conversations"
          );


        if (!response.ok) {

          throw new Error(
            "Unable to load chat"
          );

        }


        const conversations =
          await response.json();


        const current =
          conversations.find(
            (item: any) =>

              item.batchId ===
              batchId
          );


        if (current) {

          setConversation(
            current
          );


          await loadMessages(
            current.id
          );

        }

      }

      catch (error) {

        console.error(
          error
        );

      }

      finally {

        setLoading(false);

      }

    };


  /* =====================
     LOAD MESSAGES
  ===================== */

  const loadMessages =
    async (
      conversationId: string
    ) => {

      try {

        const response =
          await fetch(

            `/api/conversations/${conversationId}/messages`

          );


        if (!response.ok) {

          return;

        }


        const data =
          await response.json();


        setMessages(
          data
        );

      }

      catch (error) {

        console.error(
          error
        );

      }

    };


  useEffect(() => {

    loadConversation();

  }, [
    batchId
  ]);


  /* =====================
     SEND DOUBT
  ===================== */

  const sendDoubt =
    async () => {

      if (

        !text.trim()

      ) {

        return;

      }


      try {

        setSending(true);


        /*
          First message
          creates conversation.
        */

        if (!conversation) {

          const response =
            await fetch(

              "/api/conversations",

              {

                method:
                  "POST",

                headers: {

                  "Content-Type":
                    "application/json",

                },


                body:
                  JSON.stringify({

                    batchId,

                    text,

                  }),

              }

            );


          if (!response.ok) {

            throw new Error(
              "Unable to send doubt"
            );

          }


          setText("");


          await loadConversation();

        }


        /*
          Existing conversation
        */

        else {

          const response =
            await fetch(

              `/api/conversations/${conversation.id}/messages`,

              {

                method:
                  "POST",

                headers: {

                  "Content-Type":
                    "application/json",

                },


                body:
                  JSON.stringify({

                    text,

                  }),

              }

            );


          if (!response.ok) {

            throw new Error(
              "Unable to send doubt"
            );

          }


          setText("");


          await loadMessages(
            conversation.id
          );

        }

      }

      catch (error) {

        console.error(
          error
        );


        alert(
          "Unable to send doubt."
        );

      }

      finally {

        setSending(false);

      }

    };


  if (loading) {

    return (

      <p className="muted">

        Loading chat...

      </p>

    );

  }


  return (

    <div className="doubt-chat">


      {/* MESSAGES */}

      <div
        className="chat-messages"
      >

        {messages.length ===
          0 && (

          <p className="muted">

            No doubts yet.

            <br />

            Ask your first doubt.

          </p>

        )}


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

              {message.text && (

                <p>

                  {message.text}

                </p>

              )}


              {message.attachmentUrl && (

                <a

                  href={
                    message.attachmentUrl
                  }

                  target="_blank"

                  className="yellow"

                >

                  📎 Open Attachment

                </a>

              )}


              <small>

                {new Date(

                  message.createdAt

                ).toLocaleString()}

              </small>

            </div>

          )
        )}

      </div>


      {/* INPUT */}

      <textarea

        className="input"

        placeholder="Write your doubt..."

        value={
          text
        }

        onChange={(e) =>

          setText(
            e.target.value
          )

        }

      />


      <button

        className="btn primary"

        disabled={
          sending
        }

        onClick={
          sendDoubt
        }

      >

        {sending

          ? "Sending..."

          : "Send Doubt"

        }

      </button>


    </div>

  );

}
