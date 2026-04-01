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
  TEMP_APPROVED = 'TEMPORARY_APPROVED',
  ACCEPTED = 'ACCEPTED',
  DECIDING = 'DECIDING',
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
  [StatusTypes.TEMP_APPROVED]: TagColors.ORANGE,
  [StatusTypes.ACCEPTED]: TagColors.GREEN,
  [StatusTypes.DECIDING]: TagColors.BLUE,
};

export const FoodForms = {
  CREATE: 'create',
  UPDATE: 'update',
  REMOVE: 'remove',
};

export const AnimalForms = {
  CREATE: 'create',
  EDIT: 'edit',
  REMOVE: 'remove',
  RESUME: 'resume',
};

export const animalFoodMap = {
  'Naminiai paukščiai': ['Kiaulės', 'Ūkiniai vabzdžiai'],
  Kiaulės: ['Naminiai paukščiai', 'Ūkiniai vabzdžiai'],
  'Akvakultūros gyvūnai, naminiai paukščiai ir kiaulės': ['Ūkiniai vabzdžiai'],
  'Akvakultūros gyvūnai': ['Neatrajotojai', 'Ūkiniai vabzdžiai'],
};

export const actionToEVRK = {
  '28': '38.21',
  '36': '38.2',
  '37': '38.2',
  '42': '38.21',
  '48': '96.99',
  '59': '01.4',
  '60': '01.4',
  '61': '01.4',
  '62': '75.00',
  '69': '75.00',
  '77': '96.99',
  '78': '38.11',
  '79': '01.4',
  '82': '38.2',
  '89': '38.2',
  '01': '01.4',
  '04': '46.23',
  '101': '03.22',
  '102': '03.22',
  '12': '01.62',
  '13': '01.62',
  '15': '01.62',
  '16': '01.62',
  '18': '01.62',
  '19': '01.62',
  '22': '01.47',
  '23': '03.22',
  '24': '91.41',
  '25': '38.2',
  '26': '38.2',
  '27': '35.21',
  '29': '38.2',
  '30': '38.2',
  '31': '38.2',
  '32': '35.21',
  '33': '38.21',
  '34': '38.11',
  '35': '10.92',
  '38': '38.21',
  '39': '38.21',
  '40': '38.21',
  '43': '01.47',
  '44': '01.47',
  '46': '01.47',
  '47': '01.47',
  '51': '01.4',
  '55': '96.99',
  '57': '03.22',
  '63': '01.4',
  '64': '47.7',
  '68': '10.91',
  '71': '96.99',
  '72': '03.22',
  '73': '01.04',
  '75': '01.47',
  '80': '38.2',
  '81': '81.23',
  '87': '03.22',
  '91': '01.47',
  '92': '01.62',
  '93': '90.20',
  '95': '01.49.10',
  '97': '96.99',
  '98': '96.99',
};
