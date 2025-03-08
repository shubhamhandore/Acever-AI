"use client";
import { useState } from "react";
import { MockInterview } from "@/utils/schema";
import { Lightbulb, WebcamIcon } from "lucide-react";
import React, { useEffect } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState();
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  useEffect(() => {
    console.log(params.interviewId);
    GetInterviewDetails();
  }, []);

  /**
   * Get Interview Details By Interview Id
   */

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));
    setInterviewData(result[0]);
  };

  return (
    <div className="my-10 ">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="my-5 flex flex-col items-center gap-5 ">
          <div className="flex flex-col p-5 rounded-lg border gap-5">
            <h2 className="text-lg">
              <strong>Job Role/Job Position:</strong>
              {interviewData?.jobPosition}
            </h2>

            <h2 className="text-lg">
              <strong>Job Desciption:</strong>
              {interviewData?.jobDesc}
            </h2>

            <h2 className="text-lg">
              <strong>Years of experience:</strong>
              {interviewData?.jobExperience}
            </h2>
          </div>

          <div className="p-5 rounded-lg border gap-5 border-yellow-300 bg-yellow-100">
            <h2 className="text-lg flex items-center gap-2 text-yellow-500">
              <Lightbulb />
              <strong>Information</strong>
            </h2>
            <h2 className="mt-3 text-yellow-500">
              {" "}
              {process.env.NEXT_PUBLIC_INFORMATION}
            </h2>
          </div>
        </div>

        <div>
          {webcamEnabled ? (
            <Webcam
              onUserMedia={() => setWebcamEnabled(true)}
              onUserMediaError={() => setWebcamEnabled(false)}
              mirrored={true}
              style={{ height: 300, width: 300 }}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setWebcamEnabled(true)}
              >
                Enable WebCam and Microphone{" "}
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end items-end m-10">
        <Link href={"/dashboard/interview/" + params.interviewId + "/start"}>
          <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;
