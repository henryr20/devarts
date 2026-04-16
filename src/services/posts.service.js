import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
  increment,
  onSnapshot,
  addDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../services/firebase";

const COLLECTION_NAME = "posts";

/**
 * Subscribes to posts collection with real-time updates
 * @param {function} callback - Function to handle the posts data
 * @param {object} options - Optional parameters { sortBy, direction }
 * @param {function} onError - Function to handle errors
 * @returns {function} unsubscribe function
 */
export const subscribeToPosts = (callback, options = {}, onError) => {
  let q;
  if (options.sortBy) {
    q = query(collection(db, COLLECTION_NAME), orderBy(options.sortBy, options.direction || "desc"));
  } else {
    q = query(collection(db, COLLECTION_NAME));
  }
  
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  }, onError);
};

/**
 * Adds a new post to Firestore
 * @param {object} postData - The post data (title, content, category, imageUrl)
 * @returns {Promise}
 */
export const addPost = async (postData) => {
  return await addDoc(collection(db, COLLECTION_NAME), {
    ...postData,
    likes: 0,
    createdAt: serverTimestamp(),
  });
};

/**
 * Updates an existing post
 * @param {string} postId - ID of the post to update
 * @param {object} updateData - Data to update
 * @returns {Promise}
 */
export const updatePost = async (postId, updateData) => {
  const postRef = doc(db, COLLECTION_NAME, postId);
  return await updateDoc(postRef, updateData);
};

/**
 * Increments likes on a post
 * @param {string} postId - ID of the post
 * @returns {Promise}
 */
export const likePost = async (postId) => {
  const postRef = doc(db, COLLECTION_NAME, postId);
  return await updateDoc(postRef, {
    likes: increment(1)
  });
};

/**
 * Deletes a post from Firestore
 * @param {string} postId - ID of the post to delete
 * @returns {Promise}
 */
export const deletePost = async (postId) => {
  const postRef = doc(db, COLLECTION_NAME, postId);
  return await deleteDoc(postRef);
};

/**
 * Fetches all posts once (useful for export)
 * @returns {Promise<Array>}
 */
export const getAllPosts = async () => {
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
