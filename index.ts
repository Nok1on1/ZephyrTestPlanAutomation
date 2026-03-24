import dotenv from 'dotenv';
import { fetchTestPlan, fetchTestCycle, fetchTestExecutions, fetchTestCase } from './logic/APICalls.ts';
import { logger } from './utils/logger.ts';
import { deserializeTestCase } from './models/testCase.ts';
import { getIssuesFromTestPlan, getResponsibilitiesForSubtasksOfIssue, getTAForTestCase, getTestCaseFromPlan } from './logic/actions.ts';
import test from 'node:test';

dotenv.config();

if (!process.env.API_KEY) {
    throw new Error("Missing API_KEY in .env file");
}

const API_KEY = process.env.API_KEY;


async function main() {
    const testPlanKey = process.argv[2];

    if (!testPlanKey) {
        logger.error("Usage: npm start <TEST_PLAN_KEY>");
        process.exit(1);
    }

    try {
        const testCases = await getTestCaseFromPlan(testPlanKey);

        const testCaseDetailsPromise = testCases.map(async testCase => {

            const name = testCase.name;

            const owner = await getTAForTestCase(testCase);

            const ownerName = owner.displayName;

            return { name, ownerName };
        });



        const issues = await getIssuesFromTestPlan(testPlanKey);

        const issueDetailsPromise = issues.map(async issue => {
            const responsibility = await getResponsibilitiesForSubtasksOfIssue(issue!);
            const issueSummary = issue ? issue.summary : 'Unknown Issue';

            return { issueSummary, responsibility };
        });


        const testCaseDetails = await Promise.all(testCaseDetailsPromise);
        const issueDetails = await Promise.all(issueDetailsPromise);




    } catch (error) {
        logger.error({ err: error }, 'Error fetching test plan details');
        process.exit(1);
    }
}

main();
