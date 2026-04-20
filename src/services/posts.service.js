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


export const addPost = async (postData) => {
  return await addDoc(collection(db, COLLECTION_NAME), {
    ...postData,
    likes: 0,
    createdAt: serverTimestamp(),
  });
};


export const updatePost = async (postId, updateData) => {
  const postRef = doc(db, COLLECTION_NAME, postId);
  return await updateDoc(postRef, updateData);
};


export const likePost = async (postId) => {
  const postRef = doc(db, COLLECTION_NAME, postId);
  return await updateDoc(postRef, {
    likes: increment(1)
  });
};


export const deletePost = async (postId) => {
  const postRef = doc(db, COLLECTION_NAME, postId);
  return await deleteDoc(postRef);
};


export const getAllPosts = async () => {
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
