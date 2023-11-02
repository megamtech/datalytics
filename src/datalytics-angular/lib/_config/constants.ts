export class ContstantsService {
  public static defaultConditionTypes: any[] = [
    { name: 'Contains', condition: 'contains', icon: '[A-Z]' }, // 0:
    { name: 'Starts with', condition: 'startswith', icon: '[A-Z' }, // 1:
    { name: 'Ends with', condition: 'endswith', icon: 'A-Z]' }, // 2:
    { name: 'Greater than equals', condition: 'gte', icon: '>=' }, // 3:
    { name: 'Lesser than equals', condition: 'lte', icon: '<=' }, // 4:
    { name: 'Equals', condition: 'eq', icon: '==' }, // 5:
    { name: 'Not Equals ', condition: 'neq', icon: '!=' }, // 6:
    { name: 'In', condition: 'in', icon: '[A,B,C]' }, // 7:
    { name: 'Not In', condition: 'notin', icon: '[A,B,C]' }, // 8:
    { name: 'Between', condition: 'between', icon: 'A-Z' } // 9:
  ];
}
