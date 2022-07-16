import React, { FC, SetStateAction, useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import SideBar, { UserDetails } from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import ChatPanel from "./components/ChatPanel";
import {
  collection,
  onSnapshot,
  query,
  limit,
  getDocs,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "./config/firebase_config";
import AddChannel from "./components/AddChannel";
import LoginScreen from "./components/LoginScreen";
import LoginContext, {
  footerDataInterface,
  userInfoInterface,
} from "./Context";
import Footer from "./components/Footer";
import { ChannelObjects } from "./components/Sidebar";
import { onAuthStateChanged } from "firebase/auth";
import useNewMessageContext from "./Context";
import NewMessageCountContext from "./NewMessageCountContext";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

function App() {
  const [userImageUrl, setUserImageUrl] = useState<string>();
  const [addChannel, setAddChannel] = useState<boolean>(false);
  //state managed by userInfo context provider
  const [userInfo, setUserInfo] = useState<userInfoInterface>({
    isLoggedIn: false,
    name: "",
    accId: "",
    email: "",
    password: "",
  });
  const [newMessageCount, setNewMessageCount] = useState<number>(0);
  // const [isAuth, setIsAuth] = useState(false);
  const value = { userInfo, setUserInfo, newMessageCount, setNewMessageCount };
  const newMessageValue = {
    newMessageCount: newMessageCount,
    setNewMessageCount: setNewMessageCount,
  };
  //see context.ts for footerData
  const footerData: footerDataInterface = {
    description:
      "A React/Firebase app made in fulfillment of AvionSchool's Requirements",
    labels: [
      {
        title: "Links",
        links: ["Roman", "Rob"],
        href: ["https://google.com", "https://yahoo.com"],
      },
    ],
  };
  const [file, getFile] = useState<any | null>(null);
  const [currentUserDetails, setCurrentUserDetails] = useState<
    UserDetails | undefined | null
  >(null);
  useEffect(() => {
    try {
      const existing = window.localStorage.getItem("currentUser");
      if (existing) {
        const users = collection(db, "users");
        const req = query(users, where("accId", "==", existing), limit(1));
        getDocs(req)
          .then((res) => res.docs[0].data())
          .then((data) => {
            setUserInfo({
              isLoggedIn: true,
              name: data.name,
              password: data.password,
              email: data.email,
              accId: data.accId,
            });
          });
      }
    } catch (error) {}
  }, [userImageUrl]);

  const storage = getStorage();

  const uploadImage = async () => {
    if (file) {
      const imageRef = ref(
        storage,
        `user-images/${userInfo.accId}/${file.name}`
      );
      const metaData = {
        contentType: file.type,
        contentSize: file.size,
      };
      try {
        const uploadTask = await uploadBytes(imageRef, file, metaData);
        console.log(uploadTask);

        downloadUserImage();
        storeUserImgToFirestore();
      } catch (err: any) {
        console.log(err.message);
      }
    }
  };
  const downloadUserImage = async () => {
    if (file) {
      const imageRef = ref(
        storage,
        `user-images/${userInfo.accId}/${file.name}`
      );
      try {
        const url = await getDownloadURL(imageRef);
        setUserImageUrl(url);
        console.log(url);
      } catch (err: any) {
        console.log(err.message);
      }
    }
  };
  const storeUserImgToFirestore = async () => {
    if (userImageUrl) {
      await updateDoc(doc(db, "users", userInfo.accId), {
        userImage: userImageUrl,
      });
    }
  };
  // const downloadImage = async () => {
  //   console.log("hello");
  //   try {
  //     const url = await getDownloadURL(defaultImageRef);
  //     console.log(url);

  //     setUserImageUrl(url);
  //   } catch (error: any) {
  //     // A full list of error codes is available at
  //     // https://firebase.google.com/docs/storage/web/handle-errors
  //     switch (error.code) {
  //       case "storage/object-not-found":
  //         // File doesn't exist
  //         break;
  //       case "storage/unauthorized":
  //         // User doesn't have permission to access the object
  //         break;
  //       case "storage/canceled":
  //         // User canceled the upload
  //         break;

  //       // ...

  //       case "storage/unknown":
  //         // Unknown error occurred, inspect the server response
  //         break;
  //     }
  //   }
  // };
  // const uploadImage = () => {};
  return (
    <>
      <LoginContext.Provider value={value}>
        <NewMessageCountContext.Provider value={newMessageValue}>
          {!userInfo.isLoggedIn && (
            <div className="h-screen bg-gray-700 grid grid-rows-[70%, 30%] overflow-x-hidden grid-cols-1 justify-end items-end">
              <LoginScreen />
              <Footer {...footerData} />
            </div>
          )}
          {userInfo.isLoggedIn && (
            <div className="overflow-hidden grid grid-rows-[40px,1fr] grid-cols-[260px,1fr] h-screen w-screen ">
              <Header />
              <SideBar
                setAddChannel={setAddChannel}
                userImageUrl={userImageUrl}
                setUserImageUrl={setUserImageUrl}
                downloadUserImage={downloadUserImage}
                setCurrentUserDetails={setCurrentUserDetails}
                currentUserDetails={currentUserDetails}
                getFile={getFile}
                uploadImage={uploadImage}
                file={file}
              />
              {addChannel && (
                <AddChannel
                  setAddChannel={setAddChannel}
                  addChannel={addChannel}
                />
              )}
              <Routes>
                <Route
                  path="/:panelId"
                  element={
                    <ChatPanel
                      userImageUrl={userImageUrl}
                      downloadUserImage={downloadUserImage}
                      currentUserDetails={currentUserDetails}
                    />
                  }
                ></Route>
                <Route
                  path="/"
                  element={<h1>This is a Slack Clone by Team RoRo</h1>}
                ></Route>
              </Routes>
            </div>
          )}
        </NewMessageCountContext.Provider>
      </LoginContext.Provider>
    </>
  );
}

export default App;
