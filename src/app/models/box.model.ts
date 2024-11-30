export interface Item {
  id: number;
  name: string;
  width: number;
  height: number;
  length: number;

}

export const availableItems: Item[] = [
  { id: 1, name: 'Пеленки Helen Harper Basic 60*90 см, 30 шт ', width: 25.5, length: 28, height: 12.5 },
  { id: 2, name: 'Пеленки одноразовые HH BASIC 60X90, 30 шт - спайка 4 шт  ', width: 30, length: 56, height: 26.5 },
  { id: 3, name: 'Пеленки Helen Harper Basic 60X90 см, 180 шт (спайка 6шт)', width: 57, length: 39.5, height: 32.5 },
  { id: 4, name: 'Пеленки Helen Harper Basic 60x90 см, 30 шт + подарок 5пар бахил', width: 33, length: 49, height: 41},
  { id: 5, name: 'Пеленки Helen Harper 60*60 см , 30 шт', width: 28, length: 30, height: 13},
];