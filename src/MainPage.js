import React, { useState } from "react";
import "./App.css";
import { encrypted, decrypted } from "./EncryptDecrypt";
import axios from "axios";

function MainPage() {
	const [baseImage, setBaseImage] = useState(null);
	const [tempEncryptedData, setTempEncryptedData] = useState(null);
	const [urlGenerated, setUrlGenerated] = useState(null);

	const uploadImage = async (e) => {
		const file = e.target.files[0];
		const base64 = await convertBase64(file);
		console.log(base64);
		const encryptedData = encrypted(base64);
		console.log(encryptedData);
		//set temporary encrypted data
		setTempEncryptedData(encryptedData);
		const decryptedData = decrypted(encryptedData);
		console.log(decryptedData);
		console.log(base64 === decryptedData);
		setBaseImage(decryptedData);
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

	//post encrypted data to api
	const postEncryptedStringToAPI = (tempEncryptedData) => {
		axios
			.post(
				`https://cryptography-project-4010.herokuapp.com/api/v1/crypto`,
				{ encryptedString: tempEncryptedData }
			)
			.then((response) => {
				console.log(response.data);
				setUrlGenerated(
					`http://localhost:3000/${response.data.hashValue}`
				);
				// setEncryptedString(response.data.encryptedString);
			})
			.catch((error) => {
				console.log(error);
				// setEncryptedString("Invalid");
			});
	};
	return (
		<div className="App">
			<input
				type="file"
				onChange={(e) => {
					uploadImage(e);
				}}
			/>
			<br></br>
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
			) : null}
		</div>
	);
}

export default MainPage;
