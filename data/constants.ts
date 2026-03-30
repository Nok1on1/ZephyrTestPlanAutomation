export const GET_TEST_PLAN_URL = (testPlanIdOrKey: string) => {
    return `https://api.zephyrscale.smartbear.com/v2/testplans/${testPlanIdOrKey}`;
}

export const GET_TEST_CYCLE_URL = (testCycleIdOrKey: string) => {
    return `https://api.zephyrscale.smartbear.com/v2/testcycles/${testCycleIdOrKey}`;
}

export const GET_TEST_CASE_URL = (testCaseIdOrKey: string) => {
    return `https://api.zephyrscale.smartbear.com/v2/testcases/${testCaseIdOrKey}`;
}

export const GET_TEST_EXECUTIONS_URL = (testCycleIdOrKey: string) => {
    return `https://api.zephyrscale.smartbear.com/v2/testexecutions?testCycle=${testCycleIdOrKey}`;
}

export const PUT_TEST_PLAN_URL = (testPlanIdOrKey: string) => {
    return `https://api.zephyrscale.smartbear.com/v2/testplans/${testPlanIdOrKey}`;
}

export const CREATE_TEST_CYCLE_LINK_URL = (testPlanIdOrKey: string) => {
    return `https://api.zephyrscale.smartbear.com/v2/testplans/${testPlanIdOrKey}/links/testcycles`
}

export const CREATE_ISSUE_LINK_URL = (testPlanIdOrKey: string) => {
    return `https://api.zephyrscale.smartbear.com/v2/testplans/${testPlanIdOrKey}/links/issues`;
}

export const CREATE_PLAN = `https://api.zephyrscale.smartbear.com/v2/testplans`;
