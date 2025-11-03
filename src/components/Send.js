import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { collection, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import BackgroundImage from '../assets/bg.jpg'; // Import the background image

function Send() {
    const [fileName, setFileName] = useState(null);
    const [progressPrecent, setProgressPercent] = useState(0);
    const [fileUrl, setFileUrl] = useState(null);
    const [fileUpload, setFileUpload] = useState(false);
    const [shareCode, setShareCode] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const file = e.target[0]?.files[0];
        if (!file) return;
        const strogaeRef = ref(storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(strogaeRef, file);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgressPercent(progress);
            },
            console.error,
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    setFileUrl(downloadURL);
                    const shareId = await getRandShareId();
                    await setDoc(
                        doc(db, 'shareRooms', shareId),
                        {
                            name: fileName,
                            file: downloadURL,
                            received: false,
                            createdAt: serverTimestamp(),
                        },
                        { merge: true }
                    )
                        .then(() => {
                            setFileUpload(true);
                            setShareCode(shareId);
                        })
                        .catch(console.error);
                });
            }
        );
    };

    const changeHandler = (e) => {
        if (e.target.files.length > 0) {
            const filename = e.target.files[0].name;
            setFileName(filename);
        }
    };

    const getRandShareId = async () => {
        const min = 10000;
        const max = 99999;
        const rand = Math.floor(min + Math.random() * (max - min));
        const collectionRef = collection(db, 'shareRooms');
        const q = await getDocs(collectionRef);
        const ids = q.docs.map((doc) => doc.id);
        return ids.includes(String(rand)) ? getRandShareId() : String(rand);
    };

    return (
        <div className="overflow-hidden">
            <section
                className="flex flex-col w-screen h-screen"
                style={{
                    backgroundImage: `url(${BackgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <nav className="flex justify-between p-4">
                    <h1 className="font-mono text-2xl font-semibold text-black">Sharely</h1>
                </nav>
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="flex items-center justify-center w-full mx-auto sm:max-w-lg">
                        <div
                            className="flex flex-col items-center justify-center w-full shadow-xl h-96 sm:w-3/4 sm:rounded-lg"
                            style={{
                                backdropFilter: 'blur(10px)',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            {!fileUpload ? (
                                <>
                                    <div className="mt-10 mb-10 text-center">
                                        <h2 className="mb-2 text-2xl font-semibold text-black">Upload your files</h2>
                                        <p className="text-xs text-black-300">File should be of format .pdf, .docx, .xlsx or .txt</p>
                                    </div>
                                    <form
                                        onSubmit={handleSubmit}
                                        className="relative w-4/5 h-32 max-w-xs mb-10 rounded-lg shadow-inner bg-gray-200/30"
                                    >
                                        <input type="file" id="file-upload" className="hidden" onChange={changeHandler} />
                                        <label
                                            htmlFor="file-upload"
                                            className="z-20 flex flex-col-reverse items-center justify-center w-full h-full cursor-pointer"
                                        >
                                            {!fileName ? (
                                                <>
                                                    <p className="z-10 text-xs font-light text-center text-black-300">
                                                        Drag & Drop your files here
                                                    </p>
                                                    <svg
                                                        className="z-10 w-8 h-8 text-#FFFDD0-300"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                                                    </svg>
                                                </>
                                            ) : (
                                                <p className="text-black">{fileName}</p>
                                            )}
                                        </label>
                                        <div className="flex flex-col items-center justify-center mt-5 mb-5">
                                            {!fileUrl ? (
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 text-black bg-gradient-to-br from-[#007FFF] to-indigo-200 rounded-lg hover:scale-110 transition-all"
                                                >
                                                    Upload
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="px-4 py-2 text-black bg-gradient-to-br from-[#007FFF] to-indigo-200 rounded-lg"
                                                >
                                                    {progressPrecent < 100 ? `${progressPrecent}%` : 'Uploaded'}
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <div className="mt-10 mb-10 text-center">
                                        <h2 className="mb-2 text-2xl font-semibold text-black">Share the Filey Code</h2>
                                        <p className="text-xs text-black-300">Share this code with the receiver to get the file</p>
                                    </div>
                                    <div className="relative flex items-center justify-center w-4/5 h-32 max-w-xs mb-10 rounded-lg shadow-inner bg-gray-200/30">
                                        <h1 className="text-4xl font-bold tracking-widest text-black">{shareCode}</h1>
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

export default Send;
