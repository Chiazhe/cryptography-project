import React, { useState } from "react";
import "./App.css";
import { encrypted, decrypted } from "./EncryptDecrypt";

function App() {
  const [baseImage, setBaseImage] = useState("");

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    console.log(base64);
    const encryptedData = encrypted(base64);
    console.log(encryptedData);
    const decryptedData = decrypted(encryptedData);
    console.log(decryptedData);
    console.log(base64 === decryptedData)
    setBaseImage(decryptedData);
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <div className="App">
      <input
        type="file"
        onChange={(e) => {
          uploadImage(e);
        }}
      />
      <br></br>
      <img src={baseImage} height="200px" alt="" />
    </div>
  );
}

export default App;
