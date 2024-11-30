import { Component, NgModule, OnInit } from '@angular/core';
import { availableItems, Item } from '../../models/box.model';
import { europeanPallet, Pallet } from '../../models/pallet.model';
import { CalculationService } from '../../services/calculation/calculation.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-input-form',
  imports: [CommonModule, FormsModule, ],
  templateUrl: './input-form.component.html',
  styleUrl: './input-form.component.scss'
})
export class InputFormComponent {
  pallet = europeanPallet;
  availableBoxes = availableItems;
  selectedBox: Item = availableItems[0];
  boxesOnPallet: number = 0;

  palletMaxHeight: number = this.pallet.maxHeight;
  constructor (private calculationService: CalculationService) {} 
  
  calculate(): void {
    const selectedBox = this.availableBoxes.find(item => item.id === this.selectedBox.id);
    if (selectedBox) {
      this.boxesOnPallet = this.calculationService.calculateBoxesOnPallet(selectedBox, this.pallet);
    }
  }
}