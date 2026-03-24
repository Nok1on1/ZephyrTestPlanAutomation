export interface TestExecution {
    id: number;
    key: string;
    project: {
        id: number;
        self: string;
    };
    testCase: {
        self: string;
        id: number;
    };
    environment: any | null;
    jiraProjectVersion: any | null;
    testExecutionStatus: {
        id: number;
        self: string;
    };
    actualEndDate: string;
    estimatedTime: number | null;
    executionTime: number;
    executedById: string;
    assignedToId: string;
    comment: string | null;
    automated: boolean;
    testCycle: {
        self: string;
        id: number;
    };
    customFields: Record<string, any>;
    links: {
        self: string;
        issues: any[];
    };
}

export interface TestExecutionsResponse {
    next: string | null;
    startAt: number;
    maxResults: number;
    total: number;
    isLast: boolean;
    values: TestExecution[];
}

export function deserializeTestExecutions(data: any): TestExecutionsResponse {
    return {
        next: data.next,
        startAt: data.startAt,
        maxResults: data.maxResults,
        total: data.total,
        isLast: data.isLast,
        values: (data.values || []).map((te: any) => ({
            id: te.id,
            key: te.key,
            project: {
                id: te.project?.id,
                self: te.project?.self,
            },
            testCase: {
                self: te.testCase?.self,
                id: te.testCase?.id,
            },
            environment: te.environment,
            jiraProjectVersion: te.jiraProjectVersion,
            testExecutionStatus: {
                id: te.testExecutionStatus?.id,
                self: te.testExecutionStatus?.self,
            },
            actualEndDate: te.actualEndDate,
            estimatedTime: te.estimatedTime,
            executionTime: te.executionTime,
            executedById: te.executedById,
            assignedToId: te.assignedToId,
            comment: te.comment,
            automated: te.automated,
            testCycle: {
                self: te.testCycle?.self,
                id: te.testCycle?.id,
            },
            customFields: te.customFields || {},
            links: {
                self: te.links?.self,
                issues: te.links?.issues || [],
            },
        })),
    };
}
