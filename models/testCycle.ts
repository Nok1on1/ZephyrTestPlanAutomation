export interface TestCycle {
    id: number;
    key: string;
    name: string;
    project: {
        id: number;
        self: string;
    };
    jiraProjectVersion: any | null;
    status: {
        id: number;
        self: string;
    };
    folder: any | null;
    description: string | null;
    plannedStartDate: string;
    plannedEndDate: string;
    owner: {
        accountId: string;
        self: string;
    };
    customFields: Record<string, any>;
    links: {
        self: string;
        issues: any[];
        webLinks: any[];
        testPlans: Array<{
            id: number;
            self: string;
            testPlanId: number;
            type: string;
            target: string;
        }>;
    };
}

export function deserializeTestCycle(data: any): TestCycle {
    return {
        id: data.id,
        key: data.key,
        name: data.name,
        project: {
            id: data.project?.id,
            self: data.project?.self,
        },
        jiraProjectVersion: data.jiraProjectVersion,
        status: {
            id: data.status?.id,
            self: data.status?.self,
        },
        folder: data.folder,
        description: data.description,
        plannedStartDate: data.plannedStartDate,
        plannedEndDate: data.plannedEndDate,
        owner: {
            accountId: data.owner?.accountId,
            self: data.owner?.self,
        },
        customFields: data.customFields || {},
        links: {
            self: data.links?.self,
            issues: data.links?.issues || [],
            webLinks: data.links?.webLinks || [],
            testPlans: (data.links?.testPlans || []).map((tp: any) => ({
                id: tp.id,
                self: tp.self,
                testPlanId: tp.testPlanId,
                type: tp.type,
                target: tp.target,
            })),
        },
    };
}
