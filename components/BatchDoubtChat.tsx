"use client";

import {

  useEffect,

  useRef,

  useState,

} from "react";

import {

  useRouter,

} from "next/navigation";

import {

  getFirebaseAuthHeaders,

} from "@/lib/firebase-client-auth";


type Message = {

  id:
    string;

  text:
    string | null;

  attachmentUrl:
    string | null;

  attachmentType:
    string | null;

  senderRole:
    "USER" |
    "TUTOR";

  createdAt:
    string;

};


type Conversation = {

  id:
    string;

  batchId:
    string;

};


type Props = {

  batchId:
    string;

  batchTitle:
    string;

};


/* =====================
   AUTH HEADERS
===================== */

async function getAuthHeaders() {

  const firebaseHeaders =
    await getFirebaseAuthHeaders();


  const headers =
    new Headers();


  if (

    firebaseHeaders.Authorization

  ) {

    headers.set(

      "Authorization",

      firebaseHeaders.Authorization

    );

  }


  return headers;

}


/* =====================
   DATE LABEL
===================== */

function getDateLabel(

  dateValue:
    string

) {

  const date =
    new Date(
      dateValue
    );


  const today =
    new Date();


  const yesterday =
    new Date();

  yesterday.setDate(
    today.getDate() - 1
  );


  if (

    date.toDateString() ===
    today.toDateString()

  ) {

    return "Today";

  }


  if (

    date.toDateString() ===
    yesterday.toDateString()

  ) {

    return "Yesterday";

  }


  return date.toLocaleDateString();

}


export default function BatchDoubtChat({

  batchId,

  batchTitle,

}: Props) {


  const router =
    useRouter();


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

    attachment,

    setAttachment,

  ] =
    useState<File | null>(
      null
    );


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


  const [

    uploading,

    setUploading,

  ] =
    useState(false);


  const fileInputRef =
    useRef<HTMLInputElement>(
      null
    );


  const bottomRef =
    useRef<HTMLDivElement>(
      null
    );


  /* =====================
     SCROLL TO BOTTOM
  ===================== */

  useEffect(() => {

    bottomRef.current
      ?.scrollIntoView({

        behavior:
          "smooth",

      });

  }, [
    messages
  ]);


  /* =====================
     LOAD MESSAGES
  ===================== */

  const loadMessages =
    async (

      conversationId:
        string

    ) => {

      try {

        const headers =
          await getAuthHeaders();


        const response =
          await fetch(

            `/api/conversations/${conversationId}/messages`,

            {

              headers,

              cache:
                "no-store",

            }

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


  /* =====================
     LOAD CONVERSATION
  ===================== */

  const loadConversation =
    async (

      showLoading =
        true

    ) => {

      try {

        if (showLoading) {

          setLoading(true);

        }


        const headers =
          await getAuthHeaders();


        const response =
          await fetch(

            "/api/conversations",

            {

              headers,

              cache:
                "no-store",

            }

          );


        if (!response.ok) {

          return;

        }


        const conversations =
          await response.json();


        const current =
          conversations.find(

            (
              item:
                Conversation
            ) =>

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

        if (showLoading) {

          setLoading(false);

        }

      }

    };


  /* =====================
     INITIAL LOAD
     + AUTO REFRESH
  ===================== */

  useEffect(() => {

    loadConversation();


    const interval =
      setInterval(

        () => {

          loadConversation(
            false
          );

        },

        5000

      );


    return () => {

      clearInterval(
        interval
      );

    };

  }, [
    batchId
  ]);


  /* =====================
     UPLOAD FILE
  ===================== */

  const uploadAttachment =
    async () => {

      if (!attachment) {

        return null;

      }


      try {

        setUploading(true);


        const formData =
          new FormData();


        formData.append(

          "file",

          attachment

        );


        const response =
          await fetch(

            "/api/upload",

            {

              method:
                "POST",

              body:
                formData,

            }

          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(

            data.error ||

            "Unable to upload file"

          );

        }


        return {

          url:
            data.url,

          type:
            data.type,

        };

      }

      finally {

        setUploading(false);

      }

    };


  /* =====================
     SEND MESSAGE
  ===================== */

  const sendMessage =
    async () => {

      if (

        !text.trim() &&

        !attachment

      ) {

        return;

      }


      try {

        setSending(true);


        let attachmentData:
          | {

              url:
                string;

              type:
                string;

            }

          | null =
          null;


        if (attachment) {

          attachmentData =
            await uploadAttachment();

        }


        /*
          FIRST MESSAGE
        */

        if (!conversation) {

          const headers =
            await getAuthHeaders();


          headers.set(

            "Content-Type",

            "application/json"

          );


          const response =
            await fetch(

              "/api/conversations",

              {

                method:
                  "POST",

                headers,

                body:
                  JSON.stringify({

                    batchId,


                    text:
                      text.trim() ||
                      null,


                    attachmentUrl:
                      attachmentData?.url ||
                      null,


                    attachmentType:
                      attachmentData?.type ||
                      null,

                  }),

              }

            );


          const data =
            await response.json();


          if (!response.ok) {

            throw new Error(

              data.error ||

              "Unable to send message"

            );

          }


          setConversation(
            data.conversation
          );


          setMessages(

  (
    current
  ) => [

    ...current,

    {

      ...data.message,

      senderRole:
        "USER",

    },

  ]

);

        }


        /*
          EXISTING CHAT
        */

        else {

          const headers =
            await getAuthHeaders();


          headers.set(

            "Content-Type",

            "application/json"

          );


          const response =
            await fetch(

              `/api/conversations/${conversation.id}/messages`,

              {

                method:
                  "POST",

                headers,

                body:
                  JSON.stringify({

                    text:
                      text.trim() ||
                      null,


                    attachmentUrl:
                      attachmentData?.url ||
                      null,


                    attachmentType:
                      attachmentData?.type ||
                      null,

                  }),

              }

            );


          const data =
            await response.json();


          if (!response.ok) {

            throw new Error(

              data.error ||

              "Unable to send message"

            );

          }


          setMessages(

  (
    current
  ) => [

    ...current,

    {

      ...data,

      senderRole:
        "USER",

    },

  ]

);

        }


        setText("");

        setAttachment(null);


        if (
          fileInputRef.current
        ) {

          fileInputRef.current.value =
            "";

        }

      }

      catch (
        error: any
      ) {

        console.error(
          error
        );


        alert(

          error.message ||

          "Unable to send message."

        );

      }

      finally {

        setSending(false);

      }

    };


  /* =====================
     FILE PREVIEW
  ===================== */

  const renderAttachment =
    (
      message:
        Message
    ) => {

      if (
        !message.attachmentUrl
      ) {

        return null;

      }


      if (

        message.attachmentType
          ?.startsWith(
            "image/"
          )

      ) {

        return (

          <img

            src={
              message.attachmentUrl
            }

            alt="Attachment"

            className="tg-image"

          />

        );

      }


      if (

        message.attachmentType
          ?.startsWith(
            "audio/"
          )

      ) {

        return (

          <audio

            controls

            className="tg-audio"

            src={
              message.attachmentUrl
            }

          />

        );

      }


      if (

        message.attachmentType
          ?.startsWith(
            "video/"
          )

      ) {

        return (

          <video

            controls

            className="tg-video"

            src={
              message.attachmentUrl
            }

          />

        );

      }


      return (

        <a

          href={
            message.attachmentUrl
          }

          target="_blank"

          rel="noopener noreferrer"

          className="tg-file"

        >

          📄 Open PDF / File

        </a>

      );

    };


  if (loading) {

    return (

      <main
        className="tg-page"
      >

        <p
          className="muted"
        >

          Loading chat...

        </p>

      </main>

    );

  }


  return (

    <main
      className="tg-page"
    >


      {/* =====================
          HEADER
      ===================== */}

      <header
        className="tg-header"
      >

        <button

          className="tg-back"

          onClick={() =>

            router.back()

          }

        >

          ←

        </button>


        <div>

          <b>

            Tutor Support

          </b>


          <small>

            {batchTitle}

          </small>

        </div>

      </header>


      {/* =====================
          MESSAGES
      ===================== */}

      <section
        className="tg-messages"
      >


        {messages.length ===
          0 && (

          <div
            className="tg-empty"
          >

            💬

            <h3>

              Ask your Tutor

            </h3>

            <p>

              Send your doubt.
              Your tutor will reply here.

            </p>

          </div>

        )}


        {messages.map(

          (
            message,

            index

          ) => {

            const previous =
              messages[
                index - 1
              ];


            const showDate =

              !previous ||

              getDateLabel(
                previous.createdAt
              ) !==

              getDateLabel(
                message.createdAt
              );


            const isUser =

              message.senderRole ===
              "USER";


            return (

              <div

                key={
                  message.id
                }

              >


                {showDate && (

                  <div
                    className="tg-date"
                  >

                    {
                      getDateLabel(
                        message.createdAt
                      )
                    }

                  </div>

                )}


                <div

                  className={
                    `tg-row ${
                      isUser
                        ? "tg-user-row"
                        : "tg-tutor-row"
                    }`
                  }

                >


                  <div

                    className={
                      `tg-bubble ${
                        isUser
                          ? "tg-user-bubble"
                          : "tg-tutor-bubble"
                      }`
                    }

                  >


                    {!isUser && (

                      <b
                        className="tg-sender"
                      >

                        👨‍🏫 Tutor

                      </b>

                    )}


                    {message.text && (

                      <p>

                        {message.text}

                      </p>

                    )}


                    {
                      renderAttachment(
                        message
                      )
                    }


                    <small>

                      {
                        new Date(

                          message.createdAt

                        ).toLocaleTimeString(

                          [],

                          {

                            hour:
                              "2-digit",

                            minute:
                              "2-digit",

                          }

                        )
                      }

                    </small>

                  </div>

                </div>

              </div>

            );

          }

        )}


        <div
          ref={bottomRef}
        />

      </section>


      {/* =====================
          ATTACHMENT
      ===================== */}

      <input

        ref={
          fileInputRef
        }

        type="file"

        accept="
          image/*,
          audio/*,
          video/*,
          application/pdf
        "

        hidden

        onChange={

          (
            event
          ) =>

            setAttachment(

              event.target.files?.[0] ||
              null

            )

        }

      />


      {/* =====================
          COMPOSER
      ===================== */}

      <footer
        className="tg-composer"
      >


        {attachment && (

          <div
            className="tg-selected-file"
          >

            📎

            {
              attachment.name
            }


            <button

              onClick={() => {

                setAttachment(
                  null
                );


                if (
                  fileInputRef.current
                ) {

                  fileInputRef.current.value =
                    "";

                }

              }}

            >

              ×

            </button>

          </div>

        )}


        <div
          className="tg-input-row"
        >


          <button

            type="button"

            className="tg-attach"

            disabled={

              sending ||

              uploading

            }

            onClick={() =>

              fileInputRef.current?.click()

            }

          >

            ➕

          </button>


          <textarea

            placeholder="Write a message..."

            value={
              text
            }

            onChange={

              (
                event
              ) =>

                setText(
                  event.target.value
                )

            }

            onKeyDown={

              (
                event
              ) => {

                if (

                  event.key ===
                  "Enter" &&

                  !event.shiftKey

                ) {

                  event.preventDefault();


                  sendMessage();

                }

              }

            }

          />


          <button

            type="button"

            className="tg-send"

            disabled={

              sending ||

              uploading ||

              (

                !text.trim() &&

                !attachment

              )

            }

            onClick={
              sendMessage
            }

          >

            {

              sending ||

              uploading

                ? "..."

                : "➤"

            }

          </button>

        </div>

      </footer>

    </main>

  );

}
