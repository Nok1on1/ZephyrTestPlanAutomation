const regionPrefix = process.env.REGION ? `${process.env.REGION}.` : '';
const BASE_URL = `https://${regionPrefix}api.zephyrscale.smartbear.com/v2`;

export const GET_TEST_PLAN_URL = (testPlanIdOrKey: string) => {
    return `${BASE_URL}/testplans/${testPlanIdOrKey}`;
}

export const GET_TEST_CYCLE_URL = (testCycleIdOrKey: string) => {
    return `${BASE_URL}/testcycles/${testCycleIdOrKey}`;
}

export const GET_TEST_CASE_URL = (testCaseIdOrKey: string) => {
    return `${BASE_URL}/testcases/${testCaseIdOrKey}`;
}

export const GET_TEST_EXECUTIONS_URL = (testCycleIdOrKey: string) => {
    return `${BASE_URL}/testexecutions?testCycle=${testCycleIdOrKey}`;
}

export const PUT_TEST_PLAN_URL = (testPlanIdOrKey: string) => {
    return `${BASE_URL}/testplans/${testPlanIdOrKey}`;
}

export const CREATE_TEST_CYCLE_LINK_URL = (testPlanIdOrKey: string) => {
    return `${BASE_URL}/testplans/${testPlanIdOrKey}/links/testcycles`
}

export const CREATE_ISSUE_LINK_URL = (testPlanIdOrKey: string) => {
    return `${BASE_URL}/testplans/${testPlanIdOrKey}/links/issues`;
}

export const CREATE_PLAN = `${BASE_URL}/testplans`;
