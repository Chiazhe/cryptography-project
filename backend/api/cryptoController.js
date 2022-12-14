import CryptoDAO from "../dao/cryptoDAO.js";

export default class CryptoCtrl {
    static async apiPostEncryptedString(req, res, next) {
        try {
            const encryptedString = req.body.encryptedString;
            const CryptoResponse =
                await CryptoDAO.addEncryptedStringAndHashValue(encryptedString);
            res.json(CryptoResponse);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiGetEncryptedStringByHashValue(req, res, next) {
        try {
            const hashValue = req.params.hashValue;

            const CryptoResponse =
                await CryptoDAO.getEncryptedStringByHashValue(hashValue);

            const { error } = CryptoResponse;

            if (error) {
                return res.status(400).json(CryptoResponse);
            }
            return res.json(CryptoResponse);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}
