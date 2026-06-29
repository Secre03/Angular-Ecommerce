import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { CategoryService } from '../../../../core/services/category.service';

@Component({
  selector: 'app-seller-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4" style="max-width:700px">
      <h4 class="page-title">{{ isEdit ? 'Edit Product' : 'New Product' }}</h4>
      <div class="alert alert-success" *ngIf="msg">{{ msg }}</div>
      <div class="alert alert-danger" *ngIf="error">{{ error }}</div>
      <div class="card p-3">
        <div class="row g-2">
          <div class="col-12"><label class="form-label">Product Name *</label><input class="form-control" [(ngModel)]="form.name"></div>
          <div class="col-12"><label class="form-label">Description *</label><textarea class="form-control" [(ngModel)]="form.description" rows="4"></textarea></div>
          <div class="col-md-6">
            <label class="form-label">Category *</label>
            <select class="form-select" [(ngModel)]="form.category">
              <option value="">Select category</option>
              <option *ngFor="let c of categories" [value]="c._id">{{ c.name }}</option>
            </select>
          </div>
          <div class="col-md-6"><label class="form-label">SKU</label><input class="form-control" [(ngModel)]="form.sku"></div>
          <div class="col-md-4"><label class="form-label">Price (₱) *</label><input class="form-control" type="number" [(ngModel)]="form.price"></div>
          <div class="col-md-4"><label class="form-label">Discount (%)</label><input class="form-control" type="number" [(ngModel)]="form.discount" min="0" max="100"></div>
          <div class="col-md-4"><label class="form-label">Quantity *</label><input class="form-control" type="number" [(ngModel)]="form.quantity"></div>
        </div>

        <div class="mt-3">
          <button class="btn btn-primary me-2" (click)="save()" [disabled]="loading || savedOnce">
            {{ loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Save Product') }}
          </button>
          <button class="btn btn-outline-secondary" (click)="router.navigate(['/seller/products'])">Cancel</button>
        </div>
      </div>

      <!-- Image upload — shown after product is saved -->
      <div class="card p-3 mt-3" *ngIf="productId">
        <h6>Product Images</h6>
        <div *ngIf="existingImages.length > 0" class="d-flex flex-wrap gap-2 mb-2">
          <img *ngFor="let img of existingImages" [src]="'/uploads/products/' + img"
            style="width:80px;height:80px;object-fit:cover;border-radius:4px;border:1px solid #ddd">
        </div>
        <p class="text-muted small" *ngIf="existingImages.length === 0">No images yet.</p>
        <input type="file" class="form-control mb-2" multiple accept="image/*" (change)="onFiles($event)">
        <button class="btn btn-secondary" (click)="uploadImages()" [disabled]="files.length === 0 || uploading">
          {{ uploading ? 'Uploading...' : 'Upload ' + (files.length > 0 ? files.length + ' image(s)' : 'Images') }}
        </button>
        <div class="alert alert-success mt-2" *ngIf="uploadMsg">{{ uploadMsg }}</div>
      </div>
    </div>
  `
})
export class SellerProductFormComponent implements OnInit {
  form: any = { name: '', description: '', category: '', sku: '', price: 0, discount: 0, quantity: 0 };
  categories: any[] = [];
  files: File[] = [];
  existingImages: string[] = [];
  productId = '';
  isEdit = false;
  savedOnce = false;
  msg = ''; error = ''; uploadMsg = '';
  loading = false; uploading = false;

  constructor(
    private productSvc: ProductService,
    private categorySvc: CategoryService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.categorySvc.getCategories().subscribe(res => this.categories = res.data);
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    if (this.productId) {
      this.isEdit = true;
      this.productSvc.getMyProduct(this.productId).subscribe(res => {
        const p = res.data;
        this.existingImages = p.images || [];
        this.form = {
          name: p.name, description: p.description,
          category: p.category?._id, sku: p.sku,
          price: p.price, discount: p.discount, quantity: p.quantity
        };
      });
    }
  }

  onFiles(e: any) { this.files = Array.from(e.target.files); }

  uploadImages() {
    if (!this.productId) return;
    this.uploading = true; this.uploadMsg = '';
    const fd = new FormData();
    this.files.forEach(f => fd.append('images', f));
    this.productSvc.uploadImages(this.productId, fd).subscribe({
      next: (res: any) => {
        this.uploadMsg = 'Images uploaded successfully!';
        this.existingImages = res.data?.images || this.existingImages;
        this.files = [];
        this.uploading = false;
        setTimeout(() => this.uploadMsg = '', 3000);
      },
      error: err => { this.error = err.error?.message || 'Upload failed.'; this.uploading = false; }
    });
  }

  save() {
    this.loading = true; this.msg = ''; this.error = '';
    const action = this.isEdit
      ? this.productSvc.updateProduct(this.productId, this.form)
      : this.productSvc.createProduct(this.form);
    action.subscribe({
      next: res => {
        if (!this.isEdit) {
          this.productId = res.data._id;
          this.isEdit = true;
          this.savedOnce = true;
          this.msg = 'Product created! You can now upload images below, then click Cancel when done.';
        } else {
          this.msg = 'Product updated!';
        }
        this.loading = false;
      },
      error: err => { this.error = err.error?.message || 'Failed.'; this.loading = false; }
    });
  }
}