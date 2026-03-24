export interface TestCase {
    id: number;
    key: string;
    name: string;
    project: {
        id: number;
        self: string;
    };
    createdOn: string;
    objective: string | null;
    precondition: string | null;
    estimatedTime: number | null;
    labels: string[];
    component: any | null;
    priority: {
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
    testScript: {
        self: string;
    };
    customFields: Record<string, any>;
    links: {
        self: string;
        issues: any[];
        webLinks: any[];
    };
}

export function deserializeTestCase(data: any): TestCase {
    return {
        id: data.id,
        key: data.key,
        name: data.name,
        project: {
            id: data.project?.id,
            self: data.project?.self,
        },
        createdOn: data.createdOn,
        objective: data.objective,
        precondition: data.precondition,
        estimatedTime: data.estimatedTime,
        labels: data.labels || [],
        component: data.component,
        priority: {
            id: data.priority?.id,
            self: data.priority?.self,
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
        testScript: {
            self: data.testScript?.self,
        },
        customFields: data.customFields || {},
        links: {
            self: data.links?.self,
            issues: data.links?.issues || [],
            webLinks: data.links?.webLinks || [],
        },
    };
}
