import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService} from './cliente.service';
import { Router , ActivatedRoute} from '@angular/router';
import swal from 'sweetalert2';
import { Region } from './region';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  private cliente: Cliente = new Cliente();
  regiones: Region[];
  private titulo: string = 'Crear cliente';
  private errors: string[];

  constructor(private clienteService: ClienteService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute) { }
  
  ngOnInit() {
    this.cargarCliente();
  }

  cargarCliente(): void{
    this.activatedRoute.params.subscribe(params =>{
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente);
      }
    });
    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
  }

  create(): void{
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['./clientes'])
        swal.fire('Nuevo Cliente',  `Cliente ${this.cliente.nombre} creado con éxito!`,  'success');
      },
      err =>{
        this.errors = err.error.errors as string[];
        console.error('Código del error desde el backend: '+err.status);
        console.error(err.error.errors);
      }
    )
  }

  update(): void{
    console.log(this.cliente);
    this.clienteService.updateCliente(this.cliente).subscribe(
      cliente =>{
        this.router.navigate(['./clientes'])
        swal.fire('Cliente Actualizado', `Cliente ${this.cliente.nombre} actualizado con éxito`, 'success');
      },
      err  =>{
        this.errors = err.error.errors as string[];
        console.error('Código del error desde el backend: '+err.status);
        console.error(err.error.errors);
      }
    )
  }

  compararRegion(o1:Region, o2:Region): Boolean{
    if( o1 === undefined && o2 === undefined){
      return true;
    }
    
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false: o1.id === o2.id;
  }
}
