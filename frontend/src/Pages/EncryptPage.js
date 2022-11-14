import React, { useState } from "react";
import CryptoJS from "crypto-js";
import { encrypted } from "../function/EncryptDecrypt";
import axios from "axios";
import Navbar from "../Navbar/Navbar";

function MainPage() {
  const [baseImage, setBaseImage] = useState(null);
  const [error, setError] = useState(null);
  const [key, setKey] = useState("");
  const [keySize, setKeySize] = useState(16);

  const [tempEncryptedData, setTempEncryptedData] = useState(null);
  const [urlGenerated, setUrlGenerated] = useState(null);
  const [isEncryptedSuccess, setIsEncryptedSuccess] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setBaseImage(base64);
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

  const handleEncrypt = () => {
    setIsEncryptedSuccess(false);
    setIsEncrypting(true);

    if (key.length !== keySize) {
      setError(`Please enter a key with ${keySize} characters ...`);
      setIsEncrypting(false);
      return;
    }
    if (!baseImage) {
      setError("Please upload the file first ...");
      setIsEncrypting(false);
      return;
    }
    var currentTime = new Date().getTime();
    while (currentTime + 2000 >= new Date().getTime()) {}
    const aesKey = CryptoJS.enc.Utf8.parse(key);
    setError(null);
    const encryptedData = encrypted(baseImage, aesKey,keySize);
    //set temporary encrypted data
    setTempEncryptedData(encryptedData);
    setIsEncryptedSuccess(true);
    setIsEncrypting(false);
  };

  const handleChangeKeySize = (e)=>{
    setKeySize(parseInt(e.target.value))
  }

  // //post encrypted data to api
  const postEncryptedStringToAPI = (tempEncryptedData) => {
    axios
      .post(`https://cryptography-project-4010.herokuapp.com/api/v1/crypto`, {
        encryptedString: tempEncryptedData,
      })
      .then((response) => {
        console.log(response.data);
        setUrlGenerated(`http://localhost:3000/decrypt/${response.data.hashValue}`);
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
        <h1>AES Encryption</h1>
        <div className="encrypt-container">
          <h3>Enter your key and file to encrypt</h3>
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
            <label for="keySize">Please select your key size (bytes):</label>
            <select name="keySize" id="keySize" value={keySize} onChange={handleChangeKeySize}>
              <option value={16}>16</option>
              <option value={24}>24</option>
              <option value={32}>32</option>
            </select>
          </div>
          <div className="content">
            <label for="file">Please upload your file to encrypt:</label>
            <input
              id="file"
              type="file"
              onChange={(e) => {
                uploadImage(e);
              }}
            />
          </div>
          {error != null && (
            <>
              <span className="error-msg">{error}</span>
            </>
          )}
          <button onClick={() => handleEncrypt()}>Encrypt</button>
        </div>

        {isEncrypting ? (
          <p>Encrypting... </p>
        ) : (
          isEncryptedSuccess && (
            <div className="encryption-result">
              <h2>Encrypted Result</h2>
              <textarea
                className="encrpyted-string"
                value={tempEncryptedData}
                id="myInput"
                readonly
              />
              <button
                onClick={() => navigator.clipboard.writeText(tempEncryptedData)}
              >
                Copy text
              </button>

              <button
                onClick={() => {
                  postEncryptedStringToAPI(tempEncryptedData);
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
          )
        )}

        {/* <br></br>
        <img src={baseImage} height="200px" alt="" />

        <br />

        {baseImage ? (
          <button
            onClick={() => {
              postEncryptedStringToAPI(tempEncryptedData);
            }}
          >
            Save to database/Generate URL
          </button>
        ) : null}

        <br />

        {urlGenerated ? (
          <div>
            URL generated: <a href={urlGenerated}>{urlGenerated}</a>
          </div>
        ) : null} */}
      </div>
    </>
  );
}

export default MainPage;
