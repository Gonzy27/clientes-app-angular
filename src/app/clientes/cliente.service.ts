import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { Cliente } from './cliente';
import { Observable , of , throwError} from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Region } from './region';

@Injectable()
export class ClienteService {
  private urlEndPoint: string = "http://localhost:8080/api/clientes";

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient, private router: Router) { }

  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones');
  } 

  getClientes(page: number): Observable<any> {
    //return of(CLIENTES);
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) =>{
        console.log('ClienteService: tap 1');
        (response.content as Cliente[]).forEach(cliente=>{
          console.log(cliente.nombre);
        })
      }),
      map((response: any) => {
          (response.content as Cliente[]).map(cliente =>{
            cliente.nombre = cliente.nombre.toUpperCase();
            //let datePipe = new DatePipe('en-US');
            //cliente.createAt = datePipe.transform(cliente.createAt, 'dd/MM/yyyy')
            //cliente.createAt = formatDate(cliente.createAt, 'EEEE dd, EEE yyyy', 'es-CL');
            return cliente;
          });
          return response;
      }),
      tap(response =>{
        console.log('ClienteService: tap 2');
        (response.content as Cliente[]).forEach(cliente=>{
          console.log(cliente.nombre);
        })
      })
    )
  }

  create(cliente: Cliente) : Observable<Cliente>{
    return this.http.post<Cliente>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {

        if(e.status == 400){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        swal.fire('Error al crear al cliente', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }
  
  updateCliente(cliente: Cliente): Observable<Cliente>{
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        if(e.status == 400){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        swal.fire('Error al editar al cliente', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire('Error al eliminar al cliente', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);
    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });
    return this.http.request(req);
  }
}
