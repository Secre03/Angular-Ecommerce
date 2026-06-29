import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h4 class="page-title">Category Management</h4>
      <div class="card p-3 mb-3">
        <h6>{{ editing ? 'Edit Category' : 'Add Category' }}</h6>
        <div class="row g-2">
          <div class="col-md-5"><input class="form-control" placeholder="Name *" [(ngModel)]="form.name"></div>
          <div class="col-md-5"><input class="form-control" placeholder="Description" [(ngModel)]="form.description"></div>
          <div class="col-md-2"><button class="btn btn-success w-100" (click)="save()">{{ editing ? 'Update' : 'Add' }}</button></div>
        </div>
        <button class="btn btn-sm btn-link mt-1" *ngIf="editing" (click)="cancelEdit()">Cancel edit</button>
      </div>
      <table class="table bg-white">
        <thead><tr><th>Name</th><th>Slug</th><th>Description</th><th></th></tr></thead>
        <tbody>
          <tr *ngFor="let c of categories">
            <td>{{ c.name }}</td>
            <td><code>{{ c.slug }}</code></td>
            <td>{{ c.description }}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary me-1" (click)="edit(c)">Edit</button>
              <button class="btn btn-sm btn-outline-danger" (click)="delete(c)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class AdminCategoriesComponent implements OnInit {
  categories: any[] = [];
  form: any = { name: '', description: '' };
  editing: any = null;

  constructor(private categorySvc: CategoryService) {}

  ngOnInit() { this.load(); }

  load() { this.categorySvc.getCategories().subscribe(res => this.categories = res.data); }

  save() {
    if (!this.form.name) return alert('Name is required.');
    const action = this.editing
      ? this.categorySvc.updateCategory(this.editing._id, this.form)
      : this.categorySvc.createCategory(this.form);
    action.subscribe({
      next: () => { this.load(); this.cancelEdit(); },
      error: err => alert(err.error?.message)
    });
  }

  edit(c: any) { this.editing = c; this.form = { name: c.name, description: c.description }; }
  cancelEdit() { this.editing = null; this.form = { name: '', description: '' }; }

  delete(c: any) {
    if (!confirm(`Delete "${c.name}"?`)) return;
    this.categorySvc.deleteCategory(c._id).subscribe({
      next: () => this.load(),
      error: err => alert(err.error?.message)
    });
  }
}