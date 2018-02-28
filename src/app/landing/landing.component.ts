import { Component, OnInit, Renderer } from '@angular/core';

import { RestDataService } from '../rest-data.service';
import { ModalComponent } from '../modal/modal.component'

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})

export class LandingComponent implements OnInit {

  public muzeeList
  public teatruList
  public extraList
  public film

  constructor(public restData: RestDataService, public modalService: NgbModal) { }

  ngOnInit() {    

    this.restData.login()
      .then(resolve => {
          this.restData.queryInitialDataName('Extra')
            .then(result =>{
              this.extraList = result;
            })
            .catch(err =>{
              console.log(err);
              alert('Refresh page');
            })
          this.restData.queryInitialDataName('Muzee')
            .then(result =>{
              this.muzeeList = result;
            })
            .catch(err =>{
              console.log(err);
              alert('Refresh page');
            })
          this.restData.queryInitialDataName('Filme')
            .then(result =>{
              this.film = result[0];              
            })
            .catch(err =>{
              console.log(err);
              alert('Refresh page');
            })
          this.restData.queryInitialDataName('Teatru')
            .then(result =>{
              this.teatruList = result;
            })
            .catch(err =>{
              console.log(err);
              alert('Refresh page');
            })
      })
      .catch(err => {
        alert('Refresh Page');
      })
    
  }  

  public openModal(content, type: string, nume: string) {
    let modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.object = content;
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.nume = nume;
  }

}
