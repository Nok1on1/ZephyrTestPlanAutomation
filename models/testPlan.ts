export interface TestPlan {
    id: number;
    key: string;
    name: string;
    objective: string | null;
    project: {
        id: number;
        self: string;
    };
    status: {
        id: number;
        self: string;
    };
    folder: any | null;
    owner: {
        accountId: string;
        self: string;
    };
    customFields: Record<string, any>;
    labels: string[];
    links: {
        webLinks: any[];
        issues: any[];
        testCycles: Array<{
            id: number;
            self: string;
            testCycleId: number;
            type: string;
            target: string;
        }>;
    };
}

export function deserializeTestPlan(data: any): TestPlan {
    return {
        id: data.id,
        key: data.key,
        name: data.name,
        objective: data.objective,
        project: {
            id: data.project?.id,
            self: data.project?.self,
        },
        status: {
            id: data.status?.id,
            self: data.status?.self,
        },
        folder: data.folder,
        owner: {
            accountId: data.owner?.accountId,
            self: data.owner?.self,
        },
        customFields: data.customFields || {},
        labels: data.labels || [],
        links: {
            webLinks: data.links?.webLinks || [],
            issues: data.links?.issues || [],
            testCycles: (data.links?.testCycles || []).map((tc: any) => ({
                id: tc.id,
                self: tc.self,
                testCycleId: tc.testCycleId,
                type: tc.type,
                target: tc.target,
            })),
        },
    };
}
