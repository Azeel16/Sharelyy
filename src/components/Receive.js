import { doc, getDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
import { db } from '../firebase';
import bgImage from '../assets/bg.jpg'; // Import background image

function Receive() {
  const [code, setCode] = useState('');
  const [file, setFile] = useState(null);

  const handleChange = (code) => {
    setCode(code);
  };

  const handleSubmit = async () => {
    const docRef = doc(db, 'shareRooms', code);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const fileDoc = docSnap.data();
      setFile(fileDoc);
    } else {
      alert('Invalid Code');
    }
  };

  return (
    <div className="overflow-hidden">
      <section
        className="w-screen h-screen bg-center bg-cover"
        style={{
          backgroundImage: `url(${bgImage})`, // Set background image
        }}
      >
        <nav className="flex justify-between p-4">
          <h1 className="font-mono text-2xl font-semibold text-black">Sharely</h1>
        </nav>
        <div className="flex items-center justify-center w-full h-full">
          <div className="flex items-center justify-center w-full mx-auto sm:max-w-lg">
            <div
              className="flex flex-col items-center justify-center w-full my-20 bg-white/30 backdrop-blur-md h-96 sm:w-3/4 sm:rounded-lg sm:shadow-xl"
              style={{ border: '1px solid rgba(255, 255, 255, 0.4)' }}
            >
              {!file ? (
                <>
                  <div className="mt-10 mb-10 text-center">
                    <h2 className="mb-2 text-2xl font-semibold text-black">Enter the File Code</h2>
                    <p className="text-xs text-black-200">Enter the code from the sender to get the file</p>
                  </div>
                  <div>
                    <div className="flex flex-col space-y-16">
                      <div className="flex items-center justify-center">
                        <OtpInput
                          value={code}
                          onChange={handleChange}
                          numInputs={5}
                          renderSeparator={<span style={{ width: '9px' }}></span>}
                          inputStyle={{
                            width: '40px',
                            height: '40px',
                            fontSize: '20px',
                            margin: '0 5px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                            textAlign: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                          }}
                          renderInput={(props) => <input {...props} />}
                        />
                      </div>
                      <div className="flex flex-col space-y-5">
                        <button
                          onClick={handleSubmit}
                          className="px-4 py-2 bg-gradient-to-br from-[#007FFF] to-indigo-200 text-white rounded-lg hover:from-indigo-200 hover:to-[#007FFF] transform transition-all duration-300 hover:scale-110"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-10 mb-10 text-center">
                    <h2 className="mb-2 text-2xl font-semibold text-black">Hurray!!, File Received</h2>
                    <p className="text-xs text-black-200">{file.name}</p>
                  </div>
                  <div className="flex flex-col space-y-5">
                    <a
                      href={file.file}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-gradient-to-br from-[#007FFF] to-indigo-200 text-white rounded-lg hover:from-indigo-200 hover:to-[#007FFF] transform transition-all duration-300 hover:scale-110"
                    >
                      Download File
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Receive;
