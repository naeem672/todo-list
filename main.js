import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "./firebaseconfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const input = document.getElementById("todoInput");
const list = document.getElementById("todoList");

document.getElementById("addBtn").onclick = async () => {
  if(!input.value) return alert("Pehle kuch likho!");
  await addDoc(collection(db, "todos"), { text: input.value, time: Date.now() });
  input.value = "";
  loadTodos();
};

async function loadTodos(){
  list.innerHTML = "";
  const snap = await getDocs(collection(db, "todos"));
  snap.forEach(d => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${d.data().text}</span>
    <span>
      <button onclick="editTodo('${d.id}','${d.data().text}')">Edit</button>
      <button onclick="deleteTodo('${d.id}')">Delete</button>
    </span>`;
    list.appendChild(li);
  });
}

window.deleteTodo = async (id) => {
  await deleteDoc(doc(db, "todos", id));
  loadTodos();
};

window.editTodo = async (id, oldText) => {
  const newText = prompt("Naya todo likho:", oldText);
  if(newText){
    await updateDoc(doc(db, "todos", id), { text: newText });
    loadTodos();
  }
};

loadTodos();