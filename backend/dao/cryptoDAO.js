import crypto from "crypto";
let cryptoDB;

export default class CryptoCtrl {
    static async injectDB(conn) {
        if (cryptoDB) {
            return;
        }
        try {
            cryptoDB = await conn
                .db(process.env.CRYPTO_NS)
                .collection("cryptoDB");
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in cryptoDAO: ${e}`
            );
        }
    }

    static async getEncryptedStringByHashValue(hashValue) {
        try {
            const data = await cryptoDB.findOne({
                hashValue: hashValue,
            });
            if (data) {
                return {
                    hashValue: hashValue,
                    encryptedString: data.encryptedString,
                };
            } else {
                return {
                    error: "Encrypted string does not exist with the hashValue.",
                };
            }
        } catch (e) {
            return { error: e };
        }
    }

    static async addEncryptedStringAndHashValue(encryptedString) {
        try {
            let hashValue = crypto
                .createHash("sha256")
                .update(encryptedString)
                .digest("hex");
            await cryptoDB.insertOne({ hashValue, encryptedString });
            return { hashValue };
        } catch (e) {
            console.error(`Unable to create the record: ${e}`);
            return { error: e };
        }
    }
}
