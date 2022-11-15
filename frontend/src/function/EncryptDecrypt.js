import CryptoJS from "crypto-js";
// var key = CryptoJS.enc.Utf8.parse('1234567887654321'); //key
// var iv = CryptoJS.enc.Utf8.parse("1234567887654321"); //optional

// function for AES encryption
export const encrypted = (data, key, keySize, initialValue) => {
  console.log("Encrypting ...");
  console.log("KEY: " + key);
  var encryptedData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key, {
    keySize: keySize,
    iv: initialValue,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  var cipherText = initialValue+encryptedData.toString();
  var hmac = CryptoJS.HmacSHA256(cipherText, CryptoJS.SHA256(key)).toString();
  console.log(`hmac: ${hmac}`)

  var transitMessage = hmac + encryptedData;
  console.log(`transitMessage: ${transitMessage}`)

  return transitMessage;
};

// function for AES decryption
export const decrypted = (data, key, keySize, initialValue) => {
  console.log("Decrypting ...");
  console.log("KEY: " + key);
  var transitHmac = data.substring(0, 64);
  var transitEncrptedData = data.substring(64);
  var decryptedHmac = CryptoJS.HmacSHA256(initialValue+transitEncrptedData, CryptoJS.SHA256(key)).toString();
  if (transitHmac != decryptedHmac){
    throw "Invalid iv, or key or string"
  }
  var decryptedData = CryptoJS.AES.decrypt(transitEncrptedData, key, {
    keySize: keySize,
    iv: initialValue,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  console.log(decryptedData);
  return CryptoJS.enc.Utf8.stringify(decryptedData);
};
