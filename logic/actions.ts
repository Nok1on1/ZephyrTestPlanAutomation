import { createIssueLink, createTestCycleLink, fetchTestCycle, fetchTestExecutions, fetchTestPlan } from "./APICalls";
import { deserializeIssue, type Issue } from "../models/issue";
import { deserializeTestCase, type TestCase } from "../models/testCase";
import { logger } from "../utils/logger";
import { CREATE_PLAN } from "../data/constants";
import type { TestPlan } from "../models/testPlan";

export async function getTestCasesFromPlan(testPlanKey: string) {
    const plan = await fetchTestPlan(testPlanKey);

    const testCasePromises = plan.links.testCycles.map(async testCycle => {
        const cycle = await fetchTestCycle(testCycle.testCycleId.toString());
        const executionData = await fetchTestExecutions(cycle.key);

        const testCaseData = executionData.values.map(async execution => {
            const response = await fetch(execution.testCase.self, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': process.env.ZEPHYR_TOKEN!
                }
            });
            return deserializeTestCase(await response.json());
        })

        return Promise.all(testCaseData);
    });

    const testCases = await Promise.all(testCasePromises);
    return testCases.flat();
}


export async function getIssuesFromTestPlan(testPlanKey: string): Promise<Issue[]> {
    const plan = await fetchTestPlan(testPlanKey);

    const auth = Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_TOKEN}`).toString('base64');

    const issues = plan.links.issues.map(async issue => {
        const response = await fetch(issue.target, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Basic ${auth}`
            }
        });

        if (!response.ok) {
            logger.error({ err: new Error(`Failed to fetch issue ${issue.target}: ${response.status} ${response.statusText}`) }, 'Error fetching issue details');
            return null;
        }

        const data = await response.json();

        return deserializeIssue(data);
    });

    const resolvedIssues = await Promise.all(issues);
    return resolvedIssues.filter((issue): issue is Issue => issue !== null);
}

export async function getResponsibilitiesForSubtasksOfIssue(issue: Issue) {
    const auth = Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_TOKEN}`).toString('base64');
    const url = issue.self.substring(0, issue.self.lastIndexOf('/'));

    const responsibilitiesPromise = issue.subtasks.map(async subtask => {

        const response = await fetch(url + `/${subtask.id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Basic ${auth}`
            }
        });

        const data = deserializeIssue(await response.json());

        return data.assignee ? data.assignee.displayName : 'Unassigned';
    });

    const responsibilities = [...new Set(await Promise.all(responsibilitiesPromise))];

    logger.info(`Responsibilities for issue ${issue.key}: ${responsibilities.join(', ')}`);

    return responsibilities;
}


export async function getTAForTestCase(testCase: TestCase) {
    const auth = Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_TOKEN}`).toString('base64');

    const response = await fetch(testCase.owner.self, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Basic ${auth}`
        }
    });

    if (!response.ok) {
        logger.error({ err: new Error(`Failed to fetch test case owner ${testCase.owner.self}: ${response.status} ${response.statusText}`) }, 'Error fetching test case owner details');
        return null;
    }

    const data = await response.json();

    logger.info(`Test case ${testCase.key} is owned by ${JSON.stringify(data.displayName)}`);
    return data;
}

export async function createPlan(testPlan: TestPlan, issues: Issue[], objective: string) {
    const response = await fetch(CREATE_PLAN, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': process.env.ZEPHYR_TOKEN!,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            projectKey: testPlan.key.split("-")[0]!,
            name: testPlan.name,
            objective
        })
    });


    if (!response.ok) {
        throw new Error(`Failed to create test plan: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    logger.info(`Successfully created test plan: ${data.key}`);


    issues.forEach(issue => {
        createIssueLink(data.key, issue.id)
    })

    testPlan.links.testCycles.forEach(testCycle => {
        createTestCycleLink(data.key, testCycle.testCycleId.toString())
    });

    return data;
}
