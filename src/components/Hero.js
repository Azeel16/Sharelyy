import React from "react";

function Hero({ onSignIn }) {
  return (
    <section className="flex flex-col items-center justify-center w-screen h-screen text-center">
      <h1 className="mb-4 font-mono text-4xl font-semibold">
        Share Your <span className="text-[#007FFF]">Files</span> in a Minute
      </h1>
      <p className="mb-5 text-lg">Click "Share Now" to process</p>
      <button
        id="sharenow"
        onClick={onSignIn}
        className="bg-[#0067CF] mt-5 text-stone-100 py-2 px-4 rounded-md hover:bg-[#007FFF]"
      >
        Share Now
      </button>
    </section>
  );
}

export default Hero;
