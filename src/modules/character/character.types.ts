export interface CreateCharacterInput {
    name: string;
    schoolYear: string;
    attributes: AttributeAllocationInput[];
}

export interface AttributeAllocationInput {
    code: string;  // AttributeCode
    points: number;  // 1-10
}

export interface UpdateCharacterInput {
    name?: string;
    schoolYear?: string;
}

export interface UpdateCharacterAttributeInput {
    attributeCode: string;
    baseValue: number;
}

export interface AddItemInput {
    itemId: string;
    quantity: number;
}
