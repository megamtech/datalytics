export type FilterConditionTypes = "gte" | "lte" | "contains" | "gt" | "lt" | "startswith" | "endswith" | "between" | "equals" | "in" | "notin";
export interface Filter {
    column: string;
    filterType?: FilterConditionTypes;
    values: any
}
