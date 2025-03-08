"use client";
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAiModel";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!jobPosition || !jobDesc || !jobExperience) {
        alert("Please fill in all fields");
        return;
      }

      setLoading(true);

      const inputPrompt = `
      Job Position: ${jobPosition}
      Tech Stack: ${jobDesc}
      Years of Experience: ${jobExperience}
      Question Count: ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} Questions
    `;

      try {
        const result = await chatSession.sendMessage(inputPrompt);
        const responseText = (await result.response.text()).replace(
          /```json|```/g,
          ""
        );

        let parsedResponse;
        try {
          parsedResponse = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Invalid JSON response:", parseError);
          alert("Received an invalid response. Please try again.");
          return;
        }

        const inserted = await db
          .insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: parsedResponse,
            jobPosition,
            jobDesc,
            jobExperience,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("DD-MM-yyyy HH:mm:ss"),
          })
          .returning({ mockId: MockInterview.mockId });

        if (inserted.length > 0) {
          setOpenDialog(false);
          router.push(`/dashboard/interview/${inserted[0].mockId}`);
        } else {
          alert("Failed to create interview. Please try again.");
        }
      } catch (error) {
        console.error("Error generating questions:", error);
        alert(
          "An error occurred while generating questions. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [jobPosition, jobDesc, jobExperience, user, router]
  );

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-2xl text-center">+ Add New Interview</h2>
        <p className="text-gray-500 text-center">
          Start your AI Mock Interview
        </p>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <p>
                    Add details about your job position, description, and
                    experience.
                  </p>

                  <div className="mt-7 my-2">
                    <label>Job Role/ Position</label>
                    <Input
                      placeholder="Ex. Full Stack Developer"
                      required
                      value={jobPosition}
                      onChange={(e) => setJobPosition(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="my-3">
                    <label>Tech Stack (In Short)</label>
                    <Textarea
                      placeholder="Ex. React, Angular, Next, Node, MySQL, etc"
                      required
                      value={jobDesc}
                      onChange={(e) => setJobDesc(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="my-3">
                    <label>Years of experience</label>
                    <Input
                      placeholder="Ex. 5"
                      type="number"
                      max="100"
                      required
                      value={jobExperience}
                      onChange={(e) => setJobExperience(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="flex gap-5 justify-end mt-5">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" /> Generating AI
                        Interview...
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
