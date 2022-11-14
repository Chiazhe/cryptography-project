import CryptoJS from "crypto-js";
// var key = CryptoJS.enc.Utf8.parse('1234567887654321'); //key
var iv = CryptoJS.enc.Utf8.parse('1234567887654321'); //optional

// function for AES encryption
export const encrypted = (data, key,keySize) => {
  console.log("Encrypting ...")
  console.log("KEY: " + key)
  var encryptedData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key,
    {
      keySize: keySize,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  return encryptedData.toString();
};

// function for AES decryption
export const decrypted = (data, key,keySize) => {
  console.log("Decrypting ...")
  console.log("KEY: " + key)
  var decryptedData = CryptoJS.AES.decrypt(data, key,
    {
      keySize: keySize,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    console.log(decryptedData)
  return CryptoJS.enc.Utf8.stringify(decryptedData);
};