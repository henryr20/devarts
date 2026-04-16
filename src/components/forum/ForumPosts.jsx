import { useState, useRef, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faEdit, faTrash, faPlus, faTimes, faFileExport, faFileImport } from '@fortawesome/free-solid-svg-icons';
import {
  subscribeToPosts,
  addPost,
  updatePost,
  deletePost,
  likePost,
  getAllPosts
} from "../../services/posts.service";
import {
  postsToCSV,
  postsToXML,
  downloadFile,
  parseCSV,
  parseXML,
  postsToTSV, parseTSV,
  postsToJSONL, parseJSONL,
  postsToYAML, parseYAML,
  postsToHTML, parseHTML,
  postsToMD, parseMD,
  exportXLSXDownload, parseXLSXArrayBuffer
} from "../../services/data-io.service";
import Modal from "../modal/Modal";
import "./ForumPosts.css";

export default function ForumPosts() {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortMode, setSortMode] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({ title: "", content: "", category: "General" });
  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToPosts(
      (data) => {
        setPosts(data);
        setLoading(false);
      },
      { sortBy: "createdAt", direction: "desc" },
      (err) => {
        console.error(err);
        setError("Error loading posts. Please check Firebase configuration.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(posts.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const text = searchText.trim().toLowerCase();

    let result = posts.filter((p) => {
      const matchCategory =
        selectedCategory === "All" || p.category === selectedCategory;

      const matchText =
        text === "" ||
        (p.title ?? "").toLowerCase().includes(text) ||
        (p.content ?? "").toLowerCase().includes(text);

      return matchCategory && matchText;
    });

    if (sortMode === "mostLiked") {
      result = result.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
    } else {
      result = result.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    }

    return result;
  }, [posts, searchText, selectedCategory, sortMode]);

  const [selectedPostForModal, setSelectedPostForModal] = useState(null);

  const handleLike = async (postId) => {
    try {
      await likePost(postId);
    } catch (e) {
      console.error("Error liking post:", e);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    setError("");
    setUploading(true);
    let imageUrl = null;

    try {
      if (imageFile) {
        if (imageFile.size > 1024 * 1024) {
          throw new Error("Image too large. Please select a file smaller than 1MB.");
        }

        imageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      }

      const postPayload = {
        title: formData.title,
        content: formData.content,
        category: formData.category || "General",
        imageUrl: imageFile ? imageUrl : existingImageUrl
      };

      if (editingId) {
        await updatePost(editingId, postPayload);
        setEditingId(null);
      } else {
        await addPost(postPayload);
      }
      setFormData({ title: "", content: "", category: "General" });
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setIsFormVisible(false);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (post) => {
    setFormData({
      title: post.title || "",
      content: post.content || "",
      category: post.category || "General",
    });
    setEditingId(post.id);
    setExistingImageUrl(post.imageUrl || null);
    setImageFile(null); 
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsFormVisible(true);

    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(postId);
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Error deleting post.");
    }
  };

  const handleExport = async (format) => {
    try {
      setLoading(true);
      const allPosts = await getAllPosts();
      
      if (format === "xlsx") {
        exportXLSXDownload(allPosts, "posts_export.xlsx");
        return;
      }

      let content = "";
      let mimeType = "text/plain";
      let fileName = `posts_export.${format}`;

      if (format === "json") {
        content = JSON.stringify(allPosts, null, 2);
        mimeType = "application/json";
      } else if (format === "csv") {
        content = postsToCSV(allPosts);
        mimeType = "text/csv";
      } else if (format === "xml") {
        content = postsToXML(allPosts);
        mimeType = "application/xml";
      } else if (format === "tsv") {
        content = postsToTSV(allPosts);
        mimeType = "text/tab-separated-values";
      } else if (format === "jsonl") {
        content = postsToJSONL(allPosts);
        mimeType = "application/jsonlines";
      } else if (format === "yaml") {
        content = postsToYAML(allPosts);
        mimeType = "application/x-yaml";
      } else if (format === "html") {
        content = postsToHTML(allPosts);
        mimeType = "text/html";
      } else if (format === "md") {
        content = postsToMD(allPosts);
        mimeType = "text/markdown";
      }

      downloadFile(content, fileName, mimeType);
    } catch (err) {
      console.error("Export error:", err);
      setError("Failed to export data.");
    } finally {
      setLoading(false);
    }
  };

  const processImport = async (importedPosts, targetElement) => {
    try {
      if (!Array.isArray(importedPosts)) {
        importedPosts = [importedPosts];
      }

      let count = 0;
      for (const post of importedPosts) {
        if (post.title && post.content) {
          await addPost({
            title: post.title,
            content: post.content,
            category: post.category || "Imported",
            imageUrl: post.imageUrl || null
          });
          count++;
        }
      }
      alert(`Successfully imported ${count} posts.`);
    } catch (err) {
      console.error("Import processing error:", err);
      setError("Failed to save imported data.");
    } finally {
      setLoading(false);
      if (targetElement) targetElement.value = "";
    }
  };

  const handleImport = (e, format) => {
    const file = e.target.files[0];
    if (!file) return;

    if (format === 'xlsx') {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                setLoading(true);
                const buffer = event.target.result;
                const importedPosts = parseXLSXArrayBuffer(buffer);
                await processImport(importedPosts, e.target);
            } catch (err) {
                console.error("Import error:", err);
                setError("Failed to import data. Check file format.");
                setLoading(false);
            }
        };
        reader.readAsArrayBuffer(file);
        return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setLoading(true);
        const text = event.target.result;
        let importedPosts = [];

        if (format === "json") {
          importedPosts = JSON.parse(text);
        } else if (format === "csv") {
          importedPosts = parseCSV(text);
        } else if (format === "xml") {
          importedPosts = parseXML(text);
        } else if (format === "tsv") {
          importedPosts = parseTSV(text);
        } else if (format === "jsonl") {
          importedPosts = parseJSONL(text);
        } else if (format === "yaml") {
          importedPosts = parseYAML(text);
        } else if (format === "html") {
          importedPosts = parseHTML(text);
        } else if (format === "md") {
          importedPosts = parseMD(text);
        }

        await processImport(importedPosts, e.target);
      } catch (err) {
        console.error("Import error:", err);
        setError("Failed to import data. Check file format.");
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const resetForm = () => {
    setFormData({ title: "", content: "", category: "General" });
    setImageFile(null);
    setExistingImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setEditingId(null);
    setIsFormVisible(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Just now";

    if (typeof timestamp === 'number' && timestamp > 20000000 && timestamp < 21000000) {
      const dateStr = timestamp.toString();
      const year = dateStr.slice(0, 4);
      const month = dateStr.slice(4, 6);
      const day = dateStr.slice(6, 8);
      const date = new Date(`${year}-${month}-${day}`);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    }

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

    if (isNaN(date.getTime())) return "Recent";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <>
      <div className="forum-section">
        <h2 style={{ marginBottom: 24, textAlign: 'center' }} ref={formRef}>Community Forum</h2>

        <div className="data-actions-container" style={{ alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <div className="action-group" style={{ flexWrap: 'wrap', height: 'auto', gap: '8px' }}>
              <span className="action-label" style={{ width: '100%' }}>EXPORT:</span>
              <button className="data-btn" onClick={() => handleExport('json')}>JSON</button>
              <button className="data-btn" onClick={() => handleExport('csv')}>CSV</button>
              <button className="data-btn" onClick={() => handleExport('xml')}>XML</button>
              <button className="data-btn" onClick={() => handleExport('xlsx')}>XLSX</button>
              <button className="data-btn" onClick={() => handleExport('tsv')}>TSV</button>
              <button className="data-btn" onClick={() => handleExport('jsonl')}>JSONL</button>
              <button className="data-btn" onClick={() => handleExport('yaml')}>YAML</button>
              <button className="data-btn" onClick={() => handleExport('html')}>HTML</button>
              <button className="data-btn" onClick={() => handleExport('md')}>MD</button>
            </div>

            <div className="action-group" style={{ flexWrap: 'wrap', height: 'auto', gap: '8px' }}>
              <span className="action-label" style={{ width: '100%' }}>IMPORT:</span>
              <label className="data-btn">JSON<input type="file" accept=".json" onChange={(e) => handleImport(e, 'json')} style={{ display: 'none' }} /></label>
              <label className="data-btn">CSV<input type="file" accept=".csv" onChange={(e) => handleImport(e, 'csv')} style={{ display: 'none' }} /></label>
              <label className="data-btn">XML<input type="file" accept=".xml" onChange={(e) => handleImport(e, 'xml')} style={{ display: 'none' }} /></label>
              <label className="data-btn">XLSX<input type="file" accept=".xlsx,.xls" onChange={(e) => handleImport(e, 'xlsx')} style={{ display: 'none' }} /></label>
              <label className="data-btn">TSV<input type="file" accept=".tsv" onChange={(e) => handleImport(e, 'tsv')} style={{ display: 'none' }} /></label>
              <label className="data-btn">JSONL<input type="file" accept=".jsonl" onChange={(e) => handleImport(e, 'jsonl')} style={{ display: 'none' }} /></label>
              <label className="data-btn">YAML<input type="file" accept=".yaml,.yml" onChange={(e) => handleImport(e, 'yaml')} style={{ display: 'none' }} /></label>
              <label className="data-btn">HTML<input type="file" accept=".html" onChange={(e) => handleImport(e, 'html')} style={{ display: 'none' }} /></label>
              <label className="data-btn">MD<input type="file" accept=".md" onChange={(e) => handleImport(e, 'md')} style={{ display: 'none' }} /></label>
            </div>
          </div>

          <button
            className={`refresh-btn ${isFormVisible ? 'cancel-mode' : ''}`}
            style={{ marginBottom: '0', alignSelf: 'flex-end', marginLeft: '16px' }}
            onClick={() => {
              if (isFormVisible) resetForm();
              else setIsFormVisible(true);
            }}
          >
            <FontAwesomeIcon icon={isFormVisible ? faTimes : faPlus} style={{ marginRight: 8 }} />
            {isFormVisible ? "Cancel" : "Create Post"}
          </button>
        </div>

        {isFormVisible && (
          <form className="create-post-form" onSubmit={handleSubmit}>
            <h3>{editingId ? "Edit Post" : "Create a New Post"}</h3>
            <div className="form-grid">
              <input
                className="form-input"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Post Title (Required)"
                required
              />
              <input
                className="form-input"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Category (e.g. Tips, React, General)"
              />
              <textarea
                className="form-textarea"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="What do you want to share? (Required)"
                required
              />
              <div className="form-image-section">
                <label className="form-label">Post Image</label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="form-input file-input"
                    ref={fileInputRef}
                    id="post-image-input"
                  />
                  <label htmlFor="post-image-input" className="file-input-button">
                    {imageFile ? "Change Image" : (existingImageUrl ? "Replace Current Image" : "Select Image")}
                  </label>
                  {imageFile && (
                    <span className="file-name-badge">
                      {imageFile.name}
                      <button type="button" className="remove-selection-btn" onClick={() => {
                        setImageFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}>
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </span>
                  )}
                </div>

                {(imageFile || existingImageUrl) && (
                  <div className="form-image-preview-container">
                    <img 
                      src={imageFile ? URL.createObjectURL(imageFile) : existingImageUrl} 
                      alt="Preview" 
                      className="form-image-preview" 
                    />
                    <button 
                      type="button" 
                      className="remove-image-btn"
                      onClick={() => {
                        if (imageFile) {
                          setImageFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        } else {
                          setExistingImageUrl(null);
                        }
                      }}
                      title="Remove image"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    {imageFile && (
                      <div className="preview-badge">New Selection</div>
                    )}
                  </div>
                )}
              </div>
              <button type="submit" className="submit-post-btn" disabled={uploading}>
                {uploading ? "Saving..." : (editingId ? "Update Post" : "Submit Post")}
              </button>
            </div>
          </form>
        )}

        <section className="forum-controls">
          <input
            className="search-bar"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search in title or content..."
          />

          <div className="filter-group">
            <select
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "Todas" ? "All" : c}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="mostLiked">Most Liked</option>
            </select>
          </div>
        </section>

        {loading && <p style={{ textAlign: 'center', margin: '40px 0' }}>Loading community posts...</p>}
        {error && <p style={{ color: "crimson", textAlign: 'center' }}>{error}</p>}

        {!loading && !error && (
          <>
            <p style={{ fontSize: '0.9rem', marginBottom: 16, opacity: 0.7 }}>
              Showing <b>{filteredPosts.length}</b> of {posts.length} posts
            </p>

            {filteredPosts.length === 0 ? (
              <p style={{ textAlign: 'center', opacity: 0.5, margin: '40px 0' }}>No posts found with these filters.</p>
            ) : (
              <ul className="posts-list">
                {filteredPosts.map((p) => (
                  <li key={p.id} className="post-card">
                    <div className="post-header">
                      <h3 className="post-title">{p.title}</h3>
                      <span className="post-date">{formatDate(p.createdAt)}</span>
                    </div>

                    <div className="post-meta">
                      <span className="post-category">{p.category}</span>
                    </div>

                    <p className="post-content">
                      {p.content}
                    </p>

                    {p.imageUrl && (
                      <div className="post-image-container" onClick={() => setSelectedPostForModal(p)}>
                        <img src={p.imageUrl} alt="Post attached" className="post-image" />
                      </div>
                    )}

                    <div className="post-footer">
                      <div className="like-section">
                        <button
                          className="like-btn"
                          onClick={() => handleLike(p.id)}
                          aria-label="Like"
                        >
                          <FontAwesomeIcon icon={faHeart} className="like-icon" />
                          <span className="like-count">{p.likes ?? 0}</span>
                        </button>
                      </div>

                      <div className="post-actions" style={{ display: 'flex', gap: 8 }}>
                        <button
                          className="like-btn"
                          onClick={() => handleEdit(p)}
                          style={{ color: '#94a3b8', border: '1px solid rgba(148, 163, 184, 0.2)' }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className="like-btn"
                          onClick={() => handleDelete(p.id)}
                          style={{ color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {selectedPostForModal && (
        <Modal isOpen={!!selectedPostForModal} onClose={() => setSelectedPostForModal(null)}>
          <div className="art-modal-content">
            <img src={selectedPostForModal.imageUrl} alt={selectedPostForModal.title} className="modal-image" />
            <div className="modal-info">
              <h2>{selectedPostForModal.title}</h2>
              <p className="modal-artist">Category: {selectedPostForModal.category}</p>
              <p className="modal-description">{selectedPostForModal.content}</p>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
