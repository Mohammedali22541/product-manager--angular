import { Product } from './../product';
import { FlowbiteService } from '../flowbite.service';
import { initFlowbite } from 'flowbite';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SearchProductsPipePipe } from '../search-products-pipe.pipe';

@Component({
  selector: 'app-store-manger',
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    FormsModule,
    SearchProductsPipePipe,
  ],
  templateUrl: './store-manger.component.html',
  styleUrl: './store-manger.component.scss',
})
export class StoreMangerComponent implements OnInit {
  constructor(private flowbiteService: FlowbiteService) {}

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });

    this.getProductsfromLocalStorage();
    this.toastrService.toastrConfig.progressBar = true;
    this.toastrService.toastrConfig.timeOut = 2000;
  }

  allProducts: Product[] = [];
  isLoading: boolean = false; // Changed from isLoding
  selectedProductIndex: number | null = null; // Changed from SelectedProductIndex
  inEditMode: boolean = false;
  term: string = '';

  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  private readonly toastrService = inject(ToastrService);

  @ViewChild('crudModal') crudModal: ElementRef | undefined;
  @ViewChild('deleteModal') deleteModal: ElementRef | undefined;

  addProductForm: FormGroup = new FormGroup({
    name: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
    price: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    category: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string | null>(null, [Validators.required]),
  });

  addProduct() {
    this.allProducts.push(this.addProductForm.value);
    this.saveToLocalStorage();
    this.toastrService.success('Product added successfully!', 'Store Manager');
    this.toastrService.toastrConfig.progressBar = true;
    this.toastrService.toastrConfig.timeOut = 2000;
    this.onReset();
    this.closeModal();
  }

  saveToLocalStorage() {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      localStorage.setItem('products', JSON.stringify(this.allProducts));
    }
  }

  getProductsfromLocalStorage() {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      const products = localStorage?.getItem('products');
      if (products) {
        this.allProducts = JSON.parse(products);
      }
    }
  }

  onSubmit() {
    if (this.addProductForm.valid) {
      if (this.inEditMode) {
        this.updateProduct();
        this.getProductsfromLocalStorage();
      } else {
        this.addProduct();
        // this.onReset();
        this.getProductsfromLocalStorage();
      }
    } else {
      console.log('form is not valid');

      return;
    }
  }

  onReset() {
    this.addProductForm.reset();
    this.addProductForm.markAsPristine();
    this.addProductForm.markAsUntouched();
  }

  onDelete(index: number) {
    this.allProducts.splice(index, 1);
    this.saveToLocalStorage();
    this.getProductsfromLocalStorage();
    this.toastrService.success(
      'Product deleted successfully!',
      'Store Manager'
    );
  }

  deleteAllProduct() {
    this.allProducts = [];
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      localStorage.removeItem('products');
    }
    this.toastrService.info(
      'All products deleted successfully!',
      'Store Manager'
    );

    this.closeDeleteModal();
  }

  // editProduct(index: number) {
  //   this.selectedProductIndex = index;
  //   this.inEditMode = true;
  //   this.addProductForm.patchValue(this.allProducts[index]);
  //   this.showModal();
  // }

  // updateProduct() {
  //   if (this.addProductForm.valid) {
  //     if (this.selectedProductIndex !== null) {
  //       this.allProducts[this.selectedProductIndex] = this.addProductForm.value;
  //     }
  //     this.saveToLocalStorage();
  //     this.toastrService.info('Product updated successfully!', 'Store Manager');
  //     this.selectedProductIndex = null;
  //     this.onReset();
  //     this.closeModal();
  //   }
  // }

  showModal(): void {
    this.crudModal?.nativeElement.classList.replace('hidden', 'flex');
  }

  closeModal(): void {
    this.crudModal?.nativeElement.classList.replace('flex', 'hidden');
    this.onReset();
    this.inEditMode = false; // Added reset of edit mode
    this.selectedProductIndex = null; // Added reset of selected index
  }

  // Updated editProduct method with new property name
  editProduct(index: number) {
    this.selectedProductIndex = index;
    this.inEditMode = true;
    this.addProductForm.patchValue(this.allProducts[index]);
    this.showModal();
  }

  // Updated updateProduct method with new property name
  updateProduct() {
    if (this.addProductForm.valid) {
      if (this.selectedProductIndex !== null) {
        this.allProducts[this.selectedProductIndex] = this.addProductForm.value;
      }
      this.saveToLocalStorage();
      this.toastrService.info('Product updated successfully!', 'Store Manager');
      this.selectedProductIndex = null;
      this.onReset();
      this.closeModal();
    }
  }

  hideModal(e: MouseEvent): void {
    if (e.target == this.crudModal?.nativeElement) {
      e.stopPropagation();

      (e.target as HTMLElement).classList.replace('flex', 'hidden');
      this.onReset();
    } else if (e.target == this.deleteModal?.nativeElement) {
      e.stopPropagation();

      (e.target as HTMLElement).classList.replace('flex', 'hidden');
    }
  }

  showDeleteModal(): void {
    this.deleteModal?.nativeElement.classList.replace('hidden', 'flex');
  }

  closeDeleteModal(): void {
    this.deleteModal?.nativeElement.classList.replace('flex', 'hidden');
  }

  @HostListener('document:keyup', ['$event'])
  hideModalWithKeyboard(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModal();
      this.onReset();
    }

    if (event.key === 'Enter') {
      if (this.addProductForm.valid) {
        this.onSubmit();
      }
    }
  }
}
