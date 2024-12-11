import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  where,
  runTransaction,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDk8MjdL026xQWLb_8S1wjOrXNOHLs-y5M",
  authDomain: "summerdiary-ddf42.firebaseapp.com",
  projectId: "summerdiary-ddf42",
  storageBucket: "summerdiary-ddf42.appspot.com",
  messagingSenderId: "947705431560",
  appId: "1:947705431560:web:c6f143ee2a710c5e20f3bd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function getCollection(collectionName) {
  return collection(db, collectionName);
}

export function getUserAuth() {
  //  async 필요 없음. const auth = getAuth(app);에서 그대로 가져옴
  return auth;
}

async function getLastNum(collectionName, field) {
  const q = query(
    collection(db, collectionName),
    orderBy(field, "desc"),
    limit(1)
  );
  const lastDoc = await getDocs(q);
  if (lastDoc.docs.length === 0) {
    return 0;
  }
  const lastNum = lastDoc.docs[0].data()[field];
  return lastNum;
}

function getQuery(collectionName, queryOption) {
  const { conditions = [], orderBys = [], limits } = queryOption;
  const collect = getCollection(collectionName);
  let q = query(collect);

  const condition = [
    { field: "text", operator: "==", value: "test" },
    { field: "uid", operator: "==", value: "xjdiwjKDJ2jdkxJND2J" },
  ];

  // where 조건
  conditions.forEach((condition) => {
    q = query(q, where(condition.field, condition.operator, condition.value));
  });

  // orderBy 조건
  orderBys.forEach((order) => {
    q = query(q, orderBy(order.field, order.direction || "asc"));
  });

  // limit 조건
  q = query(q, limit(limits));

  return q;
}

export async function addDatas(collectionName, addObj) {
  // export 아래에 넣는 거 까먹으면 위에 넣어서 붙여도 됨
  try {
    const resultData = await runTransaction(db, async (tr) => {
      const lastId = (await getLastNum(collectionName, "id")) + 1;
      addObj.id = lastId;
      const docRef = await addDoc(getCollection(collectionName), addObj);
      const snapshot = await getDoc(docRef);
      const docData = snapshot.exists()
        ? { ...snapshot.data(), docId: snapshot.id }
        : null;
      return docData;
    });
    return resultData;
    //    return resultData; 서로 다른 거다.  => 하나 docData로 변경됨
    // 이 내용 포트폴리오에 넣기 좋다.
  } catch (error) {
    console.log("Error transaction: ", error);
  }
}

export async function getDatas(collectionName, queryOptions) {
  // 남이 쓴 일기 말고 내 꺼만 볼 수 있게 하는 거 겟 쿼리 위에 가져와야됨
  const q = getQuery(collectionName, queryOptions);
  const snapshot = await getDocs(q);
  const docs = snapshot.docs;
  const resultData = docs.map((doc) => ({ ...doc.data(), docId: doc.id }));
  return resultData;
}

export async function updateDatas(collectionName, docId, updateObj) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, updateObj);
    const snapshot = await getDoc(docRef);
    const resultData = { ...snapshot.data(), docId: snapshot.id };
    return resultData;
    // { ...snapshot.data(), docId: snapshot.id } 수정된 정보를 반환해줌
  } catch (error) {
    // 여기서는 콘솔만 찍었음
    console.log("Error Update:", error);
  }
}

export async function deleteDatas(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.log("Error Delete:", error);
  }
}
