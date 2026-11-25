import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MonitoriaService } from '../../core/services/monitoria-service';

@Component({
  selector: 'app-monitoria-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './monitoriaForm.html'
})
export class MonitoriaForm implements OnInit {
  private service = inject(MonitoriaService);
  private rota = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  id: number | null = null;
  pronto = signal(false);
  salvando = signal(false);
  mensagem = signal('');

  formulario = this.formBuilder.group({
    disciplina: ['', Validators.required],
    nomeMonitor: ['', Validators.required],
    vagasTotais: [1, [Validators.required, Validators.min(1)]]
  });

  ngOnInit(): void {
    const idDaRota = this.rota.snapshot.paramMap.get('id');

    if (idDaRota === null) {
      this.pronto.set(true);
      return;
    }

    this.id = Number(idDaRota);

    this.service.buscarPorId(this.id).subscribe({
      next: (monitoria) => {
        this.formulario.patchValue(monitoria);
        this.pronto.set(true);
      },
      error: () => this.mensagem.set('Não foi possível carregar a monitoria.')
    });
  }

  salvar(): void {
    if (this.salvando()) {
      return;
    }

    this.formulario.markAllAsTouched();
    const valores = this.formulario.getRawValue();
    const disciplina = (valores.disciplina ?? '').trim();
    const nomeMonitor = (valores.nomeMonitor ?? '').trim();
    const vagasTotais = valores.vagasTotais;

    if (this.formulario.invalid || !disciplina || !nomeMonitor ||
        vagasTotais === null || !Number.isInteger(vagasTotais)) {
      this.mensagem.set('Informe a disciplina, o monitor e um número inteiro de vagas maior que zero.');
      return;
    }

    const dados = { disciplina, nomeMonitor, vagasTotais };
    const requisicao = this.id === null
      ? this.service.cadastrar(dados)
      : this.service.atualizar(this.id, dados);

    this.mensagem.set('');
    this.salvando.set(true);

    requisicao.subscribe({
      next: () => {
        this.salvando.set(false);
        alert('Monitoria salva com sucesso!');
        this.router.navigate(['/inicio']);
      },
      error: (resposta) => {
        this.salvando.set(false);
        this.mensagem.set(
          resposta.error?.detail ?? 'Não foi possível salvar a monitoria.'
        );
      }
    });
  }
}
