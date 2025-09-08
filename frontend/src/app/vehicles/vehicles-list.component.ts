import { Component, OnInit, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

      <form class="card" (ngSubmit)="add()" #f="ngForm">
        <h2>Novo Veículo</h2>
        <div class="grid">
          <label
            >Placa
            <input
              name="placa"
              required
              maxlength="7"
              [(ngModel)]="form.placa"
              placeholder="ABC1D23"
            />
          </label>
          <label
            >Chassi
            <input
              name="chassi"
              required
              minlength="17"
              maxlength="20"
              [(ngModel)]="form.chassi"
            />
          </label>
          <label
            >Renavam
            <input
              name="renavam"
              required
              minlength="9"
              maxlength="11"
              [(ngModel)]="form.renavam"
            />
          </label>
          <label
            >Modelo
            <input name="modelo" required [(ngModel)]="form.modelo" />
          </label>
          <label
            >Marca
            <input name="marca" required [(ngModel)]="form.marca" />
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
            />
          </label>
        </div>
        <button type="submit" [disabled]="f.invalid || creating">
          Adicionar
        </button>
        <span *ngIf="createError" class="error">{{ createError }}</span>
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
      .actions {
        display: flex;
        gap: 0.5rem;
      }
    `,
  ],
})
export class VehiclesListComponent implements OnInit {
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

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    this.svc.refresh();
  }

  add() {
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
}
