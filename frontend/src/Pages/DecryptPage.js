import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { decrypted } from "../function/EncryptDecrypt";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

function DecryptPage() {
  let { hashValue } = useParams();
  const [baseImage, setBaseImage] = useState(null);
  const [isDecryptedSuccess, setIsDecryptedSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [key, setKey] = useState("");
  const [iv, setIv] = useState("");
  const [encryptedString, setEncryptedString] = useState(
    hashValue == null ? "" : "Loading..."
  );
  const [keySize, setKeySize] = useState(16);

  useEffect(() => {
    if (hashValue == null) return;
    axios
      .get(
        `https://cryptography-project-4010.herokuapp.com/api/v1/crypto/${hashValue}`
      )
      .then((response) => {
        console.log(response.data);
        setEncryptedString(response.data.encryptedString);
      })
      .catch((error) => {
        console.log(error);
        setEncryptedString("Invalid");
      });
  }, [hashValue]);

  function handleDecrypt() {
    setIsDecryptedSuccess(false);
    if (key.length !== keySize) {
      setError(`Please enter a key with ${keySize} characters ...`);
      return;
    }
    const aesKey = CryptoJS.enc.Utf8.parse(key);
    const aesIv = CryptoJS.enc.Utf8.parse(iv);
    try {
      const decryptedData = decrypted(encryptedString, aesKey, keySize, aesIv);
      if (decryptedData == null || decryptedData == "") throw "Invalid string";
      setBaseImage(decryptedData);
      setIsDecryptedSuccess(true);
      setError(null);
    } catch (e) {
      setError("Invalid key or string, please check ...");
    }
  }

  const handleChangeKeySize = (e) => {
    setKeySize(parseInt(e.target.value));
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
            <label for="iv">Please enter your initial value (optional):</label>
            <input
              id="iv"
              type="text"
              onChange={(e) => {
                setIv(e.target.value);
              }}
            />
          </div>
          <div className="content">
            <label for="keySize">Please select your key size (bytes):</label>
            <select
              name="keySize"
              id="keySize"
              value={keySize}
              onChange={handleChangeKeySize}
            >
              <option value={16}>16</option>
              <option value={24}>24</option>
              <option value={32}>32</option>
            </select>
          </div>
          <div className="content">
            <label for="key">Please enter your encrpyted string:</label>
            <textarea
              id="key"
              onChange={(e) => {
                setEncryptedString(e.target.value);
              }}
              value={encryptedString}
            />
          </div>
          {error != null && (
            <>
              <span className="error-msg">{error}</span>
            </>
          )}
          <button onClick={() => handleDecrypt()}>Decrypt</button>
        </div>
        {isDecryptedSuccess && (
          <div className="encryption-result">
            <h2>Decrypted Result</h2>
            {/* <img src={baseImage} height="200px" alt="" /> */}
            <button>
              <a
                style={{ textDecoration: "none" }}
                href={baseImage}
                download={`download.${baseImage.match(/[^:/]\w+(?=;|,)/)[0]}`}
              >
                Download
              </a>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default DecryptPage;
