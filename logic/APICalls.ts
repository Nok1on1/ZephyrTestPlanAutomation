import { GET_TEST_CYCLE_URL, GET_TEST_PLAN_URL, GET_TEST_EXECUTIONS_URL, GET_TEST_CASE_URL, CREATE_TEST_CYCLE_LINK_URL, CREATE_ISSUE_LINK_URL } from '../data/constants.ts';
import { deserializeTestPlan, type TestPlan } from '../models/testPlan.ts';
import { deserializeTestCycle, type TestCycle } from '../models/testCycle.ts';
import { deserializeTestExecutions, type TestExecutionsResponse } from '../models/testExecutions.ts';
import { deserializeTestCase, type TestCase } from '../models/testCase.ts';
import { logger } from '../utils/logger.ts';


export async function fetchTestPlan(testPlanIdOrKey: string): Promise<TestPlan> {
    logger.info(`Fetching test plan for key: ${testPlanIdOrKey}`);
    const url = GET_TEST_PLAN_URL(testPlanIdOrKey);

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': process.env.API_KEY!
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch test plan: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    logger.info(`Successfully fetched plan: ${testPlanIdOrKey}`);
    return deserializeTestPlan(data);
}

export async function fetchTestCycle(testCycleIdOrKey: string): Promise<TestCycle> {
    logger.info(`Fetching test cycle for key: ${testCycleIdOrKey}`);
    const url = GET_TEST_CYCLE_URL(testCycleIdOrKey);

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': process.env.API_KEY!
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch test cycle: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    logger.info(`Successfully fetched test cycle ${testCycleIdOrKey}`);
    return deserializeTestCycle(data);
}

export async function fetchTestExecutions(testCycleIdOrKey: string): Promise<TestExecutionsResponse> {
    logger.info(`Fetching test executions for cycle: ${testCycleIdOrKey}`);
    const url = GET_TEST_EXECUTIONS_URL(testCycleIdOrKey);

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': process.env.API_KEY!
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

export async function fetchTestCase(testCaseIdOrKey: string): Promise<TestCase> {
    logger.info(`Fetching test case for key: ${testCaseIdOrKey}`);
    const url = GET_TEST_CASE_URL(testCaseIdOrKey);

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': process.env.API_KEY!
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch test case: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    logger.info({ testCase: data.key }, `Successfully fetched test case ${testCaseIdOrKey}`);
    return deserializeTestCase(data);
}


export async function createTestCycleLink(testPlanIdOrKey: string, testCycleIdOrKey: string) {
    const url = CREATE_TEST_CYCLE_LINK_URL(testPlanIdOrKey);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': process.env.API_KEY!,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            testCycleIdOrKey: testCycleIdOrKey
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to create test cycle link: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    logger.info(`Successfully linked test cycle ${testCycleIdOrKey} to plan ${testPlanIdOrKey}`);

    return data;
}


export async function createIssueLink(testPlanIdOrKey: string, issueId: string) {
    const url = CREATE_ISSUE_LINK_URL(testPlanIdOrKey);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': process.env.API_KEY!,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            issueId: issueId
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to create issue link: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    logger.info(`Successfully linked issue ${issueId} to plan ${testPlanIdOrKey}`);

    return data;
}
