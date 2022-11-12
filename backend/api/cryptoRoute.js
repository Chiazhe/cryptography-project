import express from "express";

import CryptoCtrl from "./cryptoController.js";

const router = express.Router();

router.route("/").post(CryptoCtrl.apiPostEncryptedString);

router.route("/:hashValue").get(CryptoCtrl.apiGetEncryptedStringByHashValue);
export default router;
