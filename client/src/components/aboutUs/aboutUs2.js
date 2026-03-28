import React, { useState, useCallback } from "react";
import "./aboutUs2.css";
import { TbTargetArrow } from "react-icons/tb";
import { FaEnvelope } from "react-icons/fa";
import { RiMentalHealthFill } from "react-icons/ri";
import { MdPeopleAlt } from "react-icons/md";
import { BiSolidMessageAltDetail } from "react-icons/bi";
import { BiSolidMessageAltAdd } from "react-icons/bi";
import Animation from "../templates/animation";
import FacultyAdvisorMessage from "./sections/facultyAdvisorMessage";
import CounsellorMessage from "./sections/cousellorsMessage";
import AboutSnehita from "./sections/aboutSnehita";
import DeanMessage from "./sections/deanMessage";
import DirectorMessage from "./sections/directorMessage";
import { useAdmin } from "../admin/AdminContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "../services/helper";

// ── Tab → API type mapping ─────────────────────────────────────────────────
const TAB_TYPE_MAP = {
  snehita: "aboutSnehita",
  director: "directorMessage",
  dean: "deanMessage",
  fa: "facultyAdvisorMessage",
  counsellor: "counselorMessage",
};

// ── Admin edit modal for a single org-info entry ───────────────────────────
const AdminEditModal = ({ type, onClose, onSaved }) => {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [editingId, setEditingId] = React.useState(null);
  const [draft, setDraft] = React.useState({});

  const fetchItems = useCallback(async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/admin/organization-info`,
        { withCredentials: true }
      );
      setItems(res.data.filter((i) => i.type === type));
    } catch {
      toast.error("Failed to load entries");
    } finally {
      setLoading(false);
    }
  }, [type]);

  React.useEffect(() => { fetchItems(); }, [fetchItems]);

  const startEdit = (item) => { setEditingId(item.id); setDraft({ ...item }); };
  const cancelEdit = () => { setEditingId(null); setDraft({}); };

  const saveEdit = async () => {
    try {
      await axios.put(
        `${BASE_URL}/api/admin/organization-info/${editingId}`,
        draft,
        { withCredentials: true }
      );
      toast.success("Saved!");
      setEditingId(null);
      fetchItems();
      onSaved();
    } catch { toast.error("Save failed"); }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await axios.delete(
        `${BASE_URL}/api/admin/organization-info/${id}`,
        { withCredentials: true }
      );
      toast.success("Deleted");
      fetchItems();
      onSaved();
    } catch { toast.error("Delete failed"); }
  };

  const addNew = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/admin/organization-info`,
        { type, title: "New Entry", description: "Enter description here..." },
        { withCredentials: true }
      );
      toast.success("Entry added");
      fetchItems();
      onSaved();
    } catch { toast.error("Could not add entry"); }
  };

  return (
    <div className="aum-overlay" onClick={onClose}>
      <div className="aum-modal" onClick={(e) => e.stopPropagation()}>
        <div className="aum-modal-head">
          <h5 className="aum-modal-title">✏️ Edit Section</h5>
          <button className="aum-modal-x" onClick={onClose}>✕</button>
        </div>

        <div className="aum-modal-body">
          {loading && <p className="text-muted">Loading…</p>}
          {!loading && items.length === 0 && (
            <p className="text-muted">No entries for this section yet.</p>
          )}
          {items.map((item) =>
            editingId === item.id ? (
              <div className="aum-edit-block" key={item.id}>
                <div className="aum-field">
                  <label>Title</label>
                  <input
                    type="text"
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  />
                </div>
                <div className="aum-field">
                  <label>Description / Message</label>
                  <textarea
                    rows={8}
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  />
                </div>
                <div className="aum-btn-row">
                  <button className="aum-btn aum-btn-primary" onClick={saveEdit}>Save</button>
                  <button className="aum-btn aum-btn-outline" onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="aum-entry" key={item.id}>
                <div className="aum-entry-content">
                  <strong>{item.title}</strong>
                  <p className="aum-entry-desc">{item.description?.slice(0, 120)}…</p>
                </div>
                <div className="aum-entry-actions">
                  <button className="aum-ctrl-edit" onClick={() => startEdit(item)}>✏️ Edit</button>
                  <button className="aum-ctrl-del" onClick={() => deleteItem(item.id)}>🗑️</button>
                </div>
              </div>
            )
          )}
        </div>

        <div className="aum-modal-foot">
          <button className="aum-btn aum-btn-outline" onClick={addNew}>+ Add Entry</button>
          <button className="aum-btn aum-btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────
const AboutUs2Page = () => {
  const { isAdmin } = useAdmin();
  const [editingTab, setEditingTab] = useState(null); // which tab's modal is open
  const [reloadKey, setReloadKey] = useState(0);      // force sub-components to re-fetch

  const openEdit = (tabId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingTab(tabId);
  };

  const handleSaved = () => setReloadKey((k) => k + 1);

  // Helper: render an edit button next to the tab if admin
  const EditBtn = ({ tabId }) =>
    isAdmin ? (
      <button
        className="aum-edit-tab-btn"
        onClick={(e) => openEdit(tabId, e)}
        title="Edit this section"
      >
        ✏️
      </button>
    ) : null;

  return (
    <section className="py-5" data-aos="zoom-in">
      <div className="container">
        <div className="row page-heading">
          <p className="page-head">ABOUT US</p>
        </div>
        <div className="row">
          <div className="nav-bar-back px-0">
            <ul
              className="nav nav-pills mb-3 mx-1 justify-content-center"
              id="pills-tab"
              role="tablist"
            >
              {/* ── Snehita ── */}
              <li className="nav-item" role="presentation">
                <div className="aum-tab-wrap">
                  <button
                    className="nav-link active aboutUsFilter"
                    id="pills-snehita-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-snehita"
                    type="button"
                    role="tab"
                    aria-controls="pills-snehita"
                    aria-selected="true"
                  >
                    <div className="postion-relative justify-content-center">
                      <RiMentalHealthFill size={35} />
                    </div>
                    SNEHITA
                  </button>
                  <EditBtn tabId="snehita" />
                </div>
              </li>

              {/* ── Director ── */}
              <li className="nav-item" role="presentation">
                <div className="aum-tab-wrap">
                  <button
                    className="nav-link aboutUsFilter"
                    id="pills-director-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-director"
                    type="button"
                    role="tab"
                    aria-controls="pills-director"
                    aria-selected="false"
                  >
                    <div className="d-flex flex-column position-relative">
                      <div className="postion-relative justify-content-center">
                        <BiSolidMessageAltDetail size={35} />
                      </div>
                      DIRECTOR'S MESSAGE
                    </div>
                  </button>
                  <EditBtn tabId="director" />
                </div>
              </li>

              {/* ── Dean ── */}
              <li className="nav-item" role="presentation">
                <div className="aum-tab-wrap">
                  <button
                    className="nav-link aboutUsFilter"
                    id="pills-dean-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-dean"
                    type="button"
                    role="tab"
                    aria-controls="pills-dean"
                    aria-selected="false"
                  >
                    <div className="d-flex flex-column position-relative">
                      <div className="postion-relative justify-content-center">
                        <BiSolidMessageAltDetail size={35} />
                      </div>
                      DEAN'S MESSAGE
                    </div>
                  </button>
                  <EditBtn tabId="dean" />
                </div>
              </li>

              {/* ── Faculty Advisor ── */}
              <li className="nav-item" role="presentation">
                <div className="aum-tab-wrap">
                  <button
                    className="nav-link aboutUsFilter"
                    id="pills-fa-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-fa"
                    type="button"
                    role="tab"
                    aria-controls="pills-fa"
                    aria-selected="false"
                  >
                    <div className="d-flex flex-column position-relative">
                      <div className="postion-relative justify-content-center">
                        <FaEnvelope size={35} />
                      </div>
                    </div>
                    FACULTY ADVISORS'S MESSAGE
                  </button>
                  <EditBtn tabId="fa" />
                </div>
              </li>

              {/* ── Counsellor ── */}
              <li className="nav-item" role="presentation">
                <div className="aum-tab-wrap">
                  <button
                    className="nav-link aboutUsFilter"
                    id="pills-counsellor-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-counsellor"
                    type="button"
                    role="tab"
                    aria-controls="pills-counsellor"
                    aria-selected="false"
                  >
                    <div className="d-flex flex-column position-relative">
                      <div className="postion-relative justify-content-center">
                        <BiSolidMessageAltAdd size={35} />
                      </div>
                      COUNSELLOR'S MESSAGE
                    </div>
                  </button>
                  <EditBtn tabId="counsellor" />
                </div>
              </li>
            </ul>
          </div>

          <div className="tab-content" id="pills-tabContent">
            <div className="tab-pane fade show active" id="pills-snehita" role="tabpanel" aria-labelledby="pills-snehita-tab" tabIndex="0">
              <div className="col-12 text-start">
                <div className="lead text-black">
                  <AboutSnehita key={`snehita-${reloadKey}`} />
                </div>
              </div>
            </div>

            <div className="tab-pane fade" id="pills-director" role="tabpanel" aria-labelledby="pills-director-tab" tabIndex="0">
              <div className="col-12 text-start">
                <div className="lead text-black">
                  <DirectorMessage key={`director-${reloadKey}`} />
                </div>
              </div>
            </div>

            <div className="tab-pane fade" id="pills-dean" role="tabpanel" aria-labelledby="pills-dean-tab" tabIndex="0">
              <div className="col-12 text-start">
                <div className="lead text-black">
                  <DeanMessage key={`dean-${reloadKey}`} />
                </div>
              </div>
            </div>

            <div className="tab-pane fade" id="pills-fa" role="tabpanel" aria-labelledby="pills-fa-tab" tabIndex="0">
              <div className="lead text-black">
                <FacultyAdvisorMessage key={`fa-${reloadKey}`} />
              </div>
            </div>

            <div className="tab-pane fade" id="pills-counsellor" role="tabpanel" aria-labelledby="pills-counsellor-tab" tabIndex="0">
              <div className="lead text-black">
                <CounsellorMessage key={`counsellor-${reloadKey}`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Edit Modal */}
      {editingTab && (
        <AdminEditModal
          type={TAB_TYPE_MAP[editingTab]}
          onClose={() => setEditingTab(null)}
          onSaved={handleSaved}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  );
};

export default AboutUs2Page;
