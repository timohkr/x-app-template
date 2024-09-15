import { HttpException } from '@/exceptions/HttpException';
import { Submission } from '@/interfaces/submission.interface';
import { ecoEarnContract } from '@/utils/thor';
import { Service } from 'typedi';
import * as console from 'node:console';
import { unitsUtils } from '@vechain/sdk-core';
import { REWARD_AMOUNT } from '@config';
@Service()
export class ContractsService {
  public async registerSubmission(submission: Submission): Promise<boolean> {
    let isSuccess = false;
    try {
      console.log(submission.address)
      const result = await (
        await ecoEarnContract.transact.registerValidSubmission(submission.address, unitsUtils.parseUnits(REWARD_AMOUNT, 'ether'))
      ).wait();
      console.log(result)
      isSuccess = !result.reverted;
    } catch (error) {
      console.log('Error', error);
    }

    return isSuccess;
  }

  public async validateSubmission(submission: Submission): Promise<void> {
    console.log("HELLO", submission.address)

    const isMaxSubmissionsReached = (await ecoEarnContract.read.isUserMaxSubmissionsReached(submission.address))[0];
    console.log(isMaxSubmissionsReached)
    // const isMaxSubmissionsReached = false
    if (Boolean(isMaxSubmissionsReached) === true) throw new HttpException(409, `EcoEarn: Max submissions reached for this cycle`);
  }
}
