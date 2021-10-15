import type {
    RxJsonSchema
} from 'rxdb/plugins/core';
import { RxTagDocumentType, RxTasksSectionDocumentType } from '../RxDB';

export const TAG_SCHEMA: RxJsonSchema<RxTagDocumentType> = {
    title: 'tag schema',
    description: 'describes a tag',
    version: 0,
    keyCompression: false,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            default: ''
        },
        name: {
            type: 'string',
            default: '',
        }
    },
    required: [
        'name',
    ]
};


export const TASK_SCHEMA: RxJsonSchema<RxTasksSectionDocumentType> = {
    title: 'task schema',
    description: 'describes a collection of tasks which are logically grouped together',
    version: 0,
    keyCompression: false,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            default: ''
        },
        title: {
            type: 'string',
            default: '',
        },
        section: {
            type: 'string',
            default: '',
        },
        notes: {
            type: 'number'
        },
        completed: {
            type: 'boolean',
            default: false
        },
        dueDate: {
            type: 'string'
        },
        priority: {
            type: 'number',
            default: 2
        },
        tags: {
            type: 'array',
            ref: 'tag',
            items: {
                type: 'string'
            },
            default: []
        },
        order: {
            type: 'number'
        }
    },
    required: [
        'id',
        'title',
        'section',
        'completed',
        'priority',
        'tags',
        'order'
    ]
};
