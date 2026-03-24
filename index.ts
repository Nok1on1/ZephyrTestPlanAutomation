import dotenv from 'dotenv';
import { fetchTestPlan, fetchTestCycle, fetchTestExecutions, fetchTestCase } from './actions.ts';
import { logger } from './utils/logger.ts';

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
        const plan = await fetchTestPlan(testPlanKey, API_KEY);

        const testExecPromises = plan.links.testCycles.map(async testCycle => {
            const cycle = await fetchTestCycle(testCycle.testCycleId.toString(), API_KEY);
            const executionData = await fetchTestExecutions(cycle.key, API_KEY);
            return executionData;
        });

        const testExecutions = await Promise.all(testExecPromises);

        const testCasePromises = testExecutions.flatMap(exec =>
            exec.values.map(execution => fetchTestCase(execution.testCase.id.toString(), API_KEY))
        );

        const testCases = await Promise.all(testCasePromises);

    } catch (error) {
        logger.error({ err: error }, 'Error fetching test plan details');
        process.exit(1);
    }
}

main();
