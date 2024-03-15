import Encrypt from "./components/Encrypt";
import Decrypt from "./components/Decrypt";
import { useState } from "react";

function App() {
  const [initVector, setInitVector] = useState<Uint8Array | null>(null);

  return (
    <div className="flex items-center gap-20 h-screen w-full items-center justify-center bg-black">
      <div>
        <h1 className="text-white text-3xl pb-5">Encryption</h1>
        <Encrypt setInitVector={setInitVector} />
      </div>
      <div>
        <h1 className="text-white text-3xl pb-5">Decryption</h1>
        <Decrypt initVector={initVector} />
      </div>
    </div>
  );
}

export default App;
