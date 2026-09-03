"use client";

import {

  useEffect,

  useRef,

  useState,

} from "react";


type Conversation = {

  id:
    string;


  unreadCount:
    number;


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
        string | null;

    };


  lastMessage:
    {

      text:
        string | null;

      attachmentType:
        string | null;

      createdAt:
        string;

    } | null;

};


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


function getDateLabel(

  value:
    string

) {

  const date =
    new Date(value);


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


  const [

    attachment,

    setAttachment,

  ] =
    useState<File | null>(
      null
    );


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
     LOAD CONVERSATIONS
  ===================== */

  const loadConversations =
    async () => {

      try {

        const response =
          await fetch(

            "/api/conversations",

            {

              cache:
                "no-store",

            }

          );


        if (!response.ok) {

          return;

        }


        const data =
          await response.json();


        setConversations(
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
     LOAD MESSAGES
  ===================== */

  const loadMessages =
    async (

      conversationId:
        string

    ) => {

      try {

        const response =
          await fetch(

            `/api/conversations/${conversationId}/messages`,

            {

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


        await loadConversations();

      }

      catch (error) {

        console.error(
          error
        );

      }

    };


  /* =====================
     INITIAL LOAD
  ===================== */

  useEffect(() => {

    loadConversations();


    const interval =
      setInterval(

        () => {

          loadConversations();


          if (selected) {

            loadMessages(
              selected.id
            );

          }

        },

        5000

      );


    return () => {

      clearInterval(
        interval
      );

    };

  }, [
    selected
  ]);


  /* =====================
     SELECT CHAT
  ===================== */

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
     UPLOAD
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

            "Upload failed"

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
     SEND REPLY
  ===================== */

  const sendReply =
    async () => {

      if (

        !selected ||

        (

          !reply.trim() &&

          !attachment

        )

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
                    reply.trim() ||
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

            "Unable to send reply"

          );

        }


        setMessages(

          (
            current
          ) => [

            ...current,

            data,

          ]

        );


        setReply("");

        setAttachment(null);


        if (
          fileInputRef.current
        ) {

          fileInputRef.current.value =
            "";

        }


        await loadConversations();

      }

      catch (
        error: any
      ) {

        alert(

          error.message ||

          "Unable to send reply"

        );

      }

      finally {

        setSending(false);

      }

    };


  /* =====================
     SCROLL
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
     RENDER FILE
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


  return (

    <div
      className="tg-admin"
    >


      {/* =====================
          CONVERSATION LIST
      ===================== */}

      <aside
        className="tg-admin-list"
      >

        <h2>

          💬 Chats

        </h2>


        {conversations.length ===
          0 && (

          <p
            className="muted"
          >

            No conversations yet.

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

              className={
                `tg-conversation ${
                  selected?.id ===
                  conversation.id

                    ? "selected"

                    : ""
                }`
              }

              onClick={() =>

                selectConversation(
                  conversation
                )

              }

            >


              <div
                className="tg-conversation-top"
              >

                <b>

                  {
                    conversation.user.name ||

                    conversation.user.email ||

                    "Student"
                  }

                </b>


                {conversation.unreadCount >
                  0 && (

                  <span
                    className="tg-unread"
                  >

                    {
                      conversation.unreadCount
                    }

                  </span>

                )}

              </div>


              <small>

                {
                  conversation.batch.title
                }

              </small>


              <p>

                {
                  conversation.lastMessage?.text ||

                  (

                    conversation.lastMessage
                      ?.attachmentType

                      ? "📎 Attachment"

                      : "No messages"
                  )

                }

              </p>

            </button>

          )

        )}

      </aside>


      {/* =====================
          CHAT WINDOW
      ===================== */}

      <section
        className="tg-admin-window"
      >


        {!selected && (

          <div
            className="tg-empty"
          >

            💬

            <h3>

              Select a conversation

            </h3>

          </div>

        )}


        {selected && (

          <>


            {/* HEADER */}

            <header
              className="tg-admin-header"
            >

              <div>

                <b>

                  {
                    selected.user.name ||

                    selected.user.email ||

                    "Student"
                  }

                </b>


                <small>

                  {
                    selected.batch.title
                  }

                </small>

              </div>

            </header>


            {/* MESSAGES */}

            <div
              className="tg-admin-messages"
            >

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


                  const isTutor =

                    message.senderRole ===
                    "TUTOR";


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
                            isTutor

                              ? "tg-user-row"

                              : "tg-tutor-row"
                          }`
                        }

                      >


                        <div

                          className={
                            `tg-bubble ${
                              isTutor

                                ? "tg-user-bubble"

                                : "tg-tutor-bubble"
                            }`
                          }

                        >


                          {!isTutor && (

                            <b
                              className="tg-sender"
                            >

                              Student

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

            </div>


            {/* FILE INPUT */}

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


            {/* COMPOSER */}

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

                    onClick={() =>

                      setAttachment(
                        null
                      )

                    }

                  >

                    ×

                  </button>

                </div>

              )}


              <div
                className="tg-input-row"
              >


                <button

                  className="tg-attach"

                  disabled={

                    sending ||

                    uploading

                  }

                  onClick={() =>

                    fileInputRef.current
                      ?.click()

                  }

                >

                  ➕

                </button>


                <textarea

                  placeholder="Reply to student..."

                  value={
                    reply
                  }

                  onChange={

                    (
                      event
                    ) =>

                      setReply(
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


                        sendReply();

                      }

                    }

                  }

                />


                <button

                  className="tg-send"

                  disabled={

                    sending ||

                    uploading ||

                    (

                      !reply.trim() &&

                      !attachment

                    )

                  }

                  onClick={
                    sendReply
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

          </>

        )}

      </section>

    </div>

  );

}
