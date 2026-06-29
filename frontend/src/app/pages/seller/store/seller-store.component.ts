import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../../core/services/store.service';
import * as L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

@Component({
  selector: 'app-seller-store',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [
    `
      #store-map {
        height: 350px;
        width: 100%;
        border-radius: 8px;
        z-index: 1;
      }
      .search-results {
        position: absolute;
        z-index: 9999;
        background: white;
        border: 1px solid #ddd;
        border-radius: 6px;
        width: 100%;
        max-height: 200px;
        overflow-y: auto;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      .search-result-item {
        padding: 10px 12px;
        cursor: pointer;
        font-size: 0.875rem;
        border-bottom: 1px solid #f0f0f0;
      }
      .search-result-item:hover {
        background: #f0f7ff;
      }
      .search-result-item:last-child {
        border-bottom: none;
      }
      .map-wrapper {
        position: relative;
      }
    `,
  ],
  template: `
    <div class="container mt-4">
      <h4 class="page-title">My Store</h4>
      <div class="alert alert-success" *ngIf="msg">{{ msg }}</div>
      <div class="alert alert-danger" *ngIf="error">{{ error }}</div>
      <div
        class="alert alert-warning"
        *ngIf="store && store.status === 'pending'"
      >
        Your store is pending admin approval.
      </div>
      <div
        class="alert alert-danger"
        *ngIf="store && store.status === 'rejected'"
      >
        Store rejected. Reason: {{ store.rejectionReason }}
      </div>

      <!-- Store Details -->
      <div class="card p-3 mb-3">
        <h6>{{ store ? 'Edit Store' : 'Create Store' }}</h6>
        <div class="row g-2">
          <div class="col-md-6">
            <label class="form-label">Store Name *</label>
            <input class="form-control" [(ngModel)]="form.name" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Contact Number</label>
            <input class="form-control" [(ngModel)]="form.contactNumber" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Email</label>
            <input class="form-control" [(ngModel)]="form.email" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Province *</label>
            <input class="form-control" [(ngModel)]="form.location.province" />
          </div>
          <div class="col-md-6">
            <label class="form-label">City/Municipality *</label>
            <input class="form-control" [(ngModel)]="form.location.city" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Barangay *</label>
            <input class="form-control" [(ngModel)]="form.location.barangay" />
          </div>
          <div class="col-12">
            <label class="form-label">Complete Address *</label>
            <input
              class="form-control"
              [(ngModel)]="form.location.completeAddress"
              placeholder="e.g. Purok 3, Busay, Daraga, Albay"
            />
          </div>
          <div class="col-12">
            <label class="form-label">Description</label>
            <textarea
              class="form-control"
              [(ngModel)]="form.description"
              rows="2"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Map Card -->
      <div class="card p-3 mb-3">
        <h6>Pin Your Exact Store Location</h6>
        <p class="text-muted small mb-2">
          Search for your location below, or click directly on the map to drop a
          pin. You can also drag the pin to fine-tune.
        </p>

        <!-- Search Box -->
        <div class="position-relative mb-2">
          <div class="input-group">
            <input
              class="form-control"
              [(ngModel)]="mapSearch"
              (input)="onSearchInput()"
              (keyup.enter)="searchLocation()"
              placeholder="Search: e.g. Busay Daraga Albay Philippines"
            />
            <button
              class="btn btn-outline-primary"
              (click)="searchLocation()"
              [disabled]="searching"
            >
              {{ searching ? '...' : '🔍 Search' }}
            </button>
          </div>

          <!-- Autocomplete Results -->
          <div class="search-results" *ngIf="searchResults.length > 0">
            <div
              class="search-result-item"
              *ngFor="let r of searchResults"
              (click)="selectResult(r)"
            >
              {{ r.display_name }}
            </div>
          </div>

          <div class="search-results p-2 text-muted small" *ngIf="noResults">
            No results found. Try a more specific search or click on the map
            manually.
          </div>
        </div>

        <!-- Map -->
        <div class="map-wrapper">
          <div id="store-map"></div>
        </div>

        <!-- Coordinates display -->
        <div class="mt-2">
          <span
            *ngIf="form.location.latitude && form.location.longitude"
            class="text-success small"
          >
            Location pinned: {{ form.location.latitude }},
            {{ form.location.longitude }}
          </span>
          <span
            *ngIf="!form.location.latitude || !form.location.longitude"
            class="text-warning small"
          >
            No location pinned yet. Search or click on the map.
          </span>
        </div>
      </div>

      <!-- Save Button -->
      <div class="card p-3 mb-3">
        <div
          class="alert alert-warning py-2 small mb-2"
          *ngIf="!form.location.latitude || !form.location.longitude"
        >
          Please pin your store location on the map before saving.
        </div>
        <button
          class="btn btn-primary"
          (click)="save()"
          [disabled]="
            loading || !form.location.latitude || !form.location.longitude
          "
        >
          {{ loading ? 'Saving...' : store ? 'Update Store' : 'Create Store' }}
        </button>
      </div>

      <!-- Status -->
      <div class="card p-3" *ngIf="store">
        <h6>
          Store Status:
          <span class="badge" [ngClass]="statusClass(store.status)">{{
            store.status
          }}</span>
        </h6>
      </div>
    </div>
  `,
})
export class SellerStoreComponent implements OnInit, AfterViewInit, OnDestroy {
  store: any = null;
  msg = '';
  error = '';
  loading = false;
  mapSearch = '';
  searchResults: any[] = [];
  searching = false;
  noResults = false;
  searchTimer: any;

  form: any = {
    name: '',
    description: '',
    contactNumber: '',
    email: '',
    location: {
      province: '',
      city: '',
      barangay: '',
      completeAddress: '',
      latitude: null,
      longitude: null,
    },
  };

  private map!: L.Map;
  private marker!: L.Marker;

  constructor(private storeSvc: StoreService) {}

  ngOnInit() {
    this.storeSvc.getMyStore().subscribe({
      next: (res) => {
        this.store = res.data;
        this.form = {
          name: res.data.name || '',
          description: res.data.description || '',
          contactNumber: res.data.contactNumber || '',
          email: res.data.email || '',
          location: { ...res.data.location },
        };
        if (
          this.map &&
          res.data.location?.latitude &&
          res.data.location?.longitude
        ) {
          this.setMarker(
            res.data.location.latitude,
            res.data.location.longitude,
          );
        }
      },
      error: () => {},
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.initMap(), 200);
  }

  ngOnDestroy() {
    if (this.map) this.map.remove();
    clearTimeout(this.searchTimer);
  }

  private initMap() {
    const lat = this.form.location?.latitude || 13.1391;
    const lng = this.form.location?.longitude || 123.7438;
    const zoom = this.form.location?.latitude ? 15 : 10;

    this.map = L.map('store-map').setView([lat, lng], zoom);

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution: '© OpenStreetMap © CARTO',
        maxZoom: 19,
        subdomains: 'abcd',
      } as any,
    ).addTo(this.map);

    if (this.form.location?.latitude && this.form.location?.longitude) {
      this.setMarker(lat, lng);
    }

    // Click map to pin
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.form.location.latitude = parseFloat(lat.toFixed(6));
      this.form.location.longitude = parseFloat(lng.toFixed(6));
      this.setMarker(lat, lng);

      // Reverse geocode on map click too
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        { headers: { 'Accept-Language': 'en' } },
      )
        .then((r) => r.json())
        .then((data) => {
          const a = data.address || {};
          this.form.location.province =
            a.state || a.province || this.form.location.province;
          this.form.location.city =
            a.city ||
            a.town ||
            a.municipality ||
            a.county ||
            this.form.location.city;
          this.form.location.barangay =
            a.suburb ||
            a.village ||
            a.quarter ||
            a.neighbourhood ||
            this.form.location.barangay;
          this.form.location.completeAddress =
            data.display_name || this.form.location.completeAddress;
        })
        .catch(() => {});
    });

    setTimeout(() => this.map.invalidateSize(), 300);
  }

  private setMarker(lat: number, lng: number) {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);
      this.marker.on('dragend', (e: any) => {
        const pos = e.target.getLatLng();
        this.form.location.latitude = parseFloat(pos.lat.toFixed(6));
        this.form.location.longitude = parseFloat(pos.lng.toFixed(6));

        // Reverse geocode on drag
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.lat}&lon=${pos.lng}`,
          { headers: { 'Accept-Language': 'en' } },
        )
          .then((r) => r.json())
          .then((data) => {
            const a = data.address || {};
            this.form.location.province =
              a.state || a.province || this.form.location.province;
            this.form.location.city =
              a.city ||
              a.town ||
              a.municipality ||
              a.county ||
              this.form.location.city;
            this.form.location.barangay =
              a.suburb ||
              a.village ||
              a.quarter ||
              a.neighbourhood ||
              this.form.location.barangay;
            this.form.location.completeAddress =
              data.display_name || this.form.location.completeAddress;
          })
          .catch(() => {});

        this.updatePopup();
      });
    }
    this.map.setView([lat, lng], 16);
    this.updatePopup();
    setTimeout(() => this.map.invalidateSize(), 100);
  }

  private updatePopup() {
    if (!this.marker) return;
    this.marker
      .bindPopup(
        `
      <strong>${this.form.name || 'My Store'}</strong><br>
      ${this.form.location.completeAddress || ''}<br>
      <small class="text-muted">${this.form.location.latitude}, ${this.form.location.longitude}</small>
    `,
      )
      .openPopup();
  }

  // Debounced search as user types
  onSearchInput() {
    this.noResults = false;
    clearTimeout(this.searchTimer);
    if (this.mapSearch.length < 3) {
      this.searchResults = [];
      return;
    }
    this.searchTimer = setTimeout(() => this.searchLocation(), 600);
  }

  searchLocation() {
    if (!this.mapSearch.trim()) return;
    this.searching = true;
    this.searchResults = [];
    this.noResults = false;

    // Always append Philippines for better results
    const query = this.mapSearch.includes('Philippines')
      ? this.mapSearch
      : this.mapSearch + ', Philippines';

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ph`,
      { headers: { 'Accept-Language': 'en' } },
    )
      .then((r) => r.json())
      .then((results) => {
        this.searching = false;
        if (results?.length > 0) {
          this.searchResults = results;
        } else {
          this.noResults = true;
        }
      })
      .catch(() => {
        this.searching = false;
        this.noResults = true;
      });
  }

  selectResult(result: any) {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    this.form.location.latitude = parseFloat(lat.toFixed(6));
    this.form.location.longitude = parseFloat(lng.toFixed(6));

    // Auto-fill address fields from map result
    const address = result.display_name || '';
    const parts = address.split(',').map((p: string) => p.trim());

    // Nominatim returns: Street, Barangay, City, Province, Region, Country
    // We extract what we can
    if (parts.length >= 4) {
      // Try to fill barangay, city, province from the result
      if (!this.form.location.barangay && parts[1])
        this.form.location.barangay = parts[1];
      if (!this.form.location.city && parts[2])
        this.form.location.city = parts[2];
      if (!this.form.location.province && parts[3])
        this.form.location.province = parts[3];
    }

    // Also use the reverse geocode API to get structured address data
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      { headers: { 'Accept-Language': 'en' } },
    )
      .then((r) => r.json())
      .then((data) => {
        const a = data.address || {};
        // Fill in fields only if empty or override all
        this.form.location.province =
          a.state || a.province || this.form.location.province;
        this.form.location.city =
          a.city ||
          a.town ||
          a.municipality ||
          a.county ||
          this.form.location.city;
        this.form.location.barangay =
          a.suburb ||
          a.village ||
          a.quarter ||
          a.neighbourhood ||
          this.form.location.barangay;
        this.form.location.completeAddress =
          data.display_name || this.form.location.completeAddress;
      })
      .catch(() => {});

    this.mapSearch = '';
    this.searchResults = [];
    this.noResults = false;
    this.setMarker(lat, lng);
  }

  save() {
    this.loading = true;
    this.msg = '';
    this.error = '';
    const action = this.store
      ? this.storeSvc.updateStore(this.form)
      : this.storeSvc.createStore(this.form);
    action.subscribe({
      next: (res) => {
        this.store = res.data;
        this.msg = 'Store saved successfully!';
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed.';
        this.loading = false;
      },
    });
  }

  statusClass(s: string) {
    const map: any = {
      pending: 'bg-warning text-dark',
      approved: 'bg-success',
      rejected: 'bg-danger',
      deactivated: 'bg-secondary',
    };
    return map[s] || 'bg-secondary';
  }
}
