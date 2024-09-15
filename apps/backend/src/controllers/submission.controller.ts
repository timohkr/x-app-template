import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { OpenaiService } from '@/services/openai.service';
import { Submission } from '@/interfaces/submission.interface';
import { HttpException } from '@/exceptions/HttpException';
import { ContractsService } from '@/services/contracts.service';
import fs from "fs";
import path from "path";

// Define the path to the JSON file
const filePath = "/Users/timothy/Desktop/hackathon/x-app-template/apps/frontend/public/listing.json"

export class SubmissionController {
  public openai = Container.get(OpenaiService);
  public contracts = Container.get(ContractsService);

  public submitReceipt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body: Omit<Submission, 'timestamp'> = req.body;

      const submissionRequest: Submission = {
        ...body,
        timestamp: Date.now(),
      };
      console.log("HELLO")
      // Submission validation with smart contract
      await this.contracts.validateSubmission(submissionRequest);
      console.log("HELLO")

      const validationResult = await this.openai.validateImage(body.image);
      console.log("HELLO", validationResult)

      if (validationResult == undefined || !('validityFactor' in (validationResult as object))) {
        throw new HttpException(500, 'Error validating image');
      }

      const validityFactor = validationResult['validityFactor'];

      if (validityFactor > 0.5) {
        if (!(await this.contracts.registerSubmission(submissionRequest))) {
          throw new HttpException(500, 'Error registering submission and sending rewards');
        }
      }

      res.status(200).json({ validation: validationResult });
    } catch (error) {
      next(error);
      return;
    }
  };

  public submitListing = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log("hit")
      // Read the current contents of the file
      const fileContents = fs.readFileSync(filePath, "utf-8");
      const listings = JSON.parse(fileContents);

      // Get the new listing data from the request body
      const newListing = req.body;

      // Append the new listing to the existing data
      listings.push(newListing);

      // Write the updated data back to the JSON file
      fs.writeFileSync(filePath, JSON.stringify(listings, null, 2));

      // Send a success response
      res.status(200).json({ message: "Listing added successfully!" });
    } catch (error) {
      console.error("Error appending to JSON file:", error);
      res.status(500).json({ message: "Failed to add listing." });
    }
  }
}
