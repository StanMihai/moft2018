import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class RestDataService {
  public items: Observable<any[]>;

  constructor( public afAuth: AngularFireAuth, public db: AngularFireDatabase ) { }

  login() {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInAnonymously()
      .then(response => {     
        resolve(response);
      })
      .catch(err =>{
        console.log(err);
        reject(err);
      })
    })         
  }

  queryInitialDataName(type: string) {
    return new Promise(resolve => {
      this.db.list(''+ type +'').valueChanges()
        .subscribe(a => { 
          resolve(a);
        })         
      });
  } 

  getUsers(user, type) {
    return new Promise((resolve, reject) =>{
      this.db.list('' + type + '/bilete').valueChanges()
        .subscribe(a => {
          let checker: boolean = true;
          if (a.length == 0) {
            resolve(a);
          } else {
            a.forEach(item =>{
              let np = item['nume'].toUpperCase() + item['prenume'].toUpperCase();
              let npC = user[0].toUpperCase() + user[1].toUpperCase();
              if (item['tel'] == user[2]) {                
                checker = false;
              } else if (np == npC) {                
                checker = false;
              }
            });
            if (checker) {
              resolve(a);
            } else {
              reject(user);
            }            
          }
        }) 
    })
  }

  postData(userData, type, nume, titlu) {
    return new Promise((resolve, reject) =>{               
      this.db.list(''+ type +'/' + titlu + '').valueChanges()
        .map(data => { return data })
        .subscribe(a => {         
          let pos: any;
          a.forEach(item => {
            if (item['nume'] == nume) {           
              if (item['numar'] == 0) {
                reject(userData);
              } else {                
                let pos = Number(item['numar']) - 1;                
                resolve(pos);
              }
            }            
          }) 
        })           
    })
  }

  checkBilete(type, nume, piesa) {
    return new Promise((resolve, reject) =>{               
      this.db.list(''+ type +'/' + nume + '').valueChanges()
        .subscribe(a => {
          let val: any;
          let piese: any;
          if (type == 'Teatru') {
            if (a['piese']) {
              piese = a['piese'];
            } else {
              piese = a[4];
            }
            piese.forEach((item, index) => {
              if (item['nume'] == piesa.nume) {           
                if ((item['locuri'] == 0) || (item['locuri'] < 0)) {
                  reject(null);
                } else {   
                  let response: Array<any> = [];
                  response.push(index, item['locuri'] - 1);        
                  resolve(response);
                }
              }            
            })
          } else if (type == "Filme" || type == "Extra") {
            if (a['locuri']) {  
              piese = Number(a['locuri']);             
            } else {
              piese = Number(a[2]);
            }
            if ((piese == 0 || (piese < 0))) {
              reject(null);
            } else {
              resolve(piese - 1);
            }
          }           
        })           
    })
  }

  deployData(userData, piesa, numere, type, nume) {
    return new Promise((resolve, reject) =>{
      let rezervare = '';
      if (type == 'Teatru') {
        rezervare = piesa.nume + ', ' + piesa.data
      } else if (type == 'Extra') {
        rezervare = nume;
      } else {
        rezervare = 'Film';
      } 
      this.recheck(type, nume, numere)
        .then(num =>{
          if (numere[1] != undefined) {
            numere[1] = num[0];
          } else {
            numere = num[0];
          }          
          if (type == 'Teatru') {
            this.db.list(''+ type +'/' + nume + '/piese').update('' + numere[0] + '',{ locuri: numere[1] })
              .then(data =>{            
                resolve(userData);
              })
              .catch(err =>{                
                reject(err);
              })
          } else if (type == 'Filme') {
            this.db.list(''+ type +'').update('' + nume + '',{ locuri: numere })
              .then(data =>{            
                resolve(userData);
              })
              .catch(err =>{
                reject(err);
              })
          } else if (type == 'Extra') {
            this.db.list(''+ type +'').update('' + nume + '',{ locuri: numere })
              .then(data =>{            
                resolve(userData);
              })
              .catch(err =>{
                reject(err);
              })
          }  
          this.db.list(''+ type +'/bilete').push({ nume: userData[0], prenume: userData[1], tel: userData[2], email: userData[3], facultate: userData[4], rezervare: rezervare, numarBilet: (numere[1] != undefined? numere[1]: numere) });
        })             
    })
  }  

  public recheck(type, nume, numere) {
    return new Promise<any> ((resolve, reject) =>{
      if (type == 'Extra') {
        this.db.list(''+ type +'/' + nume + '').valueChanges()
          .subscribe(data =>{
            if (Number(data['locuri'] > 0 || Number(data[2]) > 0)) {
              let response = [];
              response.push((Number(data['locuri'])?Number(data['locuri'])-1:Number(data[2])-1))
              resolve(response);
            } else {
              reject(null)
            }
          })
      } else if (type == 'Teatru') {
        this.db.list(''+ type +'/' + nume + '/piese').valueChanges()
          .subscribe(data =>{
            let response = [];
            if (Number(data[numere[0] - 1]['locuri'] > 0)) {
              response.push(Number(data[numere[0] - 1]['locuri'])-1)
              resolve(response);
            } else if (Number(data[numere[0] - 1][2]) > 0) {
              response.push(Number(data[numere[0] - 1][1])-1)
              resolve(response);
            } else {         
              reject(null)
            }
          })
      }      
    })
  }

  public pushMuzee(type, nume, userData) {
    return new Promise((resolve, reject) =>{
      this.db.list(''+ type + '/' + nume + '/bilete').push({ nume: userData[0], prenume: userData[1], tel: userData[2], email: userData[3], facultate: userData[4] })
      .then(result =>{
        resolve(result);
      })      
    })    
  }

}
