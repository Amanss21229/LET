"use client";

import { useEffect, useState } from "react";

type MaterialPdf = {
  id: string;
  title: string;
  googleDriveUrl: string;
  createdAt: string;
};

type MaterialSubject = {
  id: string;
  name: string;
  materials: MaterialPdf[];
};

type MaterialCategory = {
  id: string;
  name: string;
  subjects: MaterialSubject[];
};

export default function StudyMaterialsAdmin() {
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [categoryName, setCategoryName] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [subjectName, setSubjectName] = useState("");

  const [selectedSubject, setSelectedSubject] = useState("");
  const [materialTitle, setMaterialTitle] = useState("");
  const [driveUrl, setDriveUrl] = useState("");

  const [message, setMessage] = useState("");

  async function loadStudyMaterials() {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/study-materials");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load study materials");
      }

      setCategories(data.categories || []);
    } catch (error) {
      console.error(error);

      setMessage("❌ Failed to load study materials");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudyMaterials();
  }, []);

  async function createCategory() {
    if (!categoryName.trim()) {
      setMessage("⚠️ Please enter a class or stream name");
      return;
    }

    try {
      setMessage("");

      const response = await fetch("/api/study-materials/categories", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: categoryName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create category");
      }

      setCategoryName("");

      setMessage("✅ Category created successfully");

      await loadStudyMaterials();
    } catch (error: any) {
      setMessage(error.message || "❌ Something went wrong");
    }
  }

  async function createSubject() {
    if (!selectedCategory) {
      setMessage("⚠️ Please select a category");
      return;
    }

    if (!subjectName.trim()) {
      setMessage("⚠️ Please enter a subject name");
      return;
    }

    try {
      setMessage("");

      const response = await fetch("/api/study-materials/subjects", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          categoryId: selectedCategory,
          name: subjectName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create subject");
      }

      setSubjectName("");

      setMessage("✅ Subject created successfully");

      await loadStudyMaterials();
    } catch (error: any) {
      setMessage(error.message || "❌ Something went wrong");
    }
  }

  async function createMaterial() {
    if (!selectedSubject) {
      setMessage("⚠️ Please select a subject");
      return;
    }

    if (!materialTitle.trim()) {
      setMessage("⚠️ Please enter material name");
      return;
    }

    if (!driveUrl.trim()) {
      setMessage("⚠️ Please enter Google Drive link");
      return;
    }

    try {
      setMessage("");

      const response = await fetch("/api/study-materials/materials", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          subjectId: selectedSubject,
          title: materialTitle.trim(),
          googleDriveUrl: driveUrl.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add material");
      }

      setMaterialTitle("");
      setDriveUrl("");

      setMessage("✅ Study material added successfully");

      await loadStudyMaterials();
    } catch (error: any) {
      setMessage(error.message || "❌ Something went wrong");
    }
  }

  async function deleteCategory(id: string) {
    const confirmed = window.confirm(
      "Delete this category and all its subjects and materials?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/study-materials/categories?id=${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete category");
      }

      setMessage("✅ Category deleted");

      await loadStudyMaterials();
    } catch (error: any) {
      setMessage(error.message || "❌ Something went wrong");
    }
  }

  async function deleteSubject(id: string) {
    const confirmed = window.confirm(
      "Delete this subject and all its study materials?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/study-materials/subjects?id=${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete subject");
      }

      setMessage("✅ Subject deleted");

      await loadStudyMaterials();
    } catch (error: any) {
      setMessage(error.message || "❌ Something went wrong");
    }
  }

  async function deleteMaterial(id: string) {
    const confirmed = window.confirm(
      "Delete this study material?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/study-materials/materials?id=${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete material");
      }

      setMessage("✅ Study material deleted");

      await loadStudyMaterials();
    } catch (error: any) {
      setMessage(error.message || "❌ Something went wrong");
    }
  }

  const selectedCategoryData = categories.find(
    (category) => category.id === selectedCategory
  );

  return (
    <div className="study-materials-admin">
      <section className="card">
        <h2>📚 Manage Study Materials</h2>

        <p className="muted">
          Create classes or streams, add subjects, and manage
          Google Drive study materials.
        </p>

        {message && (
          <p className="study-material-message">
            {message}
          </p>
        )}
      </section>

      {/* CREATE CATEGORY */}

      <section className="card">
        <h3>1️⃣ Create Class / Stream</h3>

        <p className="muted">
          Examples: Class 10 Board, Class 11 NEET,
          Class 11 JEE, Class 12 Board
        </p>

        <input
          className="input"
          placeholder="Enter Class / Stream Name"
          value={categoryName}
          onChange={(e) =>
            setCategoryName(e.target.value)
          }
        />

        <button
          className="btn primary"
          type="button"
          onClick={createCategory}
        >
          ➕ Create Class / Stream
        </button>
      </section>

      {/* CREATE SUBJECT */}

      <section className="card">
        <h3>2️⃣ Add Subject</h3>

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedSubject("");
          }}
        >
          <option value="">
            Select Class / Stream
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        <input
          className="input"
          placeholder="Subject Name (Example: Physics)"
          value={subjectName}
          onChange={(e) =>
            setSubjectName(e.target.value)
          }
        />

        <button
          className="btn primary"
          type="button"
          onClick={createSubject}
        >
          ➕ Add Subject
        </button>
      </section>

      {/* ADD STUDY MATERIAL */}

      <section className="card">
        <h3>3️⃣ Add Study Material PDF</h3>

        <select
          value={selectedSubject}
          onChange={(e) =>
            setSelectedSubject(e.target.value)
          }
        >
          <option value="">
            Select Subject
          </option>

          {selectedCategoryData?.subjects.map(
            (subject) => (
              <option
                key={subject.id}
                value={subject.id}
              >
                {subject.name}
              </option>
            )
          )}
        </select>

        <input
          className="input"
          placeholder="Study Material Name"
          value={materialTitle}
          onChange={(e) =>
            setMaterialTitle(e.target.value)
          }
        />

        <input
          className="input"
          placeholder="Paste Google Drive PDF Link"
          value={driveUrl}
          onChange={(e) =>
            setDriveUrl(e.target.value)
          }
        />

        <button
          className="btn primary"
          type="button"
          onClick={createMaterial}
        >
          📄 Add Study Material
        </button>

        <p className="muted">
          Upload the PDF to Google Drive first, make it accessible,
          then paste the shareable link here.
        </p>
      </section>

      {/* MANAGE EXISTING MATERIALS */}

      <section className="card">
        <h3>📂 Existing Study Materials</h3>

        {loading && (
          <p className="muted">
            Loading study materials...
          </p>
        )}

        {!loading && categories.length === 0 && (
          <p className="muted">
            No study materials created yet.
          </p>
        )}

        {!loading &&
          categories.map((category) => (
            <div
              className="study-admin-category"
              key={category.id}
            >
              <div className="study-admin-header">
                <h3>
                  📚 {category.name}
                </h3>

                <button
                  className="btn danger small"
                  type="button"
                  onClick={() =>
                    deleteCategory(category.id)
                  }
                >
                  Delete
                </button>
              </div>

              {category.subjects.length === 0 && (
                <p className="muted">
                  No subjects available.
                </p>
              )}

              {category.subjects.map(
                (subject) => (
                  <div
                    className="study-admin-subject"
                    key={subject.id}
                  >
                    <div className="study-admin-header">
                      <h4>
                        📖 {subject.name}
                      </h4>

                      <button
                        className="btn danger small"
                        type="button"
                        onClick={() =>
                          deleteSubject(subject.id)
                        }
                      >
                        Delete Subject
                      </button>
                    </div>

                    {subject.materials.length === 0 && (
                      <p className="muted">
                        No PDFs available.
                      </p>
                    )}

                    {subject.materials.map(
                      (material) => (
                        <div
                          className="admin-content-item"
                          key={material.id}
                        >
                          <div>
                            <strong>
                              📄 {material.title}
                            </strong>

                            <p className="muted">
                              Added:{" "}
                              {new Date(
                                material.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>

                          <button
                            className="btn danger small"
                            type="button"
                            onClick={() =>
                              deleteMaterial(
                                material.id
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )
              )}
            </div>
          ))}
      </section>
    </div>
  );
}
