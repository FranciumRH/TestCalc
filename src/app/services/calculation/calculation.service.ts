import { Injectable } from '@angular/core';
import { Item } from '../../models/box.model';
import { Pallet } from '../../models/pallet.model';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {

  constructor() { }

  calculateBoxesOnPallet(box: Item, pallet: Pallet): number {
    const palletArea = pallet.width * pallet.length;
    const boxArea = box.width * box.length;
    const boxesByArea = Math.floor(palletArea / boxArea);
    const availableHeight = pallet.maxHeight - pallet.height;
    const boxesByHeight = Math.floor(availableHeight / box.height);

    return boxesByArea * boxesByHeight
  }
}
