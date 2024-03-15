import React, { useState } from "react";

const Decrypt: React.FC<any> = ({ initVector }: any) => {
  const [file, setFile] = useState<Blob | null>(null);
  const [password, setPassword] = useState<string>("");

  async function decryptFile(file: Blob, password: string, iv: Uint8Array) {
    const arrayBuffer = await file.arrayBuffer();
    const passwordBuffer = new TextEncoder().encode(password);
    const importedKey = await window.crypto.subtle.importKey(
      "raw",
      passwordBuffer,
      { name: "AES-CBC", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
    const decryptedContent = await window.crypto.subtle.decrypt(
      { name: "AES-CBC", iv: iv },
      importedKey,
      arrayBuffer
    );
    return new Blob([decryptedContent], { type: file.type });
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  }

  const downloadDecrypted = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const arrayBuffer = e.target?.result;
        if (arrayBuffer) {
          decryptFile(new Blob([arrayBuffer]), password, initVector).then(
            (decryptedBlob) => {
              setFile(decryptedBlob);
            }
          );
        }
      };
      reader.readAsArrayBuffer(file);
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(file);
      downloadLink.download = "decrypted_file";
      downloadLink.click();
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
          onClick={() => downloadDecrypted()}
        >
          Decrypt
        </div>
      </div>
    </div>
  );
};

export default Decrypt;
