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
                    status: "Success",
                    hashValue: hashValue,
                    encryptedString: data.encryptedString,
                };
            } else {
                return {
                    status: "Failed",
                    message:
                        "Encrypted string does not exist with the hashValue.",
                };
            }
        } catch (e) {
            console.error(`Unable to connect to cryptoDB database ${e}`);
            return {
                status: "Failed",
                message: e.message,
            };
        }
    }

    static async addEncryptedStringAndHashValue(encryptedString) {
        let hashValue = crypto
            .createHash("sha256")
            .update(encryptedString)
            .digest("hex");
        try {
            console.log(hashValue);
            return await cryptoDB.insertOne({ hashValue, encryptedString });
        } catch (e) {
            console.error(`Unable to create the record: ${e}`);
            return { error: e };
        }
    }
}
