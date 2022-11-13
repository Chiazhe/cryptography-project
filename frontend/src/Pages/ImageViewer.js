import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { encrypted, decrypted } from "../function/EncryptDecrypt";

export default function ImageViewer() {
	const [baseImage, setBaseImage] = useState(null);
	const [encryptedString, setEncryptedString] = useState(null);
	let { hashValue } = useParams();
	useEffect(() => {
		axios
			.get(
				`https://cryptography-project-4010.herokuapp.com/api/v1/crypto/${hashValue}`
			)
			.then((response) => {
				console.log(response.data);
				setEncryptedString(response.data.encryptedString);
				decryptToImage(response.data.encryptedString);
			})
			.catch((error) => {
				console.log(error);
				setEncryptedString("Invalid");
			});
	}, [hashValue]);

	const decryptToImage = (tempEncryptedData) => {
		setBaseImage(decrypted(tempEncryptedData));
	};

	return (
		<div>
			<div>{`Hash Value: ${hashValue}`}</div>
			<br />
			<div>{`Encrypted String: ${
				encryptedString ? encryptedString : "Loading"
			}`}</div>

			<img src={baseImage} height="200px" alt="" />
		</div>
	);
}
