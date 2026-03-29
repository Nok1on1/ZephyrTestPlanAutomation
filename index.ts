import dotenv from 'dotenv';
import { logger } from './utils/logger.ts';
import { createPlan, getIssuesFromTestPlan, getResponsibilitiesForSubtasksOfIssue, getTAForTestCase, getTestCasesFromPlan } from './logic/actions.ts';
import { fetchTestPlan } from './logic/APICalls.ts';
import type { Issue } from './models/issue.ts';
import { createObjective } from './utils/tableFactory.ts';
import { log } from 'node:console';

dotenv.config();


async function main() {
    let testPlanKey = '';
    let dQuality = '';
    let dTime = '';

    for (let i = 2; i < process.argv.length; i++) {
        const arg = process.argv[i]!;
        if (arg === '-dQuality' && i + 1 < process.argv.length) {
            dQuality = process.argv[++i]!;
        } else if (arg === '-dTime' && i + 1 < process.argv.length) {
            dTime = process.argv[++i]!;
        } else if (!arg.startsWith('-') && !testPlanKey) {
            testPlanKey = arg!;
        }
    }

    logger.info(`Current values - testPlanKey: ${testPlanKey}, dQuality: ${dQuality}, dTime: ${dTime}`);
    
    if (!testPlanKey) {
        logger.error("Usage: npm start <TEST_PLAN_KEY> [-dTime <time>] [-dQuality <quality>]");
        process.exit(1);
    }

    try {

        const plan = await fetchTestPlan(testPlanKey);

        const testCases = await getTestCasesFromPlan(testPlanKey);

        const testCaseDetailsPromise = testCases.map(async testCase => {

            const name = testCase.name;

            const owner = await getTAForTestCase(testCase);

            const ownerName = owner.displayName;

            return [name, ownerName, dTime, dQuality];
        });

        const issues = await getIssuesFromTestPlan(testPlanKey);

        const issueDetailsPromise = issues.map(async issue => {
            const responsibility = await getResponsibilitiesForSubtasksOfIssue(issue!);
            const issueSummary = issue ? issue.summary : 'Unknown Issue';

            return [issueSummary, responsibility.join(', '), dTime, dQuality];
        });


        const testCaseDetails = await Promise.all(testCaseDetailsPromise);
        const issueDetails = await Promise.all(issueDetailsPromise);

        const objective = createObjective({
            header: ['დასანერგ პაკეტში შემავალი საკითხები', 'პასუხისმგებელი', 'ხანგრძლივობა', 'ხარისხის შეფასება'],
            data: issueDetails
        }, {
            header: ['რეგრესული ტესტირების საკითხები', 'პასუხისმგებელი', 'ხანგრძლივობა', 'ხარისხის შეფასება'],
            data: testCaseDetails
        },
            {
                header: ['წარმადობის ტესტირება', 'პასუხისმგებელი', 'ხანგრძლივობა', 'ხარისხის შეფასება'],
                data: []
            });


        createPlan(plan, issues, objective);
    } catch (error) {
        logger.error({ err: error }, 'Error fetching test plan details');
        process.exit(1);
    }
}

main();
