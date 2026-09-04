"use client";

import {
  useEffect,
  useState,
} from "react";

import NavClient from "@/components/NavClient";
import FileUpload from "@/components/FileUpload";
import AdminChatPanel from
  "@/components/AdminChatPanel";

const emptyBatch = {
  title: "",

  className: "",

  medium: "Hindi",

  teacherName: "Aman",

  startDate: "",

  endDate: "",

  syllabusDate: "",

  price: 0,

  about: "",

  imageUrl: "",

  customPoints: Array(20).fill(""),

  buyEnabled: true,
};

type Batch = {
  id: string;
  title: string;
  className: string;
  medium: string;
};

type UserDetails = {

  id: string;

  name: string;

  email: string;

  phone: string;

  className: string;

  createdAt: string;

  profileComplete: boolean;

  batches: string[];

};

type Section = {
  id: string;
  title: string;
  kind: string;
  items?: any[];
};

export default function Admin() {
  const [ok, setOk] =
    useState(false);

  const [password, setPassword] =
    useState("");

  const [tab, setTab] =
    useState("All Users");

  const [batches, setBatches] =
    useState<Batch[]>([]);

  const [

  users,

  setUsers,

] =
  useState<UserDetails[]>([]);


const [

  usersLoading,

  setUsersLoading,

] =
  useState(false);


const [

  usersMessage,

  setUsersMessage,

] =
  useState("");

  const [batchForm, setBatchForm] =
    useState<any>(emptyBatch);


  const [
  editingBatch,
  setEditingBatch,
] =
  useState("");

  const [message, setMessage] =
    useState("");

  /* =========================
     MANAGE BATCH STATES
  ========================= */

  const [selectedBatch, setSelectedBatch] =
    useState("");

  const [manageTab, setManageTab] =
    useState("Classes");

  const [batchData, setBatchData] =
    useState<any>(null);

  const [sectionTitle, setSectionTitle] =
    useState("");

  const [itemTitle, setItemTitle] =
    useState("");

  const [itemUrl, setItemUrl] =
    useState("");

  const [itemType, setItemType] =
    useState("");

  const [itemDate, setItemDate] =
    useState("");

  const [selectedSection, setSelectedSection] =
    useState("");

  const [notificationText, setNotificationText] =
    useState("");

  const [
    notificationUrl,
    setNotificationUrl,
  ] = useState("");

  const [
    notificationType,
    setNotificationType,
  ] = useState("");

  /* =========================
   LOAD USER DETAILS
========================= */

const loadUsers =
  async () => {

    try {

      setUsersLoading(
        true
      );


      setUsersMessage(
        ""
      );


      const response =
        await fetch(

          "/api/admin/users",

          {

            cache:
              "no-store",

          }

        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(

          data.error ||

          "Unable to load users"

        );

      }


      setUsers(

        data.users ||

        []

      );

    }

    catch (error: any) {

      console.error(
        error
      );


      setUsersMessage(

        error.message ||

        "Unable to load users"

      );

    }

    finally {

      setUsersLoading(
        false
      );

    }

  };

  /* =========================
  ABOUT TUTOR STATES
  ========================= */

  const [
    tutorForm,
    setTutorForm,
  ] = useState<any>({
    heading: "About Aman",

    subheading:
      "LET - Learn Earn Teach",

    text: "",

    imageUrl: "",

    headingSize: "32px",

    subheadingSize: "20px",

    textSize: "16px",

    links: [],
  });


  const [
    tutorMessage,
    setTutorMessage,
  ] = useState("");

  /* =========================
  BATCH TUTOR STATES
  ========================= */

const [

  batchTutorForm,

  setBatchTutorForm,

] = useState<any>({

  heading:
    "",

  subheading:
    "",

  text:
    "",

  imageUrl:
    "",

  headingSize:
    "32px",

  subheadingSize:
    "20px",

  textSize:
    "16px",

  links:
    [],

});


const [

  batchTutorMessage,

  setBatchTutorMessage,

] = useState("");

    /* =========================
     HERO SLIDER STATES
  ========================= */

  const [

    heroSlides,

    setHeroSlides,

  ] =
    useState<{

      id: string;

      imageUrl: string;

    }[]>([]);


  const [

    heroMessage,

    setHeroMessage,

  ] =
    useState("");


  /* =========================
     LOAD HERO SLIDES
  ========================= */

  const loadHeroSlides =
    async () => {

      try {

        const response =
          await fetch(
            "/api/hero-slides"
          );


        const data =
          await response.json();


        setHeroSlides(

          Array.isArray(
            data?.slides
          )

            ? data.slides

            : []

        );

      }

      catch (error) {

        console.error(

          "Unable to load hero slides",

          error

        );

      }

    };


  /* =========================
     SAVE HERO SLIDES
  ========================= */

  const saveHeroSlides =
    async (

      slides: {

        id: string;

        imageUrl: string;

      }[]

    ) => {

      try {

        setHeroMessage(
          "Saving..."
        );


        const response =
          await fetch(

            "/api/hero-slides",

            {

              method:
                "PUT",


              headers: {

                "Content-Type":
                  "application/json",

              },


              body:

                JSON.stringify({

                  slides,

                }),

            }

          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(

            data?.error ||

            "Unable to save hero images"

          );

        }


        setHeroSlides(

          data.slides ||

          slides

        );


        setHeroMessage(

          "Hero images saved successfully!"

        );

      }

      catch (error: any) {

        console.error(
          error
        );


        setHeroMessage(

          error.message ||

          "Unable to save hero images"

        );

      }

    };


  /* =========================
     ADD HERO IMAGE
  ========================= */

  const addHeroSlide =
    async (

      imageUrl: string

    ) => {


      if (
        heroSlides.length >= 15
      ) {

        setHeroMessage(

          "Maximum 15 hero images are allowed."

        );

        return;

      }


      const nextSlides = [

        ...heroSlides,

        {

          id:

            `${Date.now()}-${Math.random()}`,

          imageUrl,

        },

      ];


      await saveHeroSlides(
        nextSlides
      );

    };


  /* =========================
     REMOVE HERO IMAGE
  ========================= */

  const removeHeroSlide =
    async (

      slideId: string

    ) => {


      const nextSlides =
        heroSlides.filter(

          (slide) =>

            slide.id !==
            slideId

        );


      await saveHeroSlides(
        nextSlides
      );

    };
  
  /* =========================
     LOAD BATCHES
  ========================= */

  const loadBatches = async () => {
    try {
      const response = await fetch(
        "/api/batches"
      );

      const data =
        await response.json();

      setBatches(data);
    } catch {
      console.error(
        "Unable to load batches"
      );
    }
  };

useEffect(() => {

  loadBatches();

  loadTutor();

  loadHeroSlides();

}, []);

         const loadBatchTutor =
           async (

             batchId: string

           ) => {

             if (!batchId) {

               return;

             }


             try {

               const response =
                 await fetch(

                   `/api/batches/${batchId}`

                 );


               if (!response.ok) {

                 return;

               }


               const data =
                 await response.json();

               
               const content =
                 data?.tutorContent;


               if (content) {

                 setBatchTutorForm({

                   heading:
                     content.heading ||
                     "",

                   subheading:
                   content.subheading ||
                   "",

                   text:
                     content.text ||
                     "",

                   imageUrl:
                     content.imageUrl ||
                     "",

                   headingSize:
                     content.headingSize ||
                     "32px",

                   subheadingSize:
                     content.subheadingSize ||
                     "20px",

                   textSize:
                     content.textSize ||
                     "16px",

                   links:
                     Array.isArray(
                       content.links
                     )

                     ? content.links

                     : [],

                 });

               }

               else {

                 setBatchTutorForm({

                   heading:
                     "",

                   subheading:
                     "",

                   text:
                     "",

                   imageUrl:
                     "",

                   headingSize:
                     "32px",
                   
                   subheadingSize:
                     "20px",

                   textSize:
                     "16px",

                   links:
                     [],
                   
                 });

               }


             }

             catch (error) {

               console.error(

                 "Unable to load batch tutor:",

                 error

               );

             }

           };

  /* =========================
     LOAD TUTOR
  ========================= */

  const loadTutor =
    async () => {

      try {

        const response =
          await fetch(
            "/api/tutor"
          );


        const data =
          await response.json();


        if (data?.content) {

          setTutorForm({
            heading:
              data.content.heading ||
              "About Aman",

            subheading:
              data.content.subheading ||
              "",

            text:
              data.content.text ||
              "",

            imageUrl:
              data.content.imageUrl ||
              "",

            headingSize:
              data.content.headingSize ||
              "32px",

            subheadingSize:
              data.content.subheadingSize ||
              "20px",

            textSize:
              data.content.textSize ||
              "16px",

            links:
              Array.isArray(
                data.content.links
              )
                ? data.content.links
                : [],
          });

        }

      } catch (error) {

        console.error(
          "Unable to load tutor"
        );

      }

    }; 

  const saveBatchTutor =
  async () => {

    if (!selectedBatch) {

      setBatchTutorMessage(

        "Please select a batch first."

      );

      return;

    }


    try {

      setBatchTutorMessage(

        "Saving..."

      );


      const response =
        await fetch(

          `/api/batches/${selectedBatch}`,

          {

            method:
              "PATCH",


            headers: {

              "Content-Type":
                "application/json",

            },


            body:

              JSON.stringify({

                tutorContent:
                  batchTutorForm,

              }),

          }

        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(

          data?.error ||

          "Unable to save tutor"

        );

      }


      setBatchTutorMessage(

        "Batch tutor saved successfully!"

      );

    }

    catch (error) {

      console.error(
        error
      );


      setBatchTutorMessage(

        "Unable to save batch tutor."

      );

    }

  };

  /* =========================
     ADMIN LOGIN
  ========================= */

  const login = async () => {
    const response = await fetch(
      "/api/admin/login",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          password,
        }),
      }
    );

    if (response.ok) {
      setOk(true);
    } else {
      window.location.href = "/";
    }
  };

    /* =========================
     SAVE ABOUT TUTOR
  ========================= */

  const saveTutor =
    async () => {

      try {

        setTutorMessage(
          "Saving..."
        );


        const response =
          await fetch(
            "/api/tutor",
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  content:
                    tutorForm,
                }),
            }
          );


        if (!response.ok) {

          throw new Error(
            "Unable to save"
          );

        }


        setTutorMessage(
          "About Tutor updated successfully!"
        );

      } catch {

        setTutorMessage(
          "Unable to save About Tutor"
        );

      }

    };
  
  /* =========================
     CREATE BATCH
  ========================= */

  const createBatch = async () => {
    if (!batchForm.title) {
      setMessage(
        "Please enter batch title"
      );

      return;
    }

    const response = await fetch(
      "/api/batches",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          batchForm
        ),
      }
    );

    if (response.ok) {
      setMessage(
        "Batch created successfully!"
      );

      setBatchForm(emptyBatch);

      loadBatches();
    } else {
      setMessage(
        "Unable to create batch"
      );
    }
  };


  /* =========================
   UPDATE BATCH
========================= */

const updateBatch =
  async () => {

    if (!editingBatch) {

      return;

    }


    if (!batchForm.title) {

      setMessage(
        "Please enter batch title"
      );

      return;

    }


    try {

      const response =
        await fetch(

          `/api/batches/${editingBatch}`,

          {

            method:
              "PATCH",

            headers: {

              "Content-Type":
                "application/json",

            },

            body:
              JSON.stringify(
                batchForm
              ),

          }

        );


      if (!response.ok) {

        throw new Error(
          "Unable to update batch"
        );

      }


      setMessage(
        "Batch updated successfully!"
      );


      setEditingBatch("");


      setBatchForm(
        emptyBatch
      );


      await loadBatches();

    }

    catch (error) {

      console.error(
        error
      );


      setMessage(
        "Unable to update batch"
      );

    }

  };

  /* =========================
   DELETE BATCH
========================= */

const deleteBatch =
  async (
    batchId: string,
    batchTitle: string
  ) => {

    const confirmed =
      window.confirm(

        `Are you sure you want to permanently delete "${batchTitle}"?`

      );


    if (!confirmed) {

      return;

    }


    try {

      const response =
        await fetch(

          `/api/batches/${batchId}`,

          {

            method:
              "DELETE",

          }

        );


      if (!response.ok) {

        throw new Error(
          "Unable to delete batch"
        );

      }


      if (
        selectedBatch === batchId
      ) {

        setSelectedBatch("");

        setBatchData(null);

      }


      if (
        editingBatch === batchId
      ) {

        setEditingBatch("");

        setBatchForm(
          emptyBatch
        );

      }


      setMessage(
        "Batch deleted successfully!"
      );


      await loadBatches();

    }

    catch (error) {

      console.error(
        error
      );


      setMessage(
        "Unable to delete batch"
      );

    }

  };

  /* =========================
     USER ACCESS
  ========================= */

  const manageAccess = async (
    id: string,
    grant: boolean
  ) => {
    const email = prompt(
      "Enter user's registered Gmail address"
    );

    if (!email) return;

    const response = await fetch(
      `/api/batches/${id}/access`,
      {
        method:
          grant ? "POST" : "DELETE",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email,
        }),
      }
    );

    if (response.ok) {
      alert(
        grant
          ? "Batch access granted!"
          : "Batch access revoked!"
      );
    } else {
      alert(
        "Operation failed"
      );
    }
  };

  /* =========================
     LOAD SELECTED BATCH
  ========================= */

  const loadBatchData = async (
    batchId: string
  ) => {
    if (!batchId) {
      setBatchData(null);
      return;
    }

    const response = await fetch(
      `/api/batches/${batchId}`
    );

    const data =
      await response.json();

    setBatchData(data);
  };


  const selectBatch = (
    batchId: string
  ) => {

    setSelectedBatch(batchId);

    setSelectedSection("");

    loadBatchData(
      batchId
    );

    loadBatchTutor(
      batchId
    );

  };

  /* =========================
     CREATE SECTION
  ========================= */

  const createSection = async () => {
    if (!selectedBatch) {
      alert(
        "Please select a batch first"
      );

      return;
    }

    if (!sectionTitle.trim()) {
      alert(
        "Please enter section name"
      );

      return;
    }

    let kind = "CLASS";

    if (manageTab === "Notes") {
      kind = "NOTES";
    }

    if (
      manageTab ===
      "Practice Sheets"
    ) {
      kind = "PRACTICE";
    }

    const response = await fetch(
      `/api/batches/${selectedBatch}/content`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          action: "section",
          kind,
          title: sectionTitle,
        }),
      }
    );

    if (response.ok) {
      setSectionTitle("");

      await loadBatchData(
        selectedBatch
      );

      alert(
        "New section created!"
      );
    } else {
      alert(
        "Unable to create section"
      );
    }
  };

         const editSection =
  async (section: Section) => {

    const title =
      window.prompt(
        "Edit category name:",
        section.title
      );

    if (
      !title ||
      !title.trim()
    ) {
      return;
    }


    const response =
      await fetch(
        `/api/batches/${selectedBatch}/content`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            action:
              "editSection",

            sectionId:
              section.id,

            title:
              title.trim(),

          }),
        }
      );


    if (response.ok) {

      await loadBatchData(
        selectedBatch
      );

      alert(
        "Category updated!"
      );

    } else {

      const data =
        await response.json();

      alert(
        data.error ||
        "Unable to update category"
      );

    }

  };

  const deleteSection =
  async (section: Section) => {

    const confirmed =
      window.confirm(
        `Delete "${section.title}"?

All content inside this category will also be deleted.`
      );


    if (!confirmed) {
      return;
    }


    const response =
      await fetch(
        `/api/batches/${selectedBatch}/content`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            action:
              "deleteSection",

            sectionId:
              section.id,

          }),
        }
      );


    if (response.ok) {

      await loadBatchData(
        selectedBatch
      );

      alert(
        "Category deleted!"
      );

    } else {

      const data =
        await response.json();

      alert(
        data.error ||
        "Unable to delete category"
      );

    }

  };

  /* =========================
     ADD CONTENT ITEM
  ========================= */

  const addContentItem =
    async () => {
      if (!selectedSection) {
        alert(
          "Please select a section"
        );

        return;
      }

      if (!itemTitle.trim()) {
        alert(
          "Please enter title"
        );

        return;
      }

      if (!itemUrl.trim()) {
        alert(
          "Please upload/select a file or enter URL"
        );

        return;
      }

      const response = await fetch(
        `/api/batches/${selectedBatch}/content`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            action: "item",

            sectionId:
              selectedSection,

            title:
              itemTitle,

            url:
              itemUrl,

            fileType:
              itemType,

            scheduledAt:
              itemDate || null,
          }),
        }
      );

      if (response.ok) {
        setItemTitle("");
        setItemUrl("");
        setItemType("");
        setItemDate("");

        await loadBatchData(
          selectedBatch
        );

        alert(
          "Content added successfully!"
        );
      } else {
        alert(
          "Unable to add content"
        );
      }
    };

  /* =========================
   EDIT CONTENT ITEM
========================= */

const editContentItem =
  async (item: any) => {

    const title =
      window.prompt(
        "Edit content title:",
        item.title
      );

    if (
      !title ||
      !title.trim()
    ) {
      return;
    }

    const response =
      await fetch(
        `/api/batches/${selectedBatch}/content`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            action: "editItem",

            itemId: item.id,

            title: title.trim(),

          }),
        }
      );

    if (response.ok) {

      await loadBatchData(
        selectedBatch
      );

      alert(
        "Content updated successfully!"
      );

    } else {

      const data =
        await response.json();

      alert(
        data.error ||
        "Unable to update content"
      );

    }

  };

  /* =========================
   DELETE CONTENT ITEM
========================= */

const deleteContentItem =
  async (item: any) => {

    const confirmed =
      window.confirm(

        `Are you sure you want to delete:

${item.title}`

      );

    if (!confirmed) {
      return;
    }


    const response =
      await fetch(
        `/api/batches/${selectedBatch}/content`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            action: "deleteItem",

            itemId: item.id,

          }),
        }
      );


    if (response.ok) {

      await loadBatchData(
        selectedBatch
      );

      alert(
        "Content deleted successfully!"
      );

    } else {

      const data =
        await response.json();

      alert(
        data.error ||
        "Unable to delete content"
      );

    }

  };
  
  /* =========================
     CREATE NOTIFICATION
  ========================= */

  const createNotification =
    async () => {
      if (!selectedBatch) {
        alert(
          "Please select a batch"
        );

        return;
      }

      if (
        !notificationText.trim() &&
        !notificationUrl
      ) {
        alert(
          "Please enter notification text or add attachment"
        );

        return;
      }

      const response = await fetch(
        `/api/batches/${selectedBatch}/content`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            action:
              "notification",

            text:
              notificationText,

            attachmentUrl:
              notificationUrl,

            attachmentType:
              notificationType,
          }),
        }
      );

      if (response.ok) {
        setNotificationText("");

        setNotificationUrl("");

        setNotificationType("");

        await loadBatchData(
          selectedBatch
        );

        alert(
          "Notification published!"
        );
      } else {
        alert(
          "Unable to publish notification"
        );
      }
    };

/* =========================
   EDIT NOTIFICATION
========================= */

const editNotification =
  async (
    notification: any
  ) => {

    const text =
      window.prompt(
        "Edit announcement:",
        notification.text || ""
      );


    if (text === null) {
      return;
    }


    const response =
      await fetch(
        `/api/batches/${selectedBatch}/content`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            action:
              "editNotification",

            notificationId:
              notification.id,

            text,

          }),
        }
      );


    if (response.ok) {

      await loadBatchData(
        selectedBatch
      );

      alert(
        "Announcement updated!"
      );

    } else {

      const data =
        await response.json();

      alert(
        data.error ||
        "Unable to update announcement"
      );

    }

  };

/* =========================
   DELETE NOTIFICATION
========================= */

const deleteNotification =
  async (
    notification: any
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this announcement?"
      );


    if (!confirmed) {
      return;
    }


    const response =
      await fetch(
        `/api/batches/${selectedBatch}/content`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            action:
              "deleteNotification",

            notificationId:
              notification.id,

          }),
        }
      );


    if (response.ok) {

      await loadBatchData(
        selectedBatch
      );

      alert(
        "Announcement deleted!"
      );

    } else {

      const data =
        await response.json();

      alert(
        data.error ||
        "Unable to delete announcement"
      );

    }

  };

  /* =========================
     FILTER SECTIONS
  ========================= */

  const getSections = (
    kind: string
  ) => {
    if (!batchData?.sections) {
      return [];
    }

    return batchData.sections.filter(
      (section: Section) =>
        section.kind === kind
    );
  };

  /* =========================
     LOGIN PAGE
  ========================= */

  if (!ok) {
    return (
      <>
        <NavClient />

        <main
          className="wrap"
          style={{
            maxWidth: 500,
          }}
        >
          <h1>
            Admin Access
          </h1>

          <div className="card">
            <input
              className="input"
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <button
              className="btn primary"
              onClick={login}
            >
              Continue
            </button>
          </div>
        </main>
      </>
    );
  }

  /* =========================
     MAIN ADMIN DASHBOARD
  ========================= */

  return (
    <>
      <NavClient />

      <main className="wrap">
        <h1>
          LET Admin Dashboard
        </h1>

        <div className="admin-panel">

          {/* SIDEBAR */}

          <aside className="card">
            {[
              "All Users",
              "User Details",
              "Create Batch",
              "Edit / Delete Batch",    
              "Manage Batch",
              "About Tutor",
              "Hero Slider",
              "Chats",
            ].map((item) => (
              <p key={item}>
                <button
                  className="btn"
                  onClick={() => {
                    
                    setTab(item);


                    if (
                      item ===
                      "User Details"
                    ) {

                      loadUsers();

                    }
                    
                  }}
                >
                  {item}
                </button>
              </p>
            ))}
          </aside>

          {/* CONTENT */}

          <section className="card">

            {/* =====================
                ALL USERS
            ===================== */}

            {tab ===
              "All Users" && (
              <>
                <h2>
                  All Users &
                  Batch Access
                </h2>

                <p className="muted">
                  Grant or revoke
                  batch access.
                </p>

                {batches.map(
                  (batch) => (
                    <div
                      className="msg"
                      key={batch.id}
                    >
                      <b>
                        {batch.title}
                      </b>

                      <div className="row">
                        <button
                          className="btn primary"
                          onClick={() =>
                            manageAccess(
                              batch.id,
                              true
                            )
                          }
                        >
                          Grant Access
                        </button>

                        <button
                          className="btn"
                          onClick={() =>
                            manageAccess(
                              batch.id,
                              false
                            )
                          }
                        >
                          Revoke Access
                        </button>
                      </div>
                    </div>
                  )
                )}
              </>
            )}

            {/* =====================
                CREATE BATCH
            ===================== */}

            {tab ===
              "Create Batch" && (
              <>
                <h2>
                  Create Batch
                </h2>

                <input
                  className="input"
                  placeholder="Batch Title"
                  value={
                    batchForm.title
                  }
                  onChange={(e) =>
                    setBatchForm({
                      ...batchForm,
                      title:
                        e.target.value,
                    })
                  }
                />

                <input
                  className="input"
                  placeholder="Class"
                  value={
                    batchForm.className
                  }
                  onChange={(e) =>
                    setBatchForm({
                      ...batchForm,
                      className:
                        e.target.value,
                    })
                  }
                />

                <input
                  className="input"
                  placeholder="Medium"
                  value={
                    batchForm.medium
                  }
                  onChange={(e) =>
                    setBatchForm({
                      ...batchForm,
                      medium:
                        e.target.value,
                    })
                  }
                />

                <input
                  className="input"
                  placeholder="Teacher Name"
                  value={
                    batchForm.teacherName
                  }
                  onChange={(e) =>
                    setBatchForm({
                      ...batchForm,
                      teacherName:
                        e.target.value,
                    })
                  }
                />

                <h3>
                  Important Dates
                </h3>
                
                
                <label>
                  Batch Start Date
                </label>

                <input
                  type="date"
                  className="input"
                  value={
                    batchForm.startDate
                  }
                  onChange={(e) =>
                    setBatchForm({
                      ...batchForm,
                      
                      startDate:
                        e.target.value,
                    })
                  }
                  />


                <label>
                  Batch End Date
                </label>
                
                <input
                  type="date"
                  className="input"
                  value={
                    batchForm.endDate
                  }
                  onChange={(e) =>
                    setBatchForm({
                      ...batchForm,
                      
                      endDate:
                        e.target.value,
                    })
                  }
                  />


                <label>
                  Syllabus Completion Date
                </label>

                <input
                  type="date"
                  className="input"
                  value={
                    batchForm.syllabusDate
                  }
                  onChange={(e) =>
                    setBatchForm({
                      ...batchForm,
                      
                      syllabusDate:
                        e.target.value,
                    })
                  }
                  />
                
                <input
                  className="input"
                  type="number"
                  placeholder="Price"
                  value={
                    batchForm.price
                  }
                  onChange={(e) =>
                    setBatchForm({
                      ...batchForm,
                      price:
                        Number(
                          e.target.value
                        ),
                    })
                  }
                />

                <textarea
                  className="input"
                  placeholder="About Batch"
                  value={
                    batchForm.about
                  }
                  onChange={(e) =>
                    setBatchForm({
                      ...batchForm,
                      about:
                        e.target.value,
                    })
                  }
                />

                <h3>
                  Batch Image
                </h3>

                <FileUpload
                  accept="image/*"
                  label="Upload Batch Image"
                  onUploadComplete={(
                    url
                  ) =>
                    setBatchForm({
                      ...batchForm,
                      imageUrl: url,
                    })
                  }
                />

                {batchForm.imageUrl && (
                  <img
                    src={
                      batchForm.imageUrl
                    }
                    alt="Batch"
                    className="upload-preview"
                  />
                )}

                <h3>
                  Batch Highlights
                </h3>


                <p className="muted">
                  Add up to 20 custom points.
                </p>


                {batchForm.customPoints.map(
                (
                  point: string,
                  index: number
                ) => (
                  
                  <input

                    key={index}

                    className="input"

                    placeholder={
                      `Custom Point ${
                        index + 1
                      }`
                    }

                    value={point}

                    onChange={(e) => {

                      const points = [
                        ...batchForm.customPoints,
                      ];


                      points[index] =
                        e.target.value;


                      setBatchForm({
                        ...batchForm,

                        customPoints:
                          points,
                      });

                    }}

                    />

                )
              )}

                <div className="card">

                  <h3>
                    Purchase Settings
                  </h3>

                  
                  <label>

                    <input

                      type="checkbox"

                      checked={
                        batchForm.buyEnabled
                      }
                      
                      onChange={(e) =>
                        setBatchForm({
                          ...batchForm,

                          buyEnabled:
                            e.target.checked,
                        })
                      }
                      
                      />
                    
                    {" "}

                    Enable Buy Now Button

                  </label>

                </div>

                <button
                  className="btn primary"
                  onClick={createBatch}
                >
                  Create Batch
                </button>

                <p>
                  {message}
                </p>
              </>
            )}

            {/* =====================
    EDIT / DELETE BATCH
===================== */}

{tab ===
  "Edit / Delete Batch" && (

  <>

    <h2>
      Edit / Delete Batch
    </h2>


    <p className="muted">

      Update batch information
      or permanently delete
      a batch.

    </p>


    {/* BATCH LIST */}

    {batches.length === 0 && (

      <p className="muted">

        No batches available.

      </p>

    )}


    {batches.map(
      (batch) => (

        <div
          className="msg"
          key={batch.id}
        >

          <h3>

            {batch.title}

          </h3>


          <p className="muted">

            Class {batch.className}

            {" • "}

            {batch.medium}

          </p>


          <div className="row">


            <button

              className="btn primary"

              onClick={async () => {

                try {

                  const response =
                    await fetch(

                      `/api/batches/${batch.id}`

                    );


                  if (!response.ok) {

                    throw new Error(
                      "Unable to load batch"
                    );

                  }


                  const data =
                    await response.json();


                  setEditingBatch(
                    batch.id
                  );


                  setBatchForm({

                    title:
                      data.title || "",

                    className:
                      data.className || "",

                    medium:
                      data.medium || "Hindi",

                    teacherName:
                      data.teacherName || "Aman",

                    startDate:
                      data.startDate
                        ? new Date(
                            data.startDate
                          )
                            .toISOString()
                            .split("T")[0]
                        : "",

                    endDate:
                      data.endDate
                        ? new Date(
                            data.endDate
                          )
                            .toISOString()
                            .split("T")[0]
                        : "",

                    syllabusDate:
                      data.syllabusDate
                        ? new Date(
                            data.syllabusDate
                          )
                            .toISOString()
                            .split("T")[0]
                        : "",

                    price:
                      data.price || 0,

                    about:
                      data.about || "",

                    imageUrl:
                      data.imageUrl || "",

                    customPoints:
                      Array.isArray(data.customPoints)
                      ? [
                        ...data.customPoints,
                        ...Array(
                          Math.max(
                            0,
                            20 - data.customPoints.length
                          )
                        ).fill(""),
                      ].slice(0, 20)
                      : Array(20).fill(""),

                    buyEnabled:
                      data.buyEnabled !==
                      false,

                  });


                  setMessage("");

                }

                catch (error) {

                  console.error(
                    error
                  );


                  setMessage(
                    "Unable to load batch for editing"
                  );

                }

              }}

            >

              ✏️ Edit

            </button>


            <button

              className="btn"

              onClick={() =>

                deleteBatch(

                  batch.id,

                  batch.title

                )

              }

            >

              🗑️ Delete

            </button>


          </div>

        </div>

      )
    )}


    {/* =====================
        EDIT FORM
    ===================== */}

    {editingBatch && (

      <div
        className="card"
        style={{
          marginTop: "20px",
        }}
      >

        <h2>

          ✏️ Edit Batch

        </h2>


        <input

          className="input"

          placeholder="Batch Title"

          value={
            batchForm.title
          }

          onChange={(e) =>

            setBatchForm({

              ...batchForm,

              title:
                e.target.value,

            })

          }

        />


        <input

          className="input"

          placeholder="Class"

          value={
            batchForm.className
          }

          onChange={(e) =>

            setBatchForm({

              ...batchForm,

              className:
                e.target.value,

            })

          }

        />


        <input

          className="input"

          placeholder="Medium"

          value={
            batchForm.medium
          }

          onChange={(e) =>

            setBatchForm({

              ...batchForm,

              medium:
                e.target.value,

            })

          }

        />


        <input

          className="input"

          placeholder="Teacher Name"

          value={
            batchForm.teacherName
          }

          onChange={(e) =>

            setBatchForm({

              ...batchForm,

              teacherName:
                e.target.value,

            })

          }

        />


        <label>
          Batch Start Date
        </label>

        <input

          type="date"

          className="input"

          value={
            batchForm.startDate
          }

          onChange={(e) =>

            setBatchForm({

              ...batchForm,

              startDate:
                e.target.value,

            })

          }

        />


        <label>
          Batch End Date
        </label>

        <input

          type="date"

          className="input"

          value={
            batchForm.endDate
          }

          onChange={(e) =>

            setBatchForm({

              ...batchForm,

              endDate:
                e.target.value,

            })

          }

        />


        <label>
          Syllabus Completion Date
        </label>

        <input

          type="date"

          className="input"

          value={
            batchForm.syllabusDate
          }

          onChange={(e) =>

            setBatchForm({

              ...batchForm,

              syllabusDate:
                e.target.value,

            })

          }

        />


        <input

          className="input"

          type="number"

          placeholder="Price"

          value={
            batchForm.price
          }

          onChange={(e) =>

            setBatchForm({

              ...batchForm,

              price:
                Number(
                  e.target.value
                ),

            })

          }

        />


        <textarea

          className="input"

          placeholder="About Batch"

          value={
            batchForm.about
          }

          onChange={(e) =>

            setBatchForm({

              ...batchForm,

              about:
                e.target.value,

            })

          }

        />


        <h3>

          Batch Image

        </h3>


        <FileUpload

          accept="image/*"

          label="Change Batch Image"

          onUploadComplete={(url) =>

            setBatchForm({

              ...batchForm,

              imageUrl:
                url,

            })

          }

        />


        {batchForm.imageUrl && (

          <img

            src={
              batchForm.imageUrl
            }

            alt="Batch"

            className="upload-preview"

          />

        )}


        <h3>

          Batch Highlights

        </h3>


        {batchForm.customPoints.map(

          (
            point: string,
            index: number
          ) => (

            <input

              key={index}

              className="input"

              placeholder={
                `Highlight ${index + 1}`
              }

              value={
                point
              }

              onChange={(e) => {

                const points = [

                  ...batchForm.customPoints,

                ];


                points[index] =
                  e.target.value;


                setBatchForm({

                  ...batchForm,

                  customPoints:
                    points,

                });

              }}

            />

          )

        )}


        <label>

          <input

            type="checkbox"

            checked={
              batchForm.buyEnabled
            }

            onChange={(e) =>

              setBatchForm({

                ...batchForm,

                buyEnabled:
                  e.target.checked,

              })

            }

          />

          {" "}

          Enable Buy Now Button

        </label>


        <div
          className="row"
          style={{
            marginTop: "20px",
          }}
        >

          <button

            className="btn primary"

            onClick={
              updateBatch
            }

          >

            💾 Save Changes

          </button>


          <button

            className="btn"

            onClick={() => {

              setEditingBatch("");

              setBatchForm(
                emptyBatch
              );

            }}

          >

            Cancel

          </button>


        </div>


        {message && (

          <p>

            {message}

          </p>

        )}


      </div>

    )}


  </>

)}
          
            {/* =====================
                MANAGE BATCH
            ===================== */}

            {tab ===
              "Manage Batch" && (
              <>
                <h2>
                  Manage Batch
                </h2>

                {/* SELECT BATCH */}

                <select
                  className="input"
                  value={
                    selectedBatch
                  }
                  onChange={(e) =>
                    selectBatch(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select Batch
                  </option>

                  {batches.map(
                    (batch) => (
                      <option
                        key={batch.id}
                        value={batch.id}
                      >
                        {batch.title}
                      </option>
                    )
                  )}
                </select>

                {!selectedBatch && (
                  <p className="muted">
                    Select a batch to
                    manage its content.
                  </p>
                )}

                {selectedBatch && (
                  <>

                    {/* MANAGE TABS */}

                    <div className="tabs">
                      {[
                        "Classes",
                        "Notes",
                        "Practice Sheets",
                        "Notifications",
                        "Batch Tutor",                   
                      ].map((item) => (
                        <button
                          key={item}
                          className="btn"
                          onClick={() => {
                            setManageTab(
                              item
                            );

                            setSelectedSection(
                              ""
                            );
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>

                    {/* =================
                        CLASSES
                    ================= */}

                    {manageTab ===
                      "Classes" && (
                      <>
                        <h2>
                          📚 Classes
                        </h2>

                        <p className="muted">
                          Create custom
                          categories like
                          Physics, Chemistry,
                          Mathematics etc.
                        </p>

                        {/* CREATE CATEGORY */}

                        <div className="card">
                          <h3>
                            ➕ Create Class
                            Category
                          </h3>

                          <input
                            className="input"
                            placeholder="Example: Mathematics"
                            value={
                              sectionTitle
                            }
                            onChange={(e) =>
                              setSectionTitle(
                                e.target.value
                              )
                            }
                          />

                          <button
                            className="btn primary"
                            onClick={
                              createSection
                            }
                          >
                            Create Category
                          </button>
                        </div>

                        {/* EXISTING */}

                        {getSections(
  "CLASS"
).map(
  (
    section: Section
  ) => (
    <div
      className="msg"
      key={section.id}
    >

      <b>
        📁 {section.title}
      </b>

      <p>
        {section.items?.length || 0} Classes
      </p>

      {/* CATEGORY ACTIONS */}

      <div className="admin-action-row">

        <button
          className="btn small"
          onClick={() =>
            editSection(section)
          }
        >
          ✏️ Edit
        </button>

        <button
          className="btn danger small"
          onClick={() =>
            deleteSection(section)
          }
        >
          🗑️ Delete
        </button>

      </div>

      {/* CONTENT ITEMS */}

{section.items?.length > 0 && (

  <div className="admin-items-list">

    {section.items.map(
      (item: any) => (

        <div
          className="admin-content-item"
          key={item.id}
        >

          <div>

            <b>
              📌 {item.title}
            </b>

            {item.scheduledAt && (

              <small>

                <br />

                📅 {
                  new Date(
                    item.scheduledAt
                  ).toLocaleString()
                }

              </small>

            )}

          </div>


          <div className="admin-action-row">

            <button
              className="btn small"
              onClick={() =>
                editContentItem(item)
              }
            >
              ✏️ Edit
            </button>


            <button
              className="btn danger small"
              onClick={() =>
                deleteContentItem(item)
              }
            >
              🗑️ Delete
            </button>

          </div>

        </div>

      )
    )}

  </div>

)}

    </div>
  )
)}                        

                        <hr />

                        <h3>
                          ➕ Add Live Class
                        </h3>

                        <select
                          className="input"
                          value={
                            selectedSection
                          }
                          onChange={(e) =>
                            setSelectedSection(
                              e.target.value
                            )
                          }
                        >
                          <option value="">
                            Select Class
                            Category
                          </option>

                          {getSections(
                            "CLASS"
                          ).map(
                            (
                              section: Section
                            ) => (
                              <option
                                key={
                                  section.id
                                }
                                value={
                                  section.id
                                }
                              >
                                {
                                  section.title
                                }
                              </option>
                            )
                          )}
                        </select>

                        <input
                          className="input"
                          placeholder="Class Title"
                          value={
                            itemTitle
                          }
                          onChange={(e) =>
                            setItemTitle(
                              e.target.value
                            )
                          }
                        />

                        <input
                          className="input"
                          placeholder="Live Class URL"
                          value={
                            itemUrl
                          }
                          onChange={(e) =>
                            setItemUrl(
                              e.target.value
                            )
                          }
                        />

                        <input
                          className="input"
                          type="datetime-local"
                          value={
                            itemDate
                          }
                          onChange={(e) =>
                            setItemDate(
                              e.target.value
                            )
                          }
                        />

                        <button
                          className="btn primary"
                          onClick={
                            addContentItem
                          }
                        >
                          Add Live Class
                        </button>
                      </>
                    )}

                    {/* =================
                        NOTES
                    ================= */}

                    {manageTab ===
                      "Notes" && (
                      <>
                        <h2>
                          📄 Notes
                        </h2>

                        <div className="card">
                          <h3>
                            ➕ Create Notes
                            Category
                          </h3>

                          <input
                            className="input"
                            placeholder="Example: Chapter 1"
                            value={
                              sectionTitle
                            }
                            onChange={(e) =>
                              setSectionTitle(
                                e.target.value
                              )
                            }
                          />

                          <button
                            className="btn primary"
                            onClick={
                              createSection
                            }
                          >
                            Create Category
                          </button>
                        </div>

                        {getSections(
  "NOTES"
).map(
  (
    section: Section
  ) => (

    <div
      className="msg"
      key={section.id}
    >

      <b>
        📁 {section.title}
      </b>

      <p>
        {section.items?.length || 0} PDFs
      </p>


      {/* CATEGORY ACTIONS */}

      <div className="admin-action-row">

        <button
          className="btn small"
          onClick={() =>
            editSection(section)
          }
        >
          ✏️ Edit
        </button>


        <button
          className="btn danger small"
          onClick={() =>
            deleteSection(section)
          }
        >
          🗑️ Delete
        </button>

      </div>


      {/* NOTES LIST */}

      {section.items?.map(
        (item: any) => (

          <div
            className="admin-content-item"
            key={item.id}
          >

            <div>

              <b>
                📄 {item.title}
              </b>

              {item.scheduledAt && (

                <small>

                  <br />

                  📅 {
                    new Date(
                      item.scheduledAt
                    ).toLocaleString()
                  }

                </small>

              )}

            </div>


            <div className="admin-action-row">

              <button
                className="btn small"
                onClick={() =>
                  editContentItem(item)
                }
              >
                ✏️ Edit
              </button>


              <button
                className="btn danger small"
                onClick={() =>
                  deleteContentItem(item)
                }
              >
                🗑️ Delete
              </button>

            </div>

          </div>

        )
      )}

    </div>

  )
)}                        

                        <hr />

                        <h3>
                          ➕ Upload Note
                        </h3>

                        <select
                          className="input"
                          value={
                            selectedSection
                          }
                          onChange={(e) =>
                            setSelectedSection(
                              e.target.value
                            )
                          }
                        >
                          <option value="">
                            Select Notes
                            Category
                          </option>

                          {getSections(
                            "NOTES"
                          ).map(
                            (
                              section: Section
                            ) => (
                              <option
                                key={
                                  section.id
                                }
                                value={
                                  section.id
                                }
                              >
                                {
                                  section.title
                                }
                              </option>
                            )
                          )}
                        </select>

                        <input
                          className="input"
                          placeholder="PDF Title"
                          value={
                            itemTitle
                          }
                          onChange={(e) =>
                            setItemTitle(
                              e.target.value
                            )
                          }
                        />

                        <FileUpload
                          accept="application/pdf"
                          label="Upload PDF Note"
                          onUploadComplete={(
                            url,
                            type,
                            name
                          ) => {
                            setItemUrl(url);

                            setItemType(
                              type
                            );

                            if (
                              !itemTitle
                            ) {
                              setItemTitle(
                                name.replace(
                                  /\.pdf$/i,
                                  ""
                                )
                              );
                            }
                          }}
                        />

                        {itemUrl && (
                          <p className="muted">
                            ✓ PDF selected
                            and uploaded
                          </p>
                        )}

                        <input
                          className="input"
                          type="datetime-local"
                          value={
                            itemDate
                          }
                          onChange={(e) =>
                            setItemDate(
                              e.target.value
                            )
                          }
                        />

                        <button
                          className="btn primary"
                          onClick={
                            addContentItem
                          }
                        >
                          Save Note
                        </button>
                      </>
                    )}

                    {/* =================
                      PRACTICE SHEETS
                    ================= */}

                    {manageTab ===
                      "Practice Sheets" && (
                      <>
                        <h2>
                          📝 Practice Sheets
                        </h2>

                        <div className="card">
                          <h3>
                            ➕ Create Practice
                            Category
                          </h3>

                          <input
                            className="input"
                            placeholder="Example: Weekly Test"
                            value={
                              sectionTitle
                            }
                            onChange={(e) =>
                              setSectionTitle(
                                e.target.value
                              )
                            }
                          />

                          <button
                            className="btn primary"
                            onClick={
                              createSection
                            }
                          >
                            Create Category
                          </button>
                        </div>

                        {getSections(
                          "PRACTICE"
                        ).map(
                          (
                            section: Section
                          ) => (
                            <div
                              className="msg"
                              key={
                                section.id
                              }
                            >
                              <b>
                                📁{" "}
                                {
                                  section.title
                                }
                              </b>

                              <p>
                                {section.items
                                  ?.length ||
                                  0}{" "}
                                Practice Sheets
                              </p>
                              <div className="admin-action-row">

  <button
    className="btn small"
    onClick={() =>
      editSection(section)
    }
  >
    ✏️ Edit
  </button>

  <button
    className="btn danger small"
    onClick={() =>
      deleteSection(section)
    }
  >
    🗑️ Delete
  </button>

</div>

                              {/* PRACTICE ITEMS */}

      {section.items?.map(
        (item: any) => (

          <div
            className="admin-content-item"
            key={item.id}
          >

            <div>

              <b>
                📝 {item.title}
              </b>

              {item.scheduledAt && (

                <small>

                  <br />

                  📅 {
                    new Date(
                      item.scheduledAt
                    ).toLocaleString()
                  }

                </small>

              )}

            </div>


            <div className="admin-action-row">

              <button
                className="btn small"
                onClick={() =>
                  editContentItem(item)
                }
              >
                ✏️ Edit
              </button>


              <button
                className="btn danger small"
                onClick={() =>
                  deleteContentItem(item)
                }
              >
                🗑️ Delete
              </button>

            </div>

          </div>

        )
      )}

                            </div>
                          )
                        )}

                        <hr />

                        <h3>
                          ➕ Upload Practice
                          Sheet
                        </h3>

                        <select
                          className="input"
                          value={
                            selectedSection
                          }
                          onChange={(e) =>
                            setSelectedSection(
                              e.target.value
                            )
                          }
                        >
                          <option value="">
                            Select Practice
                            Category
                          </option>

                          {getSections(
                            "PRACTICE"
                          ).map(
                            (
                              section: Section
                            ) => (
                              <option
                                key={
                                  section.id
                                }
                                value={
                                  section.id
                                }
                              >
                                {
                                  section.title
                                }
                              </option>
                            )
                          )}
                        </select>

                        <input
                          className="input"
                          placeholder="Practice Sheet Title"
                          value={
                            itemTitle
                          }
                          onChange={(e) =>
                            setItemTitle(
                              e.target.value
                            )
                          }
                        />

                        <FileUpload
                          accept="application/pdf"
                          label="Upload Practice PDF"
                          onUploadComplete={(
                            url,
                            type,
                            name
                          ) => {
                            setItemUrl(url);

                            setItemType(
                              type
                            );

                            if (
                              !itemTitle
                            ) {
                              setItemTitle(
                                name.replace(
                                  /\.pdf$/i,
                                  ""
                                )
                              );
                            }
                          }}
                        />

                        {itemUrl && (
                          <p className="muted">
                            ✓ PDF uploaded
                          </p>
                        )}

                        <input
                          className="input"
                          type="datetime-local"
                          value={
                            itemDate
                          }
                          onChange={(e) =>
                            setItemDate(
                              e.target.value
                            )
                          }
                        />

                        <button
                          className="btn primary"
                          onClick={
                            addContentItem
                          }
                        >
                          Save Practice
                          Sheet
                        </button>
                      </>
                    )}

                    {/* =================
                      NOTIFICATIONS
                    ================= */}

                    {manageTab ===
                      "Notifications" && (
                      <>
                        <h2>
                          🔔 Notifications
                        </h2>

                        <textarea
                          className="input"
                          placeholder="Write notification message..."
                          value={
                            notificationText
                          }
                          onChange={(e) =>
                            setNotificationText(
                              e.target.value
                            )
                          }
                        />

                        <h3>
                          ➕ Add Attachment
                        </h3>

                        <FileUpload
                          accept="image/*,audio/*,application/pdf"
                          label="Upload Image / Audio / PDF"
                          onUploadComplete={(
                            url,
                            type
                          ) => {
                            setNotificationUrl(
                              url
                            );

                            setNotificationType(
                              type
                            );
                          }}
                        />

                        {notificationUrl && (
                          <p className="muted">
                            ✓ Attachment
                            uploaded
                          </p>
                        )}

                        <button
                          className="btn primary"
                          onClick={
                            createNotification
                          }
                        >
                          Publish Notification
                        </button>

                        <hr />

                        <h3>
                          Published
                          Notifications
                        </h3>

                        {batchData
                          ?.notifications
                          ?.map(
                            (
                              notification: any
                            ) => (
                              <div
                                className="msg"
                                key={
                                  notification.id
                                }
                              >
                                {notification.text && (
                                  <p>
                                    {
                                      notification.text
                                    }
                                  </p>
                                )}

                                {notification.attachmentUrl && (
                                  <a
                                    href={
                                      notification.attachmentUrl
                                    }
                                    target="_blank"
                                    className="yellow"
                                  >
                                    Open Attachment
                                  </a>
                                )}

                                <br />

                                <small>
                                  {new Date(
                                    notification.createdAt
                                  ).toLocaleString()}
                                </small>

                                <div className="admin-action-row">

  <button
    className="btn small"
    onClick={() =>
      editNotification(
        notification
      )
    }
  >
    ✏️ Edit
  </button>


  <button
    className="btn danger small"
    onClick={() =>
      deleteNotification(
        notification
      )
    }
  >
    🗑️ Delete
  </button>

</div>
                                
                              </div>
                            )
                          )}
                      </>
                    )}

                    {/* =====================
    BATCH TUTOR
===================== */}

{manageTab ===
  "Batch Tutor" && (

  <>

    <h2>

      👨‍🏫 Batch Tutor

    </h2>


    <p className="muted">

      Set a custom tutor for
      this batch.

      If no tutor information
      is saved, the global
      About Tutor will be shown.

    </p>


    {/* IMAGE */}

    <div className="card">

      <h3>

        Tutor Image

      </h3>


      <FileUpload

        accept="image/*"

        label="+ Upload Tutor Image"

        onUploadComplete={(
          url
        ) =>

          setBatchTutorForm({

            ...batchTutorForm,

            imageUrl:
              url,

          })

        }

      />


      {batchTutorForm.imageUrl && (

        <img

          src={
            batchTutorForm.imageUrl
          }

          alt="Tutor"

          className="upload-preview"

        />

      )}

    </div>



    {/* HEADING */}

    <div className="card">

      <h3>

        Main Heading

      </h3>


      <input

        className="input"

        placeholder="Example: About Aman Sir"

        value={
          batchTutorForm.heading
        }

        onChange={(e) =>

          setBatchTutorForm({

            ...batchTutorForm,

            heading:
              e.target.value,

          })

        }

      />


      <label>

        Heading Font Size

      </label>


      <select

        className="input"

        value={
          batchTutorForm.headingSize
        }

        onChange={(e) =>

          setBatchTutorForm({

            ...batchTutorForm,

            headingSize:
              e.target.value,

          })

        }

      >

        <option value="24px">
          Small
        </option>

        <option value="32px">
          Medium
        </option>

        <option value="40px">
          Large
        </option>

        <option value="48px">
          Extra Large
        </option>

      </select>

    </div>



    {/* SUBHEADING */}

    <div className="card">

      <h3>

        Subheading

      </h3>


      <input

        className="input"

        placeholder="Example: Mathematics Teacher"

        value={
          batchTutorForm.subheading
        }

        onChange={(e) =>

          setBatchTutorForm({

            ...batchTutorForm,

            subheading:
              e.target.value,

          })

        }

      />


      <label>

        Subheading Font Size

      </label>


      <select

        className="input"

        value={
          batchTutorForm.subheadingSize
        }

        onChange={(e) =>

          setBatchTutorForm({

            ...batchTutorForm,

            subheadingSize:
              e.target.value,

          })

        }

      >

        <option value="16px">
          Small
        </option>

        <option value="20px">
          Medium
        </option>

        <option value="24px">
          Large
        </option>

        <option value="28px">
          Extra Large
        </option>

      </select>

    </div>



    {/* DESCRIPTION */}

    <div className="card">

      <h3>

        About Tutor

      </h3>


      <textarea

        className="input"

        rows={8}

        placeholder="Write about this tutor..."

        value={
          batchTutorForm.text
        }

        onChange={(e) =>

          setBatchTutorForm({

            ...batchTutorForm,

            text:
              e.target.value,

          })

        }

      />


      <label>

        Text Font Size

      </label>


      <select

        className="input"

        value={
          batchTutorForm.textSize
        }

        onChange={(e) =>

          setBatchTutorForm({

            ...batchTutorForm,

            textSize:
              e.target.value,

          })

        }

      >

        <option value="14px">
          Small
        </option>

        <option value="16px">
          Medium
        </option>

        <option value="18px">
          Large
        </option>

        <option value="20px">
          Extra Large
        </option>

      </select>

    </div>



    {/* LINKS */}

    <div className="card">

      <h3>

        Tutor Links

      </h3>


      {(batchTutorForm.links ||
        []).map(

          (
            link: any,

            index: number

          ) => (

            <div
              key={index}
              className="card"
            >

              <input

                className="input"

                placeholder="Link Title"

                value={
                  link.title ||
                  ""
                }

                onChange={(e) => {

                  const links =
                    [
                      ...batchTutorForm.links,
                    ];


                  links[index] = {

                    ...links[index],

                    title:
                      e.target.value,

                  };


                  setBatchTutorForm({

                    ...batchTutorForm,

                    links,

                  });

                }}

              />


              <input

                className="input"

                placeholder="https://..."

                value={
                  link.url ||
                  ""
                }

                onChange={(e) => {

                  const links =
                    [
                      ...batchTutorForm.links,
                    ];


                  links[index] = {

                    ...links[index],

                    url:
                      e.target.value,

                  };


                  setBatchTutorForm({

                    ...batchTutorForm,

                    links,

                  });

                }}

              />


              <button

                className="btn"

                onClick={() => {

                  const links =
                    batchTutorForm.links.filter(

                      (
                        _: any,

                        i: number

                      ) =>
                        i !== index

                    );


                  setBatchTutorForm({

                    ...batchTutorForm,

                    links,

                  });

                }}

              >

                Remove Link

              </button>

            </div>

          )

        )}


      <button

        className="btn"

        onClick={() =>

          setBatchTutorForm({

            ...batchTutorForm,

            links: [

              ...(
                batchTutorForm.links ||
                []
              ),

              {

                title:
                  "",

                url:
                  "",

              },

            ],

          })

        }

      >

        ➕ Add Link

      </button>

    </div>



    {/* SAVE */}

    <div className="card">

      <button

        className="btn primary"

        onClick={
          saveBatchTutor
        }

      >

        💾 Save Batch Tutor

      </button>


      {batchTutorMessage && (

        <p className="muted">

          {batchTutorMessage}

        </p>

      )}

    </div>

  </>

)}

                    
                  </>
                )}
              </>
            )}


            {/* =====================
                ABOUT TUTOR
            ===================== */}

            {tab ===
  "About Tutor" && (

  <>

    <h2>
      👨‍🏫 About Tutor
    </h2>


    <p className="muted">

      Edit the tutor information
      visible to students inside
      every batch.

    </p>


    {/* =====================
        TUTOR IMAGE
    ===================== */}

    <div className="card">

      <h3>
        Tutor Image
      </h3>


      <FileUpload

        accept="image/*"

        label="+ Upload Tutor Image"

        onUploadComplete={(
          url
        ) =>
          setTutorForm({
            ...tutorForm,

            imageUrl:
              url,
          })
        }

      />


      {tutorForm.imageUrl && (

        <img

          src={
            tutorForm.imageUrl
          }

          alt="Tutor"

          className="upload-preview"

        />

      )}

    </div>


    {/* =====================
        HEADING
    ===================== */}

    <div className="card">

      <h3>
        Main Heading
      </h3>


      <input

        className="input"

        placeholder="Heading"

        value={
          tutorForm.heading
        }

        onChange={(e) =>
          setTutorForm({
            ...tutorForm,

            heading:
              e.target.value,
          })
        }

      />


      <label>
        Heading Font Size
      </label>


      <select

        className="input"

        value={
          tutorForm.headingSize
        }

        onChange={(e) =>
          setTutorForm({
            ...tutorForm,

            headingSize:
              e.target.value,
          })
        }

      >

        <option value="24px">
          Small
        </option>

        <option value="32px">
          Medium
        </option>

        <option value="40px">
          Large
        </option>

        <option value="48px">
          Extra Large
        </option>

      </select>

    </div>


    {/* =====================
        SUBHEADING
    ===================== */}

    <div className="card">

      <h3>
        Subheading
      </h3>


      <input

        className="input"

        placeholder="Subheading"

        value={
          tutorForm.subheading
        }

        onChange={(e) =>
          setTutorForm({
            ...tutorForm,

            subheading:
              e.target.value,
          })
        }

      />


      <label>
        Subheading Font Size
      </label>


      <select

        className="input"

        value={
          tutorForm.subheadingSize
        }

        onChange={(e) =>
          setTutorForm({
            ...tutorForm,

            subheadingSize:
              e.target.value,
          })
        }

      >

        <option value="16px">
          Small
        </option>

        <option value="20px">
          Medium
        </option>

        <option value="24px">
          Large
        </option>

        <option value="28px">
          Extra Large
        </option>

      </select>

    </div>


    {/* =====================
        TEXT
    ===================== */}

    <div className="card">

      <h3>
        About Tutor Text
      </h3>


      <textarea

        className="input"

        placeholder="Write about the tutor..."

        rows={8}

        value={
          tutorForm.text
        }

        onChange={(e) =>
          setTutorForm({
            ...tutorForm,

            text:
              e.target.value,
          })
        }

      />


      <label>
        Text Font Size
      </label>


      <select

        className="input"

        value={
          tutorForm.textSize
        }

        onChange={(e) =>
          setTutorForm({
            ...tutorForm,

            textSize:
              e.target.value,
          })
        }

      >

        <option value="14px">
          Small
        </option>

        <option value="16px">
          Medium
        </option>

        <option value="18px">
          Large
        </option>

        <option value="20px">
          Extra Large
        </option>

      </select>

    </div>


    {/* =====================
        LINKS
    ===================== */}

    <div className="card">

      <h3>
        Tutor Links
      </h3>


      {tutorForm.links.map(
        (
          link: any,
          index: number
        ) => (

          <div
            key={index}
            className="msg"
          >

            <input

              className="input"

              placeholder="Link Title"

              value={
                link.title || ""
              }

              onChange={(e) => {

                const links = [
                  ...tutorForm.links,
                ];


                links[index] = {
                  ...links[index],

                  title:
                    e.target.value,
                };


                setTutorForm({
                  ...tutorForm,

                  links,
                });

              }}

            />


            <input

              className="input"

              placeholder="https://..."

              value={
                link.url || ""
              }

              onChange={(e) => {

                const links = [
                  ...tutorForm.links,
                ];


                links[index] = {
                  ...links[index],

                  url:
                    e.target.value,
                };


                setTutorForm({
                  ...tutorForm,

                  links,
                });

              }}

            />


            <button

              className="btn"

              onClick={() => {

                const links =
                  tutorForm.links.filter(
                    (
                      _: any,
                      i: number
                    ) =>
                      i !== index
                  );


                setTutorForm({
                  ...tutorForm,

                  links,
                });

              }}

            >

              Remove Link

            </button>

          </div>

        )
      )}


      <button

        className="btn"

        onClick={() =>
          setTutorForm({
            ...tutorForm,

            links: [

              ...tutorForm.links,

              {
                title: "",
                url: "",
              },

            ],
          })
        }

      >

        + Add Link

      </button>

    </div>


    {/* =====================
        PREVIEW
    ===================== */}

    <div className="card">

      <h3>
        Live Preview
      </h3>


      {tutorForm.imageUrl && (

        <img

          src={
            tutorForm.imageUrl
          }

          alt="Tutor Preview"

          className="tutor-image"

        />

      )}


      <h2
        style={{
          fontSize:
            tutorForm.headingSize,
        }}
      >

        {tutorForm.heading}

      </h2>


      <h4
        style={{
          fontSize:
            tutorForm.subheadingSize,
        }}
      >

        {tutorForm.subheading}

      </h4>


      <p
        style={{
          fontSize:
            tutorForm.textSize,
        }}
      >

        {tutorForm.text}

      </p>

    </div>


    {/* =====================
        SAVE
    ===================== */}

    <button

      className="btn primary"

      onClick={saveTutor}

    >

      Save About Tutor

    </button>


    {tutorMessage && (

      <p>
        {tutorMessage}
      </p>

    )}

  </>

)}

                {/* =====================
                HERO SLIDER
            ===================== */}

            {tab ===
              "Hero Slider" && (

              <>


                <h2>

                  🖼️ Home Hero Slider

                </h2>


                <p className="muted">

                  Upload up to 15 images.

                  They will automatically change
                  every 3 seconds on the home page.

                </p>


                <p className="muted">

                  {heroSlides.length}

                  {" / 15 images added."}

                </p>


                {/* UPLOAD */}

                {heroSlides.length < 15 && (

                  <FileUpload

                    accept="image/*"

                    label="Upload Hero Image"

                    onUploadComplete={

                      (url) =>

                        addHeroSlide(
                          url
                        )

                    }

                  />

                )}


                {/* EMPTY */}

                {heroSlides.length === 0 ? (

                  <p className="muted">

                    No hero images
                    added yet.

                  </p>

                ) : (

                  <div className="hero-slide-admin-list">


                    {heroSlides.map(

                      (
                        slide,
                        index
                      ) => (

                        <div

                          className="msg hero-slide-admin-item"

                          key={slide.id}

                        >


                          <img

                            src={
                              slide.imageUrl
                            }

                            alt={

                              `Hero image ${index + 1}`

                            }

                          />


                          <div>

                            <b>

                              Hero Image{" "}

                              {index + 1}

                            </b>


                            <p className="muted">

                              Home page
                              slider image

                            </p>

                          </div>


                          <button

                            type="button"

                            className="btn"

                            onClick={() =>

                              removeHeroSlide(
                                slide.id
                              )

                            }

                          >

                            Remove

                          </button>


                        </div>

                      )

                    )}


                  </div>

                )}


                {/* STATUS */}

                {heroMessage && (

                  <p>

                    {heroMessage}

                  </p>

                )}


              </>

            )}

            {/* =====================
            USER DETAILS
            ===================== */}

{tab ===
  "User Details" && (

  <>

    <div
      className="row"
      style={{
        justifyContent:
          "space-between",
        marginBottom:
          20,
      }}
    >

      <div>

        <h2>

          👥 User Details

        </h2>


        <p className="muted">

          View all registered
          users and their
          batch access.

        </p>

      </div>


      <button

        className="btn"

        onClick={
          loadUsers
        }

        disabled={
          usersLoading
        }

      >

        🔄 Refresh

      </button>

    </div>


    {usersMessage && (

      <p>

        {usersMessage}

      </p>

    )}


    {usersLoading ? (

      <p className="muted">

        Loading users...

      </p>

    ) : (

      <div
        style={{

          width:
            "100%",


          overflowX:
            "auto",

        }}
      >

        <table
          className="user-details-table"
        >

          <thead>

            <tr>

              <th>
                Name
              </th>


              <th>
                Gmail
              </th>


              <th>
                Class
              </th>


              <th>
                Mobile No.
              </th>


              <th>
                Account Created
              </th>


              <th>
                Access Batches
              </th>


            </tr>

          </thead>


          <tbody>

            {users.length ===
              0 ? (

              <tr>

                <td
                  colSpan={6}
                >

                  No users found.

                </td>

              </tr>

            ) : (

              users.map(

                (user) => (

                  <tr
                    key={
                      user.id
                    }
                  >

                    <td>

                      <b>

                        {user.name}

                      </b>

                    </td>


                    <td>

                      {user.email}

                    </td>


                    <td>

                      {user.className}

                    </td>


                    <td>

                      {user.phone}

                    </td>


                    <td>

                      {new Date(

                        user.createdAt

                      ).toLocaleString()}

                    </td>


                    <td>

                      {user.batches
                        .length ===
                        0

                        ? (

                          <span
                            className="muted"
                          >

                            No batch access

                          </span>

                        )

                        : (

                          user.batches.map(

                            (
                              batch,
                              index
                            ) => (

                              <span
                                key={index}
                                className="batch-access-tag"
                              >

                                {batch}

                              </span>

                            )

                          )

                        )}

                    </td>


                  </tr>

                )

              )

            )}

          </tbody>

        </table>

      </div>

    )}

  </>

)}

            {/* =====================
            CHATS
            ===================== */}

            {tab ===
              "Chats" && (

                <>

                  <h2>

                    💬 Student Chats

                  </h2>


                  <p className="muted">

                    View student doubts
                    and reply directly.

                  </p>


                  <AdminChatPanel />

                </>

              )}

            </section>

        </div>

      </main>

    </>
  );
}
