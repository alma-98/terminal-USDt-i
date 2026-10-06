import {
  collection,
  doc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "../config/firebase.js";

export function collectionRef(name) {
  return collection(db, name);
}

export function documentRef(collectionName, id) {
  return doc(db, collectionName, id);
}

export function timestamp() {
  return serverTimestamp();
}
