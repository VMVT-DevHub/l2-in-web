import { AnimalForms, FoodForms, FormTypes, HistoryTypes, StatusTypes } from './constants';

export const requestStatusLabels = {
  [StatusTypes.CREATED]: 'Pateiktas',
  [StatusTypes.SUBMITTED]: 'Pateiktas pakartotinai ',
  [StatusTypes.RETURNED]: 'Grąžintas taisymui',
  [StatusTypes.REJECTED]: 'Atmestas',
  [StatusTypes.APPROVED]: 'Patvirtintas',
  [StatusTypes.COMPLETED]: 'Sertifikatas išduotas',
  [StatusTypes.DRAFT]: 'Juodraštis',
};

export const animalStatusLabels = {
  [StatusTypes.DRAFT]: 'Juodraštis',
  [StatusTypes.CREATED]: 'Pateiktas',
  [StatusTypes.DECIDING]: 'Vertinamas',
  [StatusTypes.SUBMITTED]: 'Pateiktas pakartotinai',
  [StatusTypes.RETURNED]: 'Grąžintas taisymui',
  [StatusTypes.REJECTED]: 'Atmestas',
  [StatusTypes.ACCEPTED]: 'Priimtas',
};

export const decisionsStatusLabels = {
  [StatusTypes.APPROVED]: 'Suteiktas',
  [StatusTypes.REJECTED]: 'Atmestas',
  [StatusTypes.TEMP_APPROVED]: 'Laikinai patvirtintas',
};

export const requestFormHistoryDescriptions = {
  [HistoryTypes.CREATED]: 'pateikė prašymą',
  [HistoryTypes.SUBMITTED]: 'pateikė pakartotinai prašymą',
  [HistoryTypes.RETURNED]: 'grąžino taisyti pateiktą prašymą',
  [HistoryTypes.REJECTED]: 'atmetė pateiktą prašymą',
  [HistoryTypes.APPROVED]: 'patvirtino prašymą',
  [HistoryTypes.COMPLETED]: 'išdavė sertifikatą',
};

export const formTypeLabels = {
  [FormTypes.CERTIFICATES]: 'Sertifikatai',
};

export const foodReasonLabels = {
  [FoodForms.CREATE]: 'Registravimas',
  [FoodForms.UPDATE]: 'Tikslinimas',
  [FoodForms.REMOVE]: 'Panaikinimas',
};

export const animalReasonLabels = {
  [AnimalForms.CREATE]: 'Registravimas',
  [AnimalForms.EDIT]: 'Tikslinimas',
  [AnimalForms.REMOVE]: 'Panaikinimas',
  [AnimalForms.RESUME]: 'Atšaukimas',
};

export const buttonLabels = {
  confirm: 'Patvirtinti',
  cancel: 'Atšaukti',
};

export const fileUploadErrors = {
  badFileTypes: 'Blogi failų tipai',
  fileSizesExceeded: 'Viršyti failų dydžiai',
};

export const paragraphs = {
  legalBasis:
    'CLIS, atsižvelgdamas į atlikto veiklos vertinimo vietoje rezultatus ir įrodymus, patvirtinančius, kad veiklos vertinimo vietoje metu nustatyti neatitikimai pašalinti, kai pagal Aprašo 20 punktą buvo nurodytas terminas neatitikimams pašalinti, per Aprašo 16 punkte nurodytą terminą priima sprendimą dėl patvirtinimo ar laikinojo patvirtinimo suteikimo arba atsisakymo jį suteikti. Tuo atveju, kai atsisakoma kontrolės subjektui suteikti patvirtinimą / laikinąjį patvirtinimą, kontrolės subjektui turi būti nurodomi tokio sprendimo motyvai ir pagrindai.',
  complaintInfo:
    'Šis įsakymas per vieną mėnesį nuo jo gavimo dienos gali būti skundžiamas Valstybinės maisto ir veterinarijos tarnybos direktoriaus 2007 m. spalio 31 d. įsakymo Nr. B1-790 „Dėl asmenų prašymų ir skundų nagrinėjimo Valstybinėje maisto ir veterinarijos tarnyboje“ nustatyta tvarka Valstybinei maisto ir veterinarijos tarnybai (Siesikų g. 19, Vilnius), Lietuvos Respublikos ikiteisminio administracinių ginčų nagrinėjimo tvarkos įstatymo nustatyta tvarka Lietuvos administracinių ginčų komisijai (A. Goštauto g. 12-100, Vilnius) arba Lietuvos Respublikos administracinių bylų teisenos įstatymo nustatyta tvarka Regionų administraciniam teismui, skundą paduodant bet kuriuose teismo rūmuose: Vilniaus rūmuose (Žygimantų g. 2, Vilnius), Kauno rūmuose (A. Mickevičiaus g. 8A, Kaunas), Klaipėdos rūmuose (Galinio Pylimo g. 9, Klaipėda), Šiaulių rūmuose (Dvaro g. 80, Šiauliai), Panevėžio rūmuose (Respublikos g. 62, Panevėžys).',
};
