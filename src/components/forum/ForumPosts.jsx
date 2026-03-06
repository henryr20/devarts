import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
  increment,
  onSnapshot
} from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { db } from "../../firebase";
import "./ForumPosts.css";

export default function ForumPosts() {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortMode, setSortMode] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(data);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError("Error loading posts. Please check Firebase configuration.");
      setLoading(false);
    });

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

  const handleLike = async (postId) => {
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        likes: increment(1)
      });
    } catch (e) {
      console.error("Error liking post:", e);
    }
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
    <div className="forum-section">
      <h2 style={{ marginBottom: 24, textAlign: 'center' }}>Community Forum</h2>

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
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
