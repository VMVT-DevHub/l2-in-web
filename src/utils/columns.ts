export const certificateColumns = {
  no: { show: true, label: 'Prašymo Nr.' },
  formTitle: { show: true, label: 'Rūšis' },
  productNames: { show: true, label: 'Prekės pavadinimas' },
  importingCountry: { show: true, label: 'Šalis importuotoja' },
  productAmount: { show: true, label: 'Kiekis' },
  date: { show: true, label: 'Data' },
  status: { show: true, label: 'Statusas' },
};

export const foodRequestColumns = {
  no: { show: true, label: 'Prašymo Nr.' },
  reason: { show: true, label: 'Tikslas' },
  subject: { show: true, label: 'Maisto tvarkymo subjektas' },
  date: { show: true, label: 'Data' },
  submitter: { show: true, label: 'Pateikė' },
  status: { show: true, label: 'Būsena' },
};

export const animalRequestColumns = {
  no: { show: true, label: 'Prašymo Nr.' },
  reason: { show: true, label: 'Tikslas' },
  actionPlace: { show: true, label: 'Veiklavietės pavadinimas' },
  action: { show: true, label: 'Veikla' },
  date: { show: true, label: 'Data' },
  submitter: { show: true, label: 'Pateikė' },
  status: { show: true, label: 'Būsena' },
};

export const animalDecisionColumns = {
  no: { show: true, label: 'Prašymo Nr.' },
  actionId: { show: true, label: 'Veiklos Nr.' },
  actionTitle: { show: true, label: 'Veikla' },
  date: { show: true, label: 'Data' },
};
