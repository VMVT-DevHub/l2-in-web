export enum HistoryTypes {
  CREATED = 'CREATED',
  SUBMITTED = 'SUBMITTED',
  REVIEW = 'REVIEW',
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
  REVIEW = 'REVIEW',
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
  [StatusTypes.REVIEW]: TagColors.BLUE,
  [StatusTypes.APPROVED]: TagColors.GREEN,
  [StatusTypes.COMPLETED]: TagColors.GREEN,
  [StatusTypes.RETURNED]: TagColors.ORANGE,
  [StatusTypes.REJECTED]: TagColors.PINK,
  [StatusTypes.TEMP_APPROVED]: TagColors.ORANGE,
  [StatusTypes.ACCEPTED]: TagColors.GREEN,
  [StatusTypes.DECIDING]: TagColors.BLUE,
  '1': TagColors.BLUE,
  '2': TagColors.BLUE,
  '3': TagColors.GREEN,
  '4': TagColors.PINK,
  '5': TagColors.PINK,
  '6': TagColors.ORANGE,
  '7': TagColors.BLUE,
  '8': TagColors.GREEN,
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

export const activityCategoryMap: Record<string, number[]> = {
  // 25; 26
  COLL: [1, 2, 3],
  INTP: [1, 2, 3],

  // 25; 26; 34
  STORP: [1, 2, 3],

  // 38
  CoIP: [1, 2, 3],

  // 27
  COMBP: [1, 2, 3],

  // 39
  INCP: [1, 2, 3],

  // 29; 30; 31
  OALKHP: [1, 2, 3],
  OBIODP: [1, 2, 3],
  OCAFTB: [1, 2, 3],
  OHPHBP: [1, 2, 3],
  OMSCP: [1, 2, 3],
  PROCP: [1, 2, 3],

  // 30; 31
  OBRGAP: [2, 3],
  OEFP: [2, 3],
  OHPHTP: [2, 3],
  OMSCHy: [2, 3],
  OTMB: [2, 3],

  // 30
  OLTPPM: [2],

  // 37
  CONTMT: [1, 2, 3],
  GATRP: [1, 2, 3],
  TAN: [1, 2, 3],
  TECH: [1, 2, 3],

  // 42
  OLCP: [1, 2, 3],

  // 32
  BIOGP: [2, 3],

  // 33
  COMP: [2, 3],

  // 35
  PETPP: [1, 2, 3],
  PETPR: [1, 2, 3],

  // 80
  UDER: [1, 2, 3],
  UDOG: [1, 2, 3],
  UEXART: [1, 2, 3],
  UFUR: [1, 2, 3],
  UINSE: [1, 2, 3],
  UNEC: [1, 2, 3],
  URBP: [1, 2, 3],
  UWILD: [1, 2, 3],
  UZOO: [1, 2, 3],

  // 36
  COLC: [1, 2, 3],

  // 40
  OFSIPP: [2],

  // 40; 82 (82 does not fall into any category)
  UFERT: [2],

  // 89
  OFSIBU: [1, 2, 3],
  OFSIPA: [1, 2, 3],
  OTHER: [1, 2, 3],
  PHAR: [1, 2, 3],
  UCOSM: [1, 2, 3],

  // 28
  RETAIL: [1, 2, 3],
  TRADE: [1, 2, 3],

  // 78
  TRANS: [1, 2, 3],
};

// export const activitySubactivityMap = {
//   "25": [
//     "COLL – šalutinių gyvūninių produktų surinkimo įmonė",
//     "INTP – tarpinę veiklą vykdanti įmonė",
//     "STORP – šalutinių gyvūninių produktų ir jų gaminių saugojimo įmonė",
//   ],

//   "26": [
//     "COLL – šalutinių gyvūninių produktų surinkimo įmonė",
//     "INTP – tarpinę veiklą vykdanti įmonė",
//     "STORP – šalutinių gyvūninių produktų ir jų gaminių saugojimo įmonė",
//   ],

//   "27": [
//     "COMBP – šalutinių gyvūninių produktų, naudojamų kaip kuras, deginimo įmonė",
//   ],

//   "28": [
//     "RETAIL – mažmeninė prekyba",
//     "TRADE – registruoti prekybininkai (perka / parduoda šalutinius gyvūninius produktus ir (ar) jų gaminius fiziškai jų neturėdami) ir ekspedijavimo įmonės (organizuoja logistiką ir transporto administravimą), eksportuojantys prekes į ne Europos Sąjungos (ES) šalis ir importuojantys iš ne ES šalių",
//   ],

//   "29": [
//     "OALKHP – alternatyvų perdirbimo metodą – šarminę hidrolizę taikanti įmonė",
//     "OBIODP – alternatyvų perdirbimo metodą taikanti biodyzelino gamybos įmonė",
//     "OCAFTB – alternatyvų perdirbimo metodą – gyvūninių riebalų deginimą terminiame katile taikanti įmonė",
//     "OHPHBP – alternatyvų perdirbimo metodą – aukšto slėgio hidrolizės procesą taikanti biodujų gamybos įmonė",
//     "OMSCP – alternatyvų perdirbimo metodą – daugiapakopį katalitinį procesą degalams iš atsinaujinančių išteklių gaminti taikanti įmonė",
//     "PROCP – šalutinių gyvūninių produktų perdirbimo įmonė",
//   ],

//   "30": [
//     "OALKHP – alternatyvų perdirbimo metodą – šarminę hidrolizę taikanti įmonė",
//     "OBIODP – alternatyvų perdirbimo metodą taikanti biodyzelino gamybos įmonė",
//     "OCAFTB – alternatyvų perdirbimo metodą – gyvūninių riebalų deginimą terminiame katile taikanti įmonė",
//     "OHPHBP – alternatyvų perdirbimo metodą – aukšto slėgio hidrolizės procesą taikanti biodujų gamybos įmonė",
//     "OMSCP – alternatyvų perdirbimo metodą – daugiapakopį katalitinį procesą degalams iš atsinaujinančių išteklių gaminti taikanti įmonė",
//     "PROCP – šalutinių gyvūninių produktų perdirbimo įmonė",
//     "OBRGAP – alternatyvų perdirbimo metodą – Brookes dujinimo procesą taikanti įmonė",
//     "OEFP – alternatyvų perdirbimo metodą – žuvų žaliavų silosavimą taikanti įmonė",
//     "OHPHTP – alternatyvų perdirbimo metodą – aukšto slėgio ir aukštos temperatūros procesą taikanti įmonė",
//     "OMSCHy – alternatyvų metodą – daugiapakopį katalitinį apdorojimą vandeniu degalams iš atsinaujinančių išteklių gaminti taikanti įmonė",
//     "OTMB – alternatyvų perdirbimo metodą – termomechaninį biodegalų gamybos procesą taikanti įmonė",
//     "OLTPPM – alternatyvų perdirbimo metodą – kiaulių ir naminių paukščių mėšlo apdorojimą kalkėmis taikanti įmonė",
//   ],

//   "31": [
//     "OALKHP – alternatyvų perdirbimo metodą – šarminę hidrolizę taikanti įmonė",
//     "OBIODP – alternatyvų perdirbimo metodą taikanti biodyzelino gamybos įmonė",
//     "OCAFTB – alternatyvų perdirbimo metodą – gyvūninių riebalų deginimą terminiame katile taikanti įmonė",
//     "OHPHBP – alternatyvų perdirbimo metodą – aukšto slėgio hidrolizės procesą taikanti biodujų gamybos įmonė",
//     "OMSCP – alternatyvų perdirbimo metodą – daugiapakopį katalitinį procesą degalams iš atsinaujinančių išteklių gaminti taikanti įmonė",
//     "PROCP – šalutinių gyvūninių produktų perdirbimo įmonė",
//     "OBRGAP – alternatyvų perdirbimo metodą – Brookes dujinimo procesą taikanti įmonė",
//     "OEFP – alternatyvų perdirbimo metodą – žuvų žaliavų silosavimą taikanti įmonė",
//     "OHPHTP – alternatyvų perdirbimo metodą – aukšto slėgio ir aukštos temperatūros procesą taikanti įmonė",
//     "OMSCHy – alternatyvų metodą – daugiapakopį katalitinį apdorojimą vandeniu degalams iš atsinaujinančių išteklių gaminti taikanti įmonė",
//     "OTMB – alternatyvų perdirbimo metodą – termomechaninį biodegalų gamybos procesą taikanti įmonė",
//   ],

//   "32": [
//     "BIOGP – biodujų gamybos įmonė",
//   ],

//   "33": [
//     "COMP – kompostavimo įmonė",
//   ],

//   "34": [
//     "STORP – šalutinių gyvūninių produktų ir jų gaminių saugojimo įmonė",
//   ],

//   "35": [
//     "PETPP – gyvūnų augintinių ėdalo gamybos įmonė, naudojanti tik perdirbtus šalutinius gyvūninius produktus",
//     "PETPR – gyvūnų augintinių ėdalo gamybos įmonė, naudojanti tik neperdirbtus šalutinius gyvūninius produktus",
//   ],

//   "36": [
//     "COLC – šalutinių gyvūninių produktų surinkimo centras",
//   ],

//   "37": [
//     "CONTMT – izoliavimo metodus taikanti įmonė",
//     "GATRP – medžioklės trofėjų gamybos įmonė",
//     "TAN – odų ir kailių rauginimas",
//     "TECH – panaudojimas techniniams produktams, kurie nėra nurodyti kitur",
//   ],

//   "38": [
//     "CoIP – bendro deginimo įmonė",
//   ],

//   "39": [
//     "INCP – deginimo įmonė",
//   ],

//   "40": [
//     "OFSIPP – organinių trąšų arba dirvožemį gerinančių medžiagų gamybos įmonė, naudojanti šalutinių gyvūninių produktų gaminius",
//     "UFERT – šalutinių gyvūninių produktų ir jų gaminių naudojimas organinėms trąšoms ir dirvos savybėms gerinti",
//   ],

//   "42": [
//     "OLCP – aliejaus chemijos gamybos įmonė",
//   ],

//   "78": [
//     "TRANS – šalutinių gyvūninių produktų ir jų gaminių vežimas",
//   ],

//   "80": [
//     "UDER – šalutinių gyvūninių produktų ir jų gaminių naudojimas diagnostikai, švietimui ir (ar) tyrimams (įskaitant testavimą) (nurodykite)",
//     "UDOG – šalutinių gyvūninių produktų naudojimas registruotų / patvirtintų šunų veisėjų ir gyvūnų globos namų laikomiems šunims ir katėms šerti",
//     "UEXART – šalutinių gyvūninių produktų ir jų gaminių naudojimas parodoms ir (ar) meninei veiklai (nurodykite)",
//     "UFUR – šalutinių gyvūninių produktų naudojimas kailiniams gyvūnams šerti",
//     "UINSE – šalutinių gyvūninių produktų naudojimas vabzdžiams, įskaitant jų lervas ir vikšrus, ir kirminams, naudojamiems žvejybos masalui, šerti",
//     "UNEC – šalutinių gyvūninių produktų naudojimas maitlesiams paukščiams lesinti",
//     "URBP – šalutinių gyvūninių produktų naudojimas ropliams ir plėšriesiems paukščiams šerti",
//     "UWILD – šalutinių gyvūninių produktų naudojimas laukiniams gyvūnams šerti",
//     "UZOO – šalutinių gyvūninių produktų naudojimas zoologijos sodo / cirko gyvūnams šerti",
//   ],

//   "82": [
//     "UFERT – šalutinių gyvūninių produktų ir jų gaminių naudojimas organinėms trąšoms ir dirvos savybėms gerinti",
//   ],

//   "89": [
//     "OFSIBU – birių organinių trąšų arba dirvožemį gerinančių medžiagų platintojai",
//     "OFSIPA – supakuotų organinių trąšų ar dirvožemį gerinančių medžiagų platintojai",
//     "OTHER – kita šalutinių gyvūninių produktų ir jų gaminių tvarkymo veikla (nurodykite)",
//     "PHAR – farmacinė veikla (apimanti visų tipų medicinines priemones)",
//     "UCOSM – šalutinių gyvūninių produktų ir jų gaminių naudojimas kosmetikos produktams gaminti",
//   ],
// };

export const activitySubactivityMap = {
  '25': ['COLL', 'INTP', 'STORP'],
  '26': ['COLL', 'INTP', 'STORP'],
  '27': ['COMBP'],
  '28': ['RETAIL', 'TRADE'],
  '29': ['OALKHP', 'OBIODP', 'OCAFTB', 'OHPHBP', 'OMSCP', 'PROCP'],
  '30': [
    'OALKHP',
    'OBIODP',
    'OCAFTB',
    'OHPHBP',
    'OMSCP',
    'PROCP',
    'OBRGAP',
    'OEFP',
    'OHPHTP',
    'OMSCHy',
    'OTMB',
    'OLTPPM',
  ],
  '31': [
    'OALKHP',
    'OBIODP',
    'OCAFTB',
    'OHPHBP',
    'OMSCP',
    'PROCP',
    'OBRGAP',
    'OEFP',
    'OHPHTP',
    'OMSCHy',
    'OTMB',
  ],
  '32': ['BIOGP'],
  '33': ['COMP'],
  '34': ['STORP'],
  '35': ['PETPP', 'PETPR'],
  '36': ['COLC'],
  '37': ['CONTMT', 'GATRP', 'TAN', 'TECH'],
  '38': ['CoIP'],
  '39': ['INCP'],
  '40': ['OFSIPP', 'UFERT'],
  '42': ['OLCP'],
  '78': ['TRANS'],
  '80': ['UDER', 'UDOG', 'UEXART', 'UFUR', 'UINSE', 'UNEC', 'URBP', 'UWILD', 'UZOO'],
  '82': ['UFERT'],
  '89': ['OFSIBU', 'OFSIPA', 'OTHER', 'PHAR', 'UCOSM'],
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
