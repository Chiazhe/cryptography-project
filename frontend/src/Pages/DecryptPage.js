import React, { useState } from "react";
import CryptoJS from "crypto-js";
import { decrypted } from "../function/EncryptDecrypt";
import Navbar from "../Navbar/Navbar";
import axios from "axios";

function DecryptPage() {
  const [baseImage, setBaseImage] = useState(null);
  const [error, setError] = useState(null);
  const [key, setKey] = useState("");
  const [encryptedString, setEncryptedString] = useState("");
  const [urlGenerated, setUrlGenerated] = useState(null);

  function handleDecrypt() {
    if (key.length !== 16) {
      setError("Please enter a key with 16 characters ...");
      return;
    }
    const aesKey = CryptoJS.enc.Utf8.parse(key);
    const decryptedData = decrypted(encryptedString, aesKey);
    setBaseImage(decryptedData);
    console.log(decryptedData);
  }

  const postEncryptedStringToAPI = (tempEncryptedData) => {
    axios
      .post(`https://cryptography-project-4010.herokuapp.com/api/v1/crypto`, {
        encryptedString: tempEncryptedData,
      })
      .then((response) => {
        console.log(response.data);
        setUrlGenerated(`http://localhost:3000/${response.data.hashValue}`);
        // setEncryptedString(response.data.encryptedString);
      })
      .catch((error) => {
        console.log(error);
        // setEncryptedString("Invalid");
      });
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>AES Decryption</h1>
        <div className="encrypt-container">
          <h3>Enter your key and encrpyted string to decrypt</h3>
          <div className="content">
            <label for="key">Please enter your key:</label>
            <input
              id="key"
              type="text"
              onChange={(e) => {
                setKey(e.target.value);
              }}
            />
          </div>
          <div className="content">
            <label for="key">Please enter your encrpyted string:</label>
            <textarea
              id="key"
              onChange={(e) => {
                setEncryptedString(e.target.value);
              }}
            />
          </div>
          <button onClick={() => handleDecrypt()}>Decrypt</button>
          {error != null && (
            <>
              <span>{error}</span>
            </>
          )}
        </div>
        {baseImage != null && (
          <div className="encryption-result">
            <h2>Decrypted Result</h2>
            <img src={baseImage} height="200px" alt="" />
            <button
              onClick={() => {
                postEncryptedStringToAPI(encryptedString);
              }}
            >
              Save to database/Generate URL
            </button>
            {urlGenerated ? (
              <div className="url">
                <p>URL generated: </p>
                <a href={urlGenerated} target="blank">
                  {urlGenerated}
                </a>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
}

export default DecryptPage;
