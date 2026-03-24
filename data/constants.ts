export const GET_TEST_PLAN_URL = (testPlanIdOrKey: string) => {
    return `https://eu.api.zephyrscale.smartbear.com/v2/testplans/${testPlanIdOrKey}`;
}

export const GET_TEST_CYCLE_URL = (testCycleIdOrKey: string) => {
    return `https://eu.api.zephyrscale.smartbear.com/v2/testcycles/${testCycleIdOrKey}`;
}

export const GET_TEST_CASE_URL = (testCaseIdOrKey: string) => {
    return `https://eu.api.zephyrscale.smartbear.com/v2/testcases/${testCaseIdOrKey}`;
}

export const GET_TEST_EXECUTIONS_URL = (testCycleIdOrKey: string) => {
    return `https://eu.api.zephyrscale.smartbear.com/v2/testexecutions?testCycle=${testCycleIdOrKey}`;
}
