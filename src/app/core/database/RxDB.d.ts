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
    name: string;
};

export type RxTagDocument = RxDocument<RxTagDocumentType>;

export type RxTagsCollection = RxCollection<RxTagDocumentType>;

// --- TASKS --- //

export type RxTasksSectionDocumentType = {
    id: string;
    section: string;
    title: string;
    notes?: string;
    completed: boolean;
    dueDate?: string;
    priority: 0 | 1 | 2;
    tags: string[];
    order: number;
};

export type RxTaskDocument = RxDocument<RxTasksSectionDocumentType>;

export type RxTasksCollection = RxCollection<RxTasksSectionDocumentType>;

// --- NOTES --//


export type RxHeroesCollections = {
    hero: RxHeroCollection;
    tag: RxTagsCollection;
    task: RxTasksCollection;
};

export type RxHeroesDatabase = RxDatabase<RxHeroesCollections>;
