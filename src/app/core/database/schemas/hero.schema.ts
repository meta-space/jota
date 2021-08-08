import type {
    RxJsonSchema
} from 'rxdb/plugins/core';
import { RxHeroDocumentType, RxTagDocumentType } from '../RxDB';

export const HERO_SCHEMA: RxJsonSchema<RxHeroDocumentType> = {
    title: 'hero schema',
    description: 'describes a simple hero',
    version: 0,
    keyCompression: false,
    primaryKey: 'name',
    type: 'object',
    properties: {
        name: {
            type: 'string',
            default: ''
        },
        color: {
            type: 'string',
            default: '',
            minLength: 3
        },
        maxHP: {
            type: 'number',
            minimum: 0,
            maximum: 1000
        },
        hp: {
            type: 'number',
            minimum: 0,
            maximum: 100,
            default: 100
        },
        team: {
            description: 'color of the team this hero belongs to',
            type: 'string'
        },
        skills: {
            type: 'array',
            maxItems: 5,
            uniqueItems: true,
            items: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string'
                    },
                    damage: {
                        type: 'number'
                    }
                }
            },
            default: []
        }
    },
    required: [
        'name',
        'color',
        'hp',
        'maxHP',
        'skills'
    ]
};

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
        title: {
            type: 'string',
            default: '',
        }
    },
    required: [
        'id',
        'title',
    ]
};

