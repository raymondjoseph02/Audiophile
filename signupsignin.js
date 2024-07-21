// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged, signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCkIq3tQltY_F0fxi9_POh-2wOT8mkyHsE",
  authDomain: "leaning-firebase-dabab.firebaseapp.com",
  projectId: "leaning-firebase-dabab",
  storageBucket: "leaning-firebase-dabab.appspot.com",
  messagingSenderId: "1052258681421",
  appId: "1:1052258681421:web:19b744af8cf43912b19204",
  measurementId: "G-E4S42ZW3GJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const fullNameRegex = /^[a-zA-Z]+(?:[\s-'][a-zA-Z]+)*$/;
const emailErrorMessage = document.querySelector(".emailerrorMessage");
const nameErrorMessage = document.querySelector(".nameerrormessage");
// const phoneNoErrorMessage = document.querySelector(".phonenoerrorMessage");
const passwordErrorMessage = document.querySelectorAll(".password-error");
const phoneNumberRegex = /^\+?[0-9\s-]{9,11}$/;
const signupform = document.querySelector("#signup-form");
const signUpAllInputTypeText = document.querySelectorAll(
  `#signup-form input[type="text"]`
);
const signUpAllInputTypepassword = document.querySelectorAll(
  `#signup-form input[type="password"]`
);
let password = document.getElementById("signup-password");
console.log(password);
let email = document.getElementById("email");
const comfpassword = document.getElementById("signup-confirm-password");
const pasRegex = /^[a-zA-Z]+(?:[\s-'][a-zA-Z]+)*$/;
const allInput = document.querySelectorAll("#signup-form input");
let uid;

signupform.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (errorMessage()) {
    console.log("i reach here");
    if (await createuser()) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in
          console.log("User is signed in:", user);

          // Store UID in localStorage (optional)
          localStorage.setItem("uid", JSON.stringify(uid));

          // Redirect or perform actions for signed-in user
          // For example, you could redirect to a home page or display user-specific content
          window.location.href = `./index.html?${uid}`;
        } else {
          // User is not signed in
          console.log("No user is signed in.");

          // Redirect to sign-in page or display a message
          window.location.href = "sign-in.html";
        }
      });

      console.log("User ID: ", uid);
    }
  }
});

// function textinputvalidation() {
//   let anyIssue = true;
//   signUpAllInputTypeText.forEach((input) => {
//     if (input.value == "") {
//       input.style.border = "1px solid red";
//       anyIssue = false;
//     }
//   });
//   signUpAllInputTypepassword.forEach((pass) => {
//     if (pass.value == "") {
//       pass.style.border = "1px solid red";
//       anyIssue = false;
//     }
//   });
//   return anyIssue;
// }

function errorMessage() {
  let message = true;
  if (!emailRegex.test(signupform[(name = "email")].value)) {
    emailErrorMessage.style.display = "flex";
    message = false;
  }
  if (!fullNameRegex.test(signupform[(name = "name")].value)) {
    nameErrorMessage.style.display = "flex";
    message = false;
  }
  if (!pasRegex.test(signupform.password.value)) {
    passwordErrorMessage[0].style.display = " flex";
    console.log("password doest match");
    message = false;
  } else {
    passwordErrorMessage[0].style.display = " none";
  }

  if (comfpassword.value !== password.value) {
    passwordErrorMessage[1].style.display = " flex";
    message = false;
  } else {
    passwordErrorMessage[1].style.display = " none";
  }
  return message;
}

allInput.forEach((input) => {
  input.addEventListener("input", () => {
    input.style.border = "1px solid #d87d4a";
  });
});

// document.getElementById('signUpForm').addEventListener('submit', createuser)
async function createuser() {
  let userstatus = false;
  let userPassword = password.value;
  let useremail = email.value;
  console.log(userPassword);
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      useremail,
      userPassword
    );
    // Signed up
    // const user = userCredential.user;
    alert("User created successfully");
    userstatus = true;
    uid = userCredential.user.uid;
    console.log("User ID: ", uid);
    let users = email.value;

    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      createdAt: new Date(),
    });

    console.log("User signed up and Firestore document created successfully");
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    if (
      errorMessage.trim().toLowerCase() ==
      "Firebase: Error (auth/email-already-in-use).".trim().toLowerCase()
    ) {
      alert(`${useremail} already exist`);
    }
    console.log(errorMessage);
  }
  return userstatus;
}

let tosignInBtn = document.getElementById("toSignIn");
tosignInBtn.addEventListener("click", () => {
  console.log("yes");
  let loginForm = document.getElementById("loginForm");
  loginForm.classList.toggle("active");
});

// function togglelogIN() {
//   //
// }

let logInBtn = document.getElementById('logInBtn')

logInBtn?.addEventListener('click',  loginUser)
 

async function loginUser(e) {
  e.preventDefault()
  console.log('loading');
  const email = document.getElementById('signInEmail').value;
  const password = document.getElementById('signInPassword').value;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User logged in:', user);

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      console.log('User document loaded from Firestore:', userDoc.data());
    } else {
      console.log('No user document found in Firestore');
    }

    localStorage.setItem("uid", user.uid);
    window.location.href = `./index.html?${user.uid}`;
  } catch (error) {
    console.error('Error logging in:', error.code, error.message);
  }
}

// document.getElementById("signUpForm").addEventListener("submit", (event) => {
//   event.preventDefault();
//   createUser();
// });

// document.getElementById("logInBtn").addEventListener("click", (event) => {
//   event.preventDefault();
//   loginUser();
// });

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in:", user);
    localStorage.setItem("uid", user.uid);
    if (!window.location.href.includes('index.html')) {
      window.location.href = `./index.html?${user.uid}`;
    }
  } else {
    console.log("No user is signed in.");
  }
});


function displayInCart() {
  let prdInCart = document.getElementById("productInCart");
  prdInCart.innerHTML = "";

  cartArry.forEach((item, index) => {
    prdInCart.innerHTML += `
      <div class="image-price-wrapper">
        <div class="item-image">
          <img src="${item.img}" alt="">
        </div>
        <div class="text-price-wrapper">
          <div class="price">
            <h3>${item.name}</h3>
            <span>$${item.price}</span>
          </div>
        </div>
      </div>
     
    `;
    let nop = document.createElement('div')
  nop.classList.add("nop")
  let newDiv = document.createElement('div')
  nop.appendChild(newDiv)
  
  
  let btnMinus = document.createElement("button")
  let btnAdd = document.createElement("button")
  btnAdd.setAttribute('id', 'addQuantityInCart')
  let itemQty = document.createElement("p")
  itemQty.textContent= `${item.quantity}`
  itemQty.setAttribute('id','itemQty')
  console.log(nop);
  btnMinus.addEventListener('click', minusQuantityInCart)
  btnMinus.textContent='-'
  btnAdd.addEventListener('click', addQuantityInCart)
  btnAdd.textContent='+'
  newDiv.appendChild(btnMinus)
  newDiv.appendChild(itemQty)
  newDiv.appendChild(btnAdd)
  prdInCart.appendChild(nop)
});

  
}







function minusQuantityInCart() {
  cartArry[index].quantity -= 1;
  cartArry[index].price =
    cartArry[index].quantity *
    (cartArry[index].price / (cartArry[index].quantity + 1));
  displayInCart();
  totalPriceInCart()

if (cartArry[index].quantity < 1) {
  console.log( index);
  cartArry.splice(index,1)
  console.log(cartArry);
  displayInCart();
  totalPriceInCart()
}
console.log('minusQuantityInCart');
}

function addQuantityInCart() {

  console.log('addQuantityInCart');


}

displayInCart();
totalPriceInCart()


function totalPriceInCart(){
  let totalPrice = cartArry.reduce((accumulator, currentItem) => {
    return accumulator + (currentItem.price);
  }, 0);
  console.log(totalPrice);
  let prdTotal = document.getElementById("prdTotal")
  prdTotal.textContent = `$${totalPrice}`
}

async function clearCart() {
  let userid = localStorage.getItem('uid')
  const subcollectionRef = collection(db, "users", userid, "cart");
  const querySnapshot = await getDocs(subcollectionRef);

  const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);

  cartArry=[]

  loadCartFromFirestore()
  totalPriceInCart()
}
removeAllFromCart.addEventListener('click', clearCart)


displayInCart()



async function loadCartFromFirestore() {
  try {
    const uid = localStorage.getItem("uid");
    if (uid) {
      const cartCollectionRef = collection(db, "users", uid, "cart");
      const cartSnapshot = await getDocs(cartCollectionRef);

      // Check if cartSnapshot has a forEach method
      if (cartSnapshot.forEach) {
        cartSnapshot.forEach((doc) => {
          let existingProduct = cartArry.find(
            (prod) => prod.name === doc.data().name
          );
          if (existingProduct) {
            // console.log(doc.data());
            existingProduct.quantity = doc.data().quantity;
            existingProduct.price = doc.data().price;
          } else {
            cartArry.push(doc.data());
          }
        });
        // console.log("Cart loaded from Firestore successfully");
        // console.log(cartArry);
      } else {
        console.error("cartSnapshot does not have a forEach method");
      }
    } else {
      console.log("No user is signed in");
    }
  } catch (error) {
    console.error("Error loading cart from Firestore:", error);
  }
  displayInCart()
  totalPriceInCart()
}
loadCartFromFirestore()