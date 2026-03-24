export interface Issue {
    id: string;
    key: string;
    self: string;
    summary: string;
    description: string | null;
    status: {
        id: string;
        name: string;
        statusCategory: {
            id: number;
            key: string;
            name: string;
        };
    };
    issueType: {
        id: string;
        name: string;
        subtask: boolean;
    };
    project: {
        id: string;
        key: string;
        name: string;
    };
    priority: {
        id: string;
        name: string;
    } | null;
    assignee: {
        accountId: string;
        displayName: string;
        emailAddress: string;
    } | null;
    reporter: {
        accountId: string;
        displayName: string;
        emailAddress: string;
    };
    created: string;
    updated: string;
    subtasks: {
        id: string;
        key: string;
        summary: string;
        status: {
            id: string;
            name: string;
        };
        issueType: {
            id: string;
            name: string;
            subtask: boolean;
        };
    }[];
}

export function deserializeIssue(data: any): Issue {
    const fields = data.fields;
    return {
        id: data.id,
        key: data.key,
        self: data.self,
        summary: fields?.summary,
        description: fields?.description || null,
        status: {
            id: fields?.status?.id,
            name: fields?.status?.name,
            statusCategory: {
                id: fields?.status?.statusCategory?.id,
                key: fields?.status?.statusCategory?.key,
                name: fields?.status?.statusCategory?.name,
            }
        },
        issueType: {
            id: fields?.issuetype?.id,
            name: fields?.issuetype?.name,
            subtask: fields?.issuetype?.subtask,
        },
        project: {
            id: fields?.project?.id,
            key: fields?.project?.key,
            name: fields?.project?.name,
        },
        priority: fields?.priority ? {
            id: fields.priority.id,
            name: fields.priority.name,
        } : null,
        assignee: fields?.assignee ? {
            accountId: fields.assignee.accountId,
            displayName: fields.assignee.displayName,
            emailAddress: fields.assignee.emailAddress,
        } : null,
        reporter: {
            accountId: fields?.reporter?.accountId,
            displayName: fields?.reporter?.displayName,
            emailAddress: fields?.reporter?.emailAddress,
        },
        created: fields?.created,
        updated: fields?.updated,
        subtasks: fields?.subtasks?.map((subtask: any) => ({
            id: subtask.id,
            key: subtask.key,
            summary: subtask.fields?.summary,
            status: {
                id: subtask.fields?.status?.id,
                name: subtask.fields?.status?.name,
            },
            issueType: {
                id: subtask.fields?.issuetype?.id,
                name: subtask.fields?.issuetype?.name,
                subtask: subtask.fields?.issuetype?.subtask,
            }
        })) || []
    };
}
