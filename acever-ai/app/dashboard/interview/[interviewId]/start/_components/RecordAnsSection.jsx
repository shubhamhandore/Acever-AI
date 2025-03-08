"use client";

import "regenerator-runtime/runtime";
import Webcam from "react-webcam";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function RecordAnsSection() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser does not support speech recognition.</span>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col mt-20 items-center justify-center bg-black rounded-lg p-5 ">
        <Image
          src={"/webcam.jpg"}
          alt="webcam"
          width={200}
          height={200}
          className="absolute"
        />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      <Button variant="outline" className="mt-10">
        Record Answer
      </Button>

      <h1>Recording: {listening ? "Yes" : "No"}</h1>
      <button
        onClick={
          listening
            ? SpeechRecognition.stopListening
            : SpeechRecognition.startListening
        }
      >
        {listening ? "Stop Recording" : "Start Recording"}
      </button>
      <button onClick={resetTranscript} className="mt-2">
        Reset
      </button>
      <p className="mt-4">{transcript}</p>
    </div>
  );
}

export default RecordAnsSection;
