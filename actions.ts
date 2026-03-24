import test from "node:test";
import { fetchTestCycle, fetchTestExecutions, fetchTestPlan } from "./APICalls";
import { deserializeIssue, type Issue } from "./models/issue";
import { deserializeTestCase, type TestCase } from "./models/testCase";
import { logger } from "./utils/logger";

export async function getTestCaseFromPlan(testPlanKey: string) {
    const plan = await fetchTestPlan(testPlanKey, process.env.API_KEY!);

    const testExecPromises = plan.links.testCycles.map(async testCycle => {
        const cycle = await fetchTestCycle(testCycle.testCycleId.toString(), process.env.API_KEY!);
        const executionData = await fetchTestExecutions(cycle.key, process.env.API_KEY!);
        return executionData;
    });

    const testExecutions = await Promise.all(testExecPromises);

    const testCasePromises = testExecutions.flatMap(exec =>
        exec.values.map(async execution => {
            const response = await fetch(execution.testCase.self, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': process.env.API_KEY!
                }
            });
            return deserializeTestCase(await response.json());
        })
    );

    const testCases = await Promise.all(testCasePromises);

    return testCases;
}


export async function getIssuesFromTestPlan(testPlanKey: string) {
    const plan = await fetchTestPlan(testPlanKey, process.env.API_KEY!);

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

    return Promise.all(issues);
}

export async function getResponsibilitiesForSubtasksOfIssue(issue: Issue) {
    const auth = Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_TOKEN}`).toString('base64');

    const responsibilitiesPromise = issue.subtasks.map(async subtask => {

        const response = await fetch("https://giomiqa.atlassian.net/rest/api/2/issue/" + subtask.id, {
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
