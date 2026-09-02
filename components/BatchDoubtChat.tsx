"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getFirebaseAuthHeaders,
} from "@/lib/firebase-client-auth";


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


  /* =====================
     LOAD CONVERSATION
  ===================== */

  const loadConversation =
    async () => {

      try {

        setLoading(true);


        const firebaseHeaders =
  await getFirebaseAuthHeaders();


const headers =
  new Headers(
    firebaseHeaders
  );


const response =
  await fetch(

    "/api/conversations",

    {

      headers,

    }

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

        const firebaseHeaders =
  await getFirebaseAuthHeaders();


const headers =
  new Headers(
    firebaseHeaders
  );


const response =
  await fetch(

    `/api/conversations/${conversationId}/messages`,

    {

      headers,

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


  useEffect(() => {

    loadConversation();

  }, [
    batchId
  ]);


  /* =====================
     UPLOAD ATTACHMENT
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


        const firebaseHeaders =
  await getFirebaseAuthHeaders();


const headers =
  new Headers(
    firebaseHeaders
  );


const response =
  await fetch(

    "/api/upload",

    {

      method:
        "POST",

      headers,

      body:
        formData,

    }

  );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(

            data.error ||

            "Unable to upload attachment"

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
     SEND DOUBT
  ===================== */

  const sendDoubt =
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
              url: string;
              type: string;
            }
          | null =
          null;


        if (attachment) {

          attachmentData =
            await uploadAttachment();

        }


        const firebaseHeaders =
          await getFirebaseAuthHeaders();


        const requestHeaders =
          new Headers(
            firebaseHeaders
          );


        requestHeaders.set(

          "Content-Type",

          "application/json"

        );
        

        /*
          FIRST MESSAGE
        */

        if (!conversation) {

          const response =
            await fetch(

              "/api/conversations",

              {

                method:
                  "POST",

                headers:
                  requestHeaders,

                body:
                  JSON.stringify({

                    batchId,

                    text:
                      text.trim() || null,

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

              "Unable to send doubt"

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


          await loadConversation();

        }


        /*
          EXISTING CONVERSATION
        */

        else {

          const response =
            await fetch(

              `/api/conversations/${conversation.id}/messages`,

              {

                method:
                  "POST",

                headers:
                  requestHeaders,

                body:
                  JSON.stringify({

                    text:
                      text.trim() || null,

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

              "Unable to send doubt"

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


          await loadMessages(
            conversation.id
          );

        }

      }

      catch (error: any) {

        console.error(
          error
        );


        alert(

          error.message ||

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


      {/* =====================
          MESSAGES
      ===================== */}

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

                <>

                  {message.attachmentType?.startsWith(
                    "image/"
                  ) && (

                    <img

                      src={
                        message.attachmentUrl
                      }

                      alt="Attachment"

                      className="chat-attachment-image"

                    />

                  )}


                  {message.attachmentType?.startsWith(
                    "audio/"
                  ) && (

                    <audio

                      controls

                      src={
                        message.attachmentUrl
                      }

                    />

                  )}


                  {!message.attachmentType?.startsWith(
                    "image/"
                  ) &&

                    !message.attachmentType?.startsWith(
                      "audio/"
                    ) && (

                      <p>

                        <a

                          href={
                            message.attachmentUrl
                          }

                          target="_blank"

                          rel="noreferrer"

                          className="yellow"

                        >

                          📎 Open PDF / Attachment

                        </a>

                      </p>

                    )}

                </>

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


      {/* =====================
          INPUT
      ===================== */}

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


      {/* =====================
          ATTACHMENT INPUT
      ===================== */}

      <input

        ref={
          fileInputRef
        }

        type="file"

        accept="
          image/*,
          audio/*,
          application/pdf
        "

        style={{

          display:
            "none",

        }}

        onChange={(e) =>

          setAttachment(

            e.target.files?.[0] ||
            null

          )

        }

      />


      <div className="row">


        {/* PLUS BUTTON */}

        <button

          type="button"

          className="btn"

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


        {/* FILE NAME */}

        {attachment && (

          <span
            className="muted"
          >

            📎 {attachment.name}

          </span>

        )}


        {/* SEND */}

        <button

          type="button"

          className="btn primary"

          disabled={

            sending ||

            uploading ||

            (

              !text.trim() &&

              !attachment

            )

          }

          onClick={
            sendDoubt
          }

        >

          {

            sending ||

            uploading

              ? "Sending..."

              : "Send Doubt"

          }

        </button>


      </div>


    </div>

  );

}
