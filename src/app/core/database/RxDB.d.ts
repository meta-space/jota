/**
 * custom typings so typescript knows about the schema-fields
 */

import type {
    RxDocument,
    RxCollection,
    RxDatabase
} from 'rxdb/plugins/core';

// --- HEROES --- //

export type RxHeroDocumentType = {
    name: string;
    color: string;
    maxHP: number;
    hp: number;
    team?: string;
    skills: Array<{
        name?: string;
        damage?: number;
    }>;
};

// ORM methods
type RxHeroDocMethods = {
    hpPercent(): number;
};

export type RxHeroDocument = RxDocument<RxHeroDocumentType, RxHeroDocMethods>;

export type RxHeroCollection = RxCollection<RxHeroDocumentType, RxHeroDocMethods>;

// --- TAGS --- //

export type RxTagDocumentType = {
    id: string;
    title: string;
};

export type RxTagDocument = RxDocument<RxTagDocumentType>;

export type RxTagsCollection = RxCollection<RxTagDocumentType>;

// --- TASKS --- //

export type RxTasksSectionDocumentType = {
    id: string;
    title: string;
    tasks: Array<{
        id: string;
        title: string;
        notes: string;
        completed: boolean;
        dueDate: string | null;
        priority: 0 | 1 | 2;
        tags: string[];
        order: number;
    }>;
};

export type RxTaskDocument = RxDocument<RxTasksSectionDocumentType>;

export type RxTasksCollection = RxCollection<RxTasksSectionDocumentType>;

// --- NOTES --//




export type RxHeroesCollections = {
    hero: RxHeroCollection;
    tags: RxTagsCollection;
    tasks: RxTasksCollection;
};

export type RxHeroesDatabase = RxDatabase<RxHeroesCollections>;
