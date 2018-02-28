import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { RestDataService } from '../rest-data.service';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() object;
  @Input() type: string;
  @Input() nume: string;

  public dataForm: FormGroup;

  public body: string;
  public list: any;
  public name: any;
  public last: any;
  public tel: any;
  public em: any;
  public piesa: Array<any> = [];

  constructor( public activeM: NgbActiveModal, public rest: RestDataService ) { }

  ngOnInit() {
    this.initData();
    this.dataForm = new FormGroup({
      nume: new FormControl('',[
        Validators.required,
        Validators.minLength(2)
      ]),
      prenume: new FormControl('',[
        Validators.required,
        Validators.minLength(2)
      ]),
      telefon: new FormControl('',[
        Validators.required,
        Validators.minLength(9)
      ]),
      email: new FormControl('',[
        Validators.required,
        Validators.minLength(7)
      ]),
      facultate: new FormControl('',[
        Validators.required,
        Validators.minLength(3)
      ]),
    })
  }

  public initData() {    
    if (this.object.bilete) {
      if (this.object.piese) {
        if (this.object.piese[0] == undefined) {
          this.object.piese.splice(0,1);
          this.list = this.object.piese;
        } else {
          this.list = this.object.piese;
        }        
      }
    }
  }

  public showForm() {
    if (this.object.bilete || this.object.formular) {
      return true;
    } else {
      return false;
    }
  }

  public checkLocuri(item) {
    if (item.locuri > 0) {
      return true;
    } else {return false}
  }

  public submitForm(form: NgForm) {
    if (!form.valid || (this.piesa.length == 0 && this.type == 'Teatru')) {
      return; 
    }
    let userData: Array<any> = [];
    userData.push(form.controls['nume'].value, form.controls['prenume'].value, form.controls['telefon'].value, form.controls['email'].value, form.controls['facultate'].value, this.piesa);
    if (this.type != 'Muzee') {
      this.rest.getUsers(userData, this.type)
        .then(resolve => {
          this.rest.checkBilete(this.type, this.nume, this.piesa[0])
            .then(resolve => {
              this.rest.deployData(userData, this.piesa[0], resolve, this.type, this.nume)
                .then(rest => {
                  this.activeM.close();
                  alert('Biletul a fost rezervat.');
                })   
                .catch(err =>{
                  this.activeM.close();
                  console.log("aici");
                  alert('Nu mai sunt bilete disponibile');
                })                                                      
              })
              .catch(err => {
                this.activeM.close();
                console.log("aici");
                alert('Nu mai sunt bilete disponibile');
              })
          })
          .catch(err => {
            this.activeM.close();
            alert('Ai dreptul la un singur bilet per student');                
          })
    } else {
      this.rest.pushMuzee(this.type, this.nume, userData)
        .then(result =>{
          this.activeM.close();
          alert('Inscriere completa');
        })
    }
    
  }

  public add(item) {
    if (this.piesa.length == 0) {
      this.piesa.push(this.list[item]);
    } else {
      this.piesa.splice(0,1);
      this.piesa.push(this.list[item]);
    }
    
  }

  public close() {
    this.activeM.close();
  }
}
