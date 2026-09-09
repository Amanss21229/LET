"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useFirebaseAuth,
} from "@/hooks/useFirebaseAuth";

import {
  firebaseFetch,
} from "@/lib/firebase-api";

import {
  loginWithGoogle,
} from "@/lib/firebase-auth";


type CommentItem = {

  id: string;

  text: string;

  createdAt: string;

  updatedAt: string;

  user: {

    id: string;

    name: string;

    image: string;

  };

  likeCount: number;

  likedByCurrentUser: boolean;

  canEdit: boolean;

  canDelete: boolean;

  isBlocked: boolean;

};


type Props = {

  shortId: string;

  initialCount?: number;

};


const MODERATOR_EMAIL =
  "amanss21229@gmail.com";


function formatDate(
  value: string
) {

  return new Date(
    value
  ).toLocaleString(
    undefined,
    {
      dateStyle:
        "medium",

      timeStyle:
        "short",
    }
  );

}


export default function
SuccessShortComments({

  shortId,

  initialCount = 0,

}: Props) {


  const {

    firebaseUser,

  } =
    useFirebaseAuth();


  const [

    open,

    setOpen,

  ] =
    useState(false);


  const [

    comments,

    setComments,

  ] =
    useState<CommentItem[]>([]);


  const [

    loading,

    setLoading,

  ] =
    useState(false);


  const [

    text,

    setText,

  ] =
    useState("");


  const [

    submitting,

    setSubmitting,

  ] =
  useState(false);


  const [

    editingId,

    setEditingId,

  ] =
    useState<string | null>(
      null
    );


  const [

    editingText,

    setEditingText,

  ] =
    useState("");


  const [

    error,

    setError,

  ] =
    useState("");


  const [

    loginLoading,

    setLoginLoading,

  ] =
    useState(false);


  const [

    count,

    setCount,

  ] =
    useState(
      initialCount
    );


  const isModerator =
    firebaseUser?.email
      ?.toLowerCase() ===
    MODERATOR_EMAIL
      .toLowerCase();


  async function
  loadComments() {

    try {

      setLoading(
        true
      );

      setError("");


      const response =
        await fetch(
          `/api/success-shorts/${shortId}/comments`,
          {
            cache:
              "no-store",
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data?.error ||
          "Unable to load comments."
        );

      }


      const next =
        Array.isArray(
          data?.comments
        )
          ? data.comments
          : [];


      setComments(
        next
      );

      setCount(
        next.length
      );

    }

    catch (error) {

      setError(

        error instanceof Error

          ? error.message

          : "Unable to load comments."

      );

    }

    finally {

      setLoading(
        false
      );

    }

  }


  useEffect(() => {

    if (!open) {

      return;

    }


    loadComments();

  }, [open, shortId]);


  async function
  handleLogin() {

    try {

      setLoginLoading(
        true
      );

      await loginWithGoogle();

    }

    catch {

      setError(
        "Google login failed."
      );

    }

    finally {

      setLoginLoading(
        false
      );

    }

  }


  async function
  submitComment() {

    if (!firebaseUser) {

      await handleLogin();

      return;

    }


    if (
      !text.trim()
    ) {

      return;

    }


    try {

      setSubmitting(
        true
      );

      setError("");


      const response =
        await firebaseFetch(

          `/api/success-shorts/${shortId}/comments`,

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
                  text.trim(),
              }),

          }

        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data?.error ||
          "Unable to post comment."
        );

      }


      if (
        data?.comment
      ) {

        setComments(
          previous => [
            data.comment,
            ...previous,
          ]
        );

        setCount(
          previous =>
            previous + 1
        );

      }


      setText("");

    }

    catch (error) {

      setError(

        error instanceof Error

          ? error.message

          : "Unable to post comment."

      );

    }

    finally {

      setSubmitting(
        false
      );

    }

  }


  async function
  handleLike(
    commentId: string
  ) {

    if (!firebaseUser) {

      await handleLogin();

      return;

    }


    try {

      const response =
        await firebaseFetch(

          `/api/success-shorts/${shortId}/comments/${commentId}/like`,

          {
            method:
              "POST",
          }

        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data?.error ||
          "Unable to update like."
        );

      }


      setComments(
        previous =>
          previous.map(
            comment =>
              comment.id ===
              commentId

                ? {

                    ...comment,

                    likedByCurrentUser:
                      data.liked,

                    likeCount:
                      data.likes,

                  }

                : comment

          )
      );

    }

    catch (error) {

      setError(

        error instanceof Error

          ? error.message

          : "Unable to update like."

      );

    }

  }


  function startEdit(
    comment: CommentItem
  ) {

    setEditingId(
      comment.id
    );

    setEditingText(
      comment.text
    );

  }


  function cancelEdit() {

    setEditingId(
      null
    );

    setEditingText("");

  }


  async function
  saveEdit() {

    if (
      !editingId ||
      !editingText.trim()
    ) {

      return;

    }


    try {

      const response =
        await firebaseFetch(

          `/api/success-shorts/${shortId}/comments/${editingId}`,

          {

            method:
              "PATCH",

            headers: {

              "Content-Type":
                "application/json",

            },

            body:
              JSON.stringify({

                text:
                  editingText.trim(),

              }),

          }

        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data?.error ||
          "Unable to edit comment."
        );

      }


      setComments(
        previous =>
          previous.map(
            comment =>
              comment.id ===
              editingId

                ? {

                    ...comment,

                    text:
                      data.comment.text,

                    updatedAt:
                      data.comment.updatedAt,

                  }

                : comment

          )
      );


      cancelEdit();

    }

    catch (error) {

      setError(

        error instanceof Error

          ? error.message

          : "Unable to edit comment."

      );

    }

  }


  async function
  deleteComment(
    commentId: string
  ) {

    if (
      !window.confirm(
        "Delete this comment?"
      )
    ) {

      return;

    }


    try {

      const response =
        await firebaseFetch(

          `/api/success-shorts/${shortId}/comments/${commentId}`,

          {
            method:
              "DELETE",
          }

        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data?.error ||
          "Unable to delete comment."
        );

      }


      setComments(
        previous =>
          previous.filter(
            comment =>
              comment.id !==
              commentId
          )
      );


      setCount(
        previous =>
          Math.max(
            0,
            previous - 1
          )
      );

    }

    catch (error) {

      setError(

        error instanceof Error

          ? error.message

          : "Unable to delete comment."

      );

    }

  }


  async function
  toggleBlock(
    userId: string,
    blocked: boolean
  ) {

    const action =
      blocked
        ? "unblock"
        : "permanently block";


    if (
      !window.confirm(
        `Are you sure you want to ${action} this user from commenting?`
      )
    ) {

      return;

    }


    try {

      const response =
        await firebaseFetch(

          `/api/success-shorts/moderation/users/${userId}`,

          {

            method:
              "PATCH",

            headers: {

              "Content-Type":
                "application/json",

            },

            body:
              JSON.stringify({

                blocked:
                  !blocked,

              }),

          }

        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data?.error ||
          "Unable to update block status."
        );

      }


      const nextBlocked =
        data?.user
          ?.commentBlocked ??
        !blocked;


      setComments(
        previous =>
          previous.map(
            comment =>
              comment.user.id ===
              userId

                ? {

                    ...comment,

                    isBlocked:
                      nextBlocked,

                  }

                : comment

          )
      );

    }

    catch (error) {

      setError(

        error instanceof Error

          ? error.message

          : "Unable to update block status."

      );

    }

  }


  return (

    <>

      <button

        type="button"

        className="success-short-action"

        onClick={() =>
          setOpen(true)
        }

      >

        <span>
          💬
        </span>

        <small>
          {count}
        </small>

      </button>


      {open && (

        <div
          className="success-short-comments-overlay"
          onClick={() =>
            setOpen(false)
          }
        >

          <section

            className="success-short-comments-panel"

            onClick={event =>
              event.stopPropagation()
            }

          >

            <header
              className="success-short-comments-header"
            >

              <div>

                <h2>
                  Comments
                </h2>

                <small>
                  {count} comments
                </small>

              </div>


              <button

                type="button"

                className="success-short-comments-close"

                onClick={() =>
                  setOpen(false)
                }

              >
                ×
              </button>

            </header>


            <div
              className="success-short-comments-notice"
            >

              📚 Keep comments
              education-focused.
              Irrelevant or inappropriate
              comments may result in
              a permanent ban.

            </div>


            {error && (

              <div
                className="success-short-comments-error"
              >

                {error}

              </div>

            )}


            <div
              className="success-short-comments-list"
            >

              {loading ? (

                <p>
                  Loading comments...
                </p>

              ) : comments.length === 0 ? (

                <p>
                  No comments yet.
                  Be the first to comment.
                </p>

              ) : (

                comments.map(
                  comment => (

                    <article
                      key={
                        comment.id
                      }
                      className="success-short-comment"
                    >

                      <div
                        className="success-short-comment-top"
                      >

                        {comment.user.image ? (

                          <img
                            src={
                              comment.user.image
                            }
                            alt=""
                          />

                        ) : (

                          <div
                            className="success-short-comment-avatar"
                          >
                            👤
                          </div>

                        )}


                        <div
                          className="success-short-comment-author"
                        >

                          <strong>
                            {
                              comment.user.name
                            }
                          </strong>

                          <time>
                            {
                              formatDate(
                                comment.createdAt
                              )
                            }
                          </time>

                        </div>

                      </div>


                      {editingId ===
                      comment.id ? (

                        <>

                          <textarea

                            value={
                              editingText
                            }

                            maxLength={
                              1000
                            }

                            onChange={event =>
                              setEditingText(
                                event.target.value
                              )
                            }

                            className="success-short-comment-input"

                          />


                          <div
                            className="success-short-comment-edit-actions"
                          >

                            <button
                              type="button"
                              onClick={
                                saveEdit
                              }
                            >
                              Save
                            </button>

                            <button
                              type="button"
                              onClick={
                                cancelEdit
                              }
                            >
                              Cancel
                            </button>

                          </div>

                        </>

                      ) : (

                        <p
                          className="success-short-comment-text"
                        >
                          {comment.text}
                        </p>

                      )}


                      <div
                        className="success-short-comment-actions"
                      >

                        <button

                          type="button"

                          className={
                            comment.likedByCurrentUser
                              ? "comment-liked"
                              : ""
                          }

                          onClick={() =>
                            handleLike(
                              comment.id
                            )
                          }

                        >

                          {comment.likedByCurrentUser
                            ? "♥"
                            : "♡"}

                          {" "}

                          {comment.likeCount}

                        </button>


                        {comment.canEdit && (

                          <button

                            type="button"

                            onClick={() =>
                              startEdit(
                                comment
                              )
                            }

                          >
                            Edit
                          </button>

                        )}


                        {comment.canDelete && (

                          <button

                            type="button"

                            onClick={() =>
                              deleteComment(
                                comment.id
                              )
                            }

                          >
                            Delete
                          </button>

                        )}


                        {isModerator && (

                          <button

                            type="button"

                            className={
                              comment.isBlocked
                                ? "comment-unblock"
                                : "comment-block"
                            }

                            onClick={() =>
                              toggleBlock(
                                comment.user.id,
                                comment.isBlocked
                              )
                            }

                          >

                            {comment.isBlocked
                              ? "Unblock"
                              : "Block"}

                          </button>

                        )}

                      </div>

                    </article>

                  )
                )

              )}

            </div>


            <footer
              className="success-short-comments-composer"
            >

              {firebaseUser ? (

                <>

                  <textarea

                    value={
                      text
                    }

                    maxLength={
                      1000
                    }

                    onChange={event =>
                      setText(
                        event.target.value
                      )
                    }

                    placeholder={
                      "Write an education-related comment..."
                    }

                    className="success-short-comment-input"

                  />


                  <button

                    type="button"

                    disabled={
                      submitting ||
                      !text.trim()
                    }

                    onClick={
                      submitComment
                    }

                  >

                    {submitting
                      ? "Posting..."
                      : "Comment"}

                  </button>

                </>

              ) : (

                <>

                  <p>
                    Login with Google
                    to write a comment.
                  </p>


                  <button

                    type="button"

                    disabled={
                      loginLoading
                    }

                    onClick={
                      handleLogin
                    }

                  >

                    {loginLoading
                      ? "Opening..."
                      : "Login with Google"}

                  </button>

                </>

              )}

            </footer>

          </section>

        </div>

      )}

    </>

  );

}
