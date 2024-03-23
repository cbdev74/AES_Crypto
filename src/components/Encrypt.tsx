import React, { useEffect, useState } from "react";

const Encrypt: React.FC<any> = ({ setInitVector }: any) => {
  const [file, setFile] = useState<Blob | null>(null);
  const [password, setPassword] = useState<string>("");

  async function encryptFile(file: Blob, password: string) {
    const arrayBuffer = await file.arrayBuffer();
    const passwordBuffer = new TextEncoder().encode(password);
    const importedKey = await window.crypto.subtle.importKey(
      "raw",
      passwordBuffer,
      { name: "AES-CBC", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    setInitVector(iv);
    const encryptedContent = await window.crypto.subtle.encrypt(
      { name: "AES-CBC", iv: iv },
      importedKey,
      arrayBuffer
    );
    return new Blob([encryptedContent], { type: file.type });
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  }

  const downloadEncrypted = () => {
    if (file && password) {
      encryptFile(file, password).then((encryptedBlob) => {
        setFile(encryptedBlob);

        // Create a download link for the encrypted file
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(encryptedBlob);
        downloadLink.download = "encrypted_file";
        document.body.appendChild(downloadLink); // Append to the body to ensure visibility
        downloadLink.click();
        document.body.removeChild(downloadLink); // Clean up
      });
    }
  };

  return (
    <div className="flex flex-col bg-gray-500 p-5 text-white">
      <input
        type="file"
        onChange={handleFileChange}
        className="p-5 rounded-lg bg-gray-700 text-white cursor-pointer"
      />
      <div className="flex">
        <input
          type="text"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-gray-300 p-2 rounded-lg m-5 text-black"
        />
        <div
          className="cursor-pointer p-5 bg-gray-700 m-5 text-center mx-auto rounded-lg"
          onClick={downloadEncrypted}
        >
          Encrypt
        </div>
      </div>
    </div>
  );
};

export default Encrypt;

