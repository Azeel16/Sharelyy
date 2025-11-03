import { Route, Routes, useNavigate } from "react-router-dom";
import Hero from "./components/Hero";
import Home from "./components/Home";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import Send from "./components/Send";
import Receive from "./components/Receive";

function App() {
  const [authUser, setAuthUser] = useState({});

  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const onSignIn = () => {
    signInWithPopup(auth, googleProvider).then(async(user) => {
      setDoc(
        doc(db,"users", user?.user.uid),
        {
          name: user.user.displayName,
          email: user.user.email,
          photoURL: user.user.photoURL,
          uid: user.user.uid
        },
        {merge: true}
      ).then(() => {
        setAuthUser(
          {
            name: user.user.displayName,
            email: user.user.email,
            photoURL: user.user.photoURL,
            uid: user.user.uid
          }
        )
        navigate('/home');
      }).catch((error) => {
        console.log(error.message);
      });
    }).catch((error) => {
      console.log(error.message);
    });
  }

  const onSignOut = () => {
    signOut(auth).then(() => {
      navigate('/');
      setAuthUser({});
    }
    ).catch((error) => {
      console.log(error.message);
    });
  }
  return (
    <Routes>
      <Route path="/" element={<Hero onSignIn={onSignIn} />} />
      <Route path="/home" element={<Home authUser={authUser} onSignOut={onSignOut} />} />
      <Route path="/send" element={<Send />} />
      <Route path="/receive" element={<Receive/>} />
    </Routes>
  );
}

export default App;
