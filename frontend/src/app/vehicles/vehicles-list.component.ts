import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { VehiclesService } from './vehicles.service';

@Component({
  selector: 'app-vehicles-list',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  template: `
    <section class="container">
      <h1>Veículos</h1>
      <div class="actions">
        <button (click)="reload()" [disabled]="svc.loading()">
          Recarregar
        </button>
      </div>

      <form class="card" (ngSubmit)="add(f)" #f="ngForm" novalidate>
        <h2>Novo Veículo</h2>
        <div *ngIf="f.submitted && f.invalid" class="alert error-banner">
          Existem campos inválidos. Verifique os destaques.
        </div>
        <div *ngIf="createError" class="alert api-error">{{ createError }}</div>
        <div class="grid">
          <label
            >Placa
            <input
              name="placa"
              required
              maxlength="7"
              placeholder="ABC1D23"
              [(ngModel)]="form.placa"
              #placa="ngModel"
              (input)="onFieldChange('placa')"
              [class.invalid]="placa.invalid && showError['placa']"
            />
            <small
              *ngIf="placa.errors && showError['placa']"
              class="field-error"
            >
              {{ placa.errors['required'] ? 'Placa obrigatória.' : '' }}
              {{ placa.errors['maxlength'] ? 'Máx. 7 caracteres.' : '' }}
            </small>
          </label>
          <label
            >Chassi
            <input
              name="chassi"
              required
              minlength="17"
              maxlength="20"
              [(ngModel)]="form.chassi"
              #chassi="ngModel"
              (input)="onFieldChange('chassi')"
              [class.invalid]="chassi.invalid && showError['chassi']"
            />
            <small
              *ngIf="chassi.errors && showError['chassi']"
              class="field-error"
            >
              {{ chassi.errors['required'] ? 'Chassi obrigatório.' : '' }}
              {{ chassi.errors['minlength'] ? 'Mín. 17 caracteres.' : '' }}
            </small>
          </label>
          <label
            >Renavam
            <input
              name="renavam"
              required
              minlength="9"
              maxlength="11"
              [(ngModel)]="form.renavam"
              #renavam="ngModel"
              (input)="onFieldChange('renavam')"
              [class.invalid]="renavam.invalid && showError['renavam']"
            />
            <small
              *ngIf="renavam.errors && showError['renavam']"
              class="field-error"
            >
              {{ renavam.errors['required'] ? 'Renavam obrigatório.' : '' }}
              {{ renavam.errors['minlength'] ? 'Mín. 9 caracteres.' : '' }}
            </small>
          </label>
          <label
            >Modelo
            <input
              name="modelo"
              required
              [(ngModel)]="form.modelo"
              #modelo="ngModel"
              (input)="onFieldChange('modelo')"
              [class.invalid]="modelo.invalid && showError['modelo']"
            />
            <small
              *ngIf="modelo.errors && showError['modelo']"
              class="field-error"
              >Modelo obrigatório.</small
            >
          </label>
          <label
            >Marca
            <input
              name="marca"
              required
              [(ngModel)]="form.marca"
              #marca="ngModel"
              (input)="onFieldChange('marca')"
              [class.invalid]="marca.invalid && showError['marca']"
            />
            <small
              *ngIf="marca.errors && showError['marca']"
              class="field-error"
              >Marca obrigatória.</small
            >
          </label>
          <label
            >Ano
            <input
              name="ano"
              type="number"
              required
              min="1900"
              max="2100"
              [(ngModel)]="form.ano"
              #ano="ngModel"
              (input)="onFieldChange('ano')"
              [class.invalid]="ano.invalid && showError['ano']"
            />
            <small *ngIf="ano.errors && showError['ano']" class="field-error">
              {{ ano.errors['required'] ? 'Ano obrigatório.' : '' }}
              {{ ano.errors['min'] ? 'Ano mínimo 1900.' : '' }}
              {{ ano.errors['max'] ? 'Ano máximo 2100.' : '' }}
            </small>
          </label>
        </div>
        <button type="submit" [disabled]="f.invalid || creating">
          Adicionar
        </button>
      </form>

      <div *ngIf="svc.error()" class="error">{{ svc.error() }}</div>
      <div *ngIf="svc.loading()">Carregando...</div>
      <table
        *ngIf="!svc.loading() && svc.vehicles() as list"
        class="table"
        aria-label="Lista de veículos"
      >
        <thead>
          <tr>
            <th>Placa</th>
            <th>Chassi</th>
            <th>Renavam</th>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Ano</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let v of list">
            <td>{{ v.placa }}</td>
            <td>{{ v.chassi }}</td>
            <td>{{ v.renavam }}</td>
            <td>{{ v.modelo }}</td>
            <td>{{ v.marca }}</td>
            <td>{{ v.ano }}</td>
            <td>
              <button
                class="danger"
                (click)="delete(v.id)"
                [disabled]="removingId === v.id"
              >
                Remover
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  `,
  styles: [
    `
      .container {
        max-width: 1100px;
        margin: 1rem auto;
        padding: 1rem;
        font-family: system-ui, Arial, sans-serif;
      }
      h1 {
        margin: 0 0 1rem;
      }
      form.card {
        background: #fafafa;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        margin: 1rem 0 2rem;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 0.75rem;
      }
      label {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      input {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 0.9rem;
      }
      input.invalid {
        border-color: #d32f2f;
        background: #ffecec;
      }
      button {
        cursor: pointer;
        padding: 0.5rem 0.9rem;
        border: none;
        border-radius: 4px;
        background: #1976d2;
        color: #fff;
        font-size: 0.85rem;
      }
      button.danger {
        background: #d32f2f;
      }
      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th,
      td {
        padding: 0.5rem 0.6rem;
        border-bottom: 1px solid #eee;
        text-align: left;
        font-size: 0.8rem;
      }
      th {
        background: #f5f5f5;
      }
      .error {
        color: #d32f2f;
        font-size: 0.8rem;
        margin-left: 0.75rem;
      }
      .field-error {
        color: #d32f2f;
        font-size: 0.65rem;
        margin-top: 0.2rem;
      }
      .alert {
        padding: 0.6rem 0.75rem;
        border-radius: 4px;
        font-size: 0.75rem;
        margin-bottom: 0.8rem;
      }
      .error-banner {
        background: #ffe5e5;
        border: 1px solid #d32f2f;
        color: #8b0000;
      }
      .api-error {
        background: #fff4e5;
        border: 1px solid #f5a623;
        color: #7a4b00;
      }
      .actions {
        display: flex;
        gap: 0.5rem;
      }
    `,
  ],
})
export class VehiclesListComponent implements OnInit, OnDestroy {
  svc = inject(VehiclesService);
  creating = false;
  removingId: string | null = null;
  createError: string | null = null;

  form: any = {
    placa: '',
    chassi: '',
    renavam: '',
    modelo: '',
    marca: '',
    ano: new Date().getFullYear(),
  };

  showError: Record<string, boolean> = {};
  private debounceTimers: Record<string, any> = {};
  private debounceMs = 500;

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    this.svc.refresh();
  }

  add(f: NgForm) {
    this.creating = true;
    this.createError = null;
    const { placa, chassi, renavam, modelo, marca, ano } = this.form;
    this.svc
      .create({ placa, chassi, renavam, modelo, marca, ano: Number(ano) })
      .subscribe({
        next: () => {
          this.creating = false;
          this.form = {
            placa: '',
            chassi: '',
            renavam: '',
            modelo: '',
            marca: '',
            ano: new Date().getFullYear(),
          };
          f.resetForm({ ano: new Date().getFullYear() });
          this.resetErrors();
          this.reload();
        },
        error: (e) => {
          this.creating = false;
          this.createError = e?.error?.message || 'Erro ao criar veículo';
        },
      });
  }

  delete(id: string) {
    if (!confirm('Remover veículo?')) return;
    this.removingId = id;
    this.svc.remove(id).subscribe({
      next: () => {
        this.removingId = null;
        this.reload();
      },
      error: () => (this.removingId = null),
    });
  }

  onFieldChange(field: string) {
    this.showError[field] = false;
    if (this.debounceTimers[field]) {
      clearTimeout(this.debounceTimers[field]);
    }
    this.debounceTimers[field] = setTimeout(() => {
      this.showError[field] = true;
    }, this.debounceMs);
  }

  private resetErrors() {
    Object.keys(this.debounceTimers).forEach((k) =>
      clearTimeout(this.debounceTimers[k])
    );
    this.showError = {};
    this.debounceTimers = {};
  }

  ngOnDestroy(): void {
    this.resetErrors();
  }
}
