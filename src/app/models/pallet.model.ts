export interface Pallet {
  width: number;
  length: number;
  height: number;
  maxHeight: number; 
}

export const europeanPallet: Pallet = {
  width: 1200,
  length: 800,
  height: 150,
  maxHeight: 1600
}