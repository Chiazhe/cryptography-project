import React, { useState,useEffect } from "react";
import CryptoJS from "crypto-js";
import { decrypted } from "../function/EncryptDecrypt";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";

function DecryptPage() {
  let { hashValue } = useParams();
  const [baseImage, setBaseImage] = useState(null);
  const [isDecryptedSuccess, setIsDecryptedSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [key, setKey] = useState("");
  const [encryptedString, setEncryptedString] = useState(hashValue==null?"":"Loading...");

	useEffect(() => {
    if(hashValue==null) return
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
    if (key.length !== 16) {
      setError("Please enter a key with 16 characters ...");
      return;
    }
    const aesKey = CryptoJS.enc.Utf8.parse(key);
    try{
      const decryptedData = decrypted(encryptedString, aesKey);
      setBaseImage(decryptedData);
      setIsDecryptedSuccess(true);
      setError(null)
    }catch(e){
      setError("Invalid key or string, please check ...");
    }

  }

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
            <a href={baseImage} download={`download.${baseImage.match(/[^:/]\w+(?=;|,)/)[0]}`}>Download</a>

          </div>
        )}
      </div>
    </>
  );
}

export default DecryptPage;
