import { GET_TEST_CYCLE_URL, GET_TEST_PLAN_URL, GET_TEST_EXECUTIONS_URL, GET_TEST_CASE_URL } from './data/constants.ts';
import { deserializeTestPlan, type TestPlan } from './models/testPlan.ts';
import { deserializeTestCycle, type TestCycle } from './models/testCycle.ts';
import { deserializeTestExecutions, type TestExecutionsResponse } from './models/testExecutions.ts';
import { deserializeTestCase, type TestCase } from './models/testCase.ts';
import { logger } from './utils/logger.ts';

export async function fetchTestPlan(testPlanIdOrKey: string, apiKey: string): Promise<TestPlan> {
    logger.info(`Fetching test plan for key: ${testPlanIdOrKey}`);
    const url = GET_TEST_PLAN_URL(testPlanIdOrKey);

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': apiKey
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch test plan: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    logger.info(`Successfully fetched plan: ${testPlanIdOrKey}`);
    return deserializeTestPlan(data);
}

export async function fetchTestCycle(testCycleIdOrKey: string, apiKey: string): Promise<TestCycle> {
    logger.info(`Fetching test cycle for key: ${testCycleIdOrKey}`);
    const url = GET_TEST_CYCLE_URL(testCycleIdOrKey);

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': apiKey
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch test cycle: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    logger.info(`Successfully fetched test cycle ${testCycleIdOrKey}`);
    return deserializeTestCycle(data);
}

export async function fetchTestExecutions(testCycleIdOrKey: string, apiKey: string): Promise<TestExecutionsResponse> {
    logger.info(`Fetching test executions for cycle: ${testCycleIdOrKey}`);
    const url = GET_TEST_EXECUTIONS_URL(testCycleIdOrKey);

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': apiKey
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch test executions: ${url} | ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.values)) {
        throw new Error("Invalid response format: Expected paginated response with 'values' array");
    }

    const result = deserializeTestExecutions(data);
    logger.info({ executionCount: result.values.length }, `Successfully fetched executions for cycle ${testCycleIdOrKey}`);
    return result;
}

export async function fetchTestCase(testCaseIdOrKey: string, apiKey: string): Promise<TestCase> {
    logger.info(`Fetching test case for key: ${testCaseIdOrKey}`);
    const url = GET_TEST_CASE_URL(testCaseIdOrKey);

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': apiKey
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch test case: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    logger.info({ testCase: data.key }, `Successfully fetched test case ${testCaseIdOrKey}`);
    return deserializeTestCase(data);
}
