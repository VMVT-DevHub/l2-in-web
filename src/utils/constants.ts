export enum HistoryTypes {
  CREATED = 'CREATED',
  SUBMITTED = 'SUBMITTED',
  REJECTED = 'REJECTED',
  RETURNED = 'RETURNED',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
}

export enum TagColors {
  BLUE = 'blue',
  BROWN = 'brown',
  GREEN = 'green',
  PINK = 'pink',
  VIOLET = 'violet',
  ORANGE = 'orange',
  SKYBLUE = 'skyblue',
  GREY = 'grey',
}

export enum StatusTypes {
  CREATED = 'CREATED',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  RETURNED = 'RETURNED',
  REJECTED = 'REJECTED',
  DRAFT = 'DRAFT',
  COMPLETED = 'COMPLETED',
}

export enum FormTypes {
  CERTIFICATES = 'certificates',
  FOOD = 'food',
  ANIMAL = 'animal',
}

export enum SortFields {
  CREATED_AT = '-createdAt',
}

export const colorsByStatus = {
  [StatusTypes.CREATED]: TagColors.BLUE,
  [StatusTypes.SUBMITTED]: TagColors.BLUE,
  [StatusTypes.APPROVED]: TagColors.GREEN,
  [StatusTypes.COMPLETED]: TagColors.GREEN,
  [StatusTypes.RETURNED]: TagColors.ORANGE,
  [StatusTypes.REJECTED]: TagColors.PINK,
};

export const FoodForms = {
  CREATE: 'create',
  UPDATE: 'update',
  REMOVE: 'remove',
};

export const AnimalForms = {
  CREATE: 'create',
  UPDATE: 'update',
  REMOVE: 'remove',
};
