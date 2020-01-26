



import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import {HttpRequestService} from '../http-request.service';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../login/auth.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
  styles: [`
  .my-modal-for-edit .modal-content {
    max-width: 1490px !important;
    min-width: 971px !important;   
    width: 95% !important;
  }
  .my-modal-for-editNext .modal-content {
    min-width: 600px;
    
  }
  .my-modal-for-addForm .modal-content {
    min-width: 400px;
    
  }
  .my-modal-for-edit .modal-content {
    min-width: 660px;
  
    
    position: relative;
    top: 50%;
    transform: translateY(-10%);
    transform: translateX(-20%);
  }

`] // Styles der Pop-Up-Fenster

})
export class AdminDashboardComponent implements OnInit {


  isLoggedIn = false;


// https://meinformular.herokuapp.com/frage
  url = 'https://meinveranstaltungsformular.herokuapp.com/frage';

  url3 = 'https://meinveranstaltungsformular.herokuapp.com/fragen'; // 'http://localhost:8090/fragen'; 'http://localhost:8090/frage';

  urlAdd = 'https://meinveranstaltungsformular.herokuapp.com/frage/add';  //'http://localhost:8090/frage/add'; 
  
  urlById: number = -1;
  urlGetbyId = 'https://meinveranstaltungsformular.herokuapp.com/fragen/' + this.urlById;  //'http://localhost:8090/frage/'

  formType: string = ""; 
  urlFormType = 'https://meinveranstaltungsformular.herokuapp.com/type/' + this.formType; //'http://localhost:8090/type/' 

  

// Url für die Kategorien-Methoden (mit String als Parameter) 
  formTypeCat: string = ""; 
  categoryCat: string = ""; 
  urlFormTypeCategory = 'https://meinveranstaltungsformular.herokuapp.com/type/' + this.formTypeCat + '/category/' + this.categoryCat;
  urlCategory = 'https://meinveranstaltungsformular.herokuapp.com/category/' + this.categoryCat;

// Url und Id's für die Bearbeitungs-Methoden 
  editId: number = -1;
  urlEdit: string = 'https://meinveranstaltungsformular.herokuapp.com/frage/' + this.editId + '/edit';

  editIdNext: number = -1;
  urlEditNext: string = 'https://meinveranstaltungsformular.herokuapp.com/frage/' + this.editId + '/addfollowing';
 

// Url und Id für die Lösch-Methode 
  deleteIdQuestion = -1;
  urlDelete = 'https://meinveranstaltungsformular.herokuapp.com/frage/' + this.deleteIdQuestion + '/delete';



  chosenFormType: string = "";
  chosenFormTypeCat: string = "Alle Fragen";
  chosenCategoryCat: string = "keine Kategorie";

  // Hashmap zum Mappen von ID und Question
  public hashIdQuestion: HashQuestion[] = [];

  catOn: boolean = false;


//Array zum anzeigen/ausblenden der Edit-Button bei einer in FrageListe
  showOnHover: boolean[] = [];


// Any-Objekte zum speichern der Daten aus GET-Requests
  public data: any;

  public dataOne: any;
  byIdOn: boolean = false;

  public data4: any;

  public dataSet =  new Set();
  public dataSetCat =  new Set();

  public dataDisplay: any;



//antwortMoeglichkeiten: Kategorien[] = [];
antwortMoeglichkeiten: Kategorien[] = [];

formularTypMoeglichkeiten: string[] = [];

// Booleans für die getätigte Auswahl bei Antwort-Typ
radioOn: boolean = false;
CheckOn: boolean = false;
TextOn: boolean = false;
datumOn: boolean = false;
dateiUploadOn: boolean = false;
dropdownOn: boolean = false;
multiTextOn: boolean = false;


mandatoryOn: boolean = true;

startQuestion: boolean = false;

deleteOn:boolean = false;
editOn: boolean = false;

// Anzahl der aktuellen Antwort-optionen und Kategorien
antOpAnzahl: number = 1;

catOpAnzahl: number = 1;

addNewForm: string = "";


// Arrays zum Speichern der Choices und Kategorien und die Ausgabe in Html
fakeArray = new Array(this.antOpAnzahl);
realArray = new Array<String>(this.fakeArray.length);
fakeChoiceArray = new Array(this.antOpAnzahl);
choiceArray = new Array<Choices>(); 
choiceExample: Choices = {id: 0, choice: "", nextQuestionId: null};
fakeCategoryArray = new Array(this.catOpAnzahl);
categoryArray = new Array<QuestionCategory>();

categoryArrayOp1: string = "";
categoryArrayOp2: string = "";

antOpString: string = "";

question: Question = {id: 0, question: "Was ist dein Alter", questionType: null, mandatory: false, lookbackId: 0, hint: "no Hinweis", formType: "Gewerbe", questionCategory: null};

choices: Choices = {id: 0, choice: "", nextQuestionId: null};

chArray: Choices[] = [this.choices];

questionType: QuestionType = {id: 0, type: "", defaultWay: 0, useDefault: false, choices: this.chArray }; 

questionCategory: QuestionCategory = {id: 0, category: "", processNumber: 1}; 


qtArray: QuestionType[] = [this.questionType];
qcArray: QuestionCategory[] = [this.questionCategory];

currentId:number = 0;
check:boolean = false;

closeResult: string;
newCatOn: boolean = false;

forms: Kategorien3[];
ftypes: Kategorien3[];
cats: Kategorien4[];
allStarts: Starting[];
startHintText: string = "Moin";

formList: Kategorien3[];




constructor(private api: HttpRequestService, private modalService: NgbModal, private route: ActivatedRoute, private authenticationService: AuthenticationService, private router: Router) { } // private popupcreateComponent: popupcreateFrageComponent
//constructor(private modalService: NgbModal) {}




ngOnInit() {


  //localStorage.setItem("currentCategory", this.chosenCategoryCat);
  //localStorage.setItem("currentFomular", this.chosenFormTypeCat);




  this.isLoggedIn = this.authenticationService.isUserLoggedIn();
  console.log('menu ->' + this.isLoggedIn);








  //_________________________________________________________
  this.forms = [];
  this.ftypes = [];
  this.cats = [];
  this.allStarts =  [];
  this.startHintText = "";
  this.formList = [];

  //______________________________________________________________





this.addNewForm = "";

  let urlFormId = 'https://meinveranstaltungsformular.herokuapp.com/forms/all';
  this.api.getAllForms(urlFormId).subscribe(forms => {this.ftypes = forms;},err => {console.log(err);});
  let urlFormId2 = 'https://meinveranstaltungsformular.herokuapp.com/category/all';
  this.api.getAllForms(urlFormId2).subscribe(cats => {this.cats = cats;},err => {console.log(err);});

 // let urlFormId = 'https://meinveranstaltungsformular.herokuapp.com/forms/all';
  console.log("GET'EM ALL");
  this.api.getQuestion(urlFormId).subscribe(forms => {console.log(forms);this.forms = forms;},err => {console.log(err);});

















  
this.hashIdQuestion = [];

/**
 * Text-Eingabe (keine Choices --> TextOn)
 * Zahlen-Eingabe (keine Choices --> TextOn)?
 * Datum (keine Choices u. --> Datepicker)
 * RadioButton/Dropdown (Choices --> RadioOn)
 * Checkbox (Choices --> CheckOn)
 * Text u. CheckBox (Choices --> TextCheckOn)
 * Text u. RadioButton (Choices --> TextRadioOn)
 * Datei-Upload (Choices (Anzahl der Dateien bzw. Dateitypen) => FileOn )
 * 
 */
//this.antwortMoeglichkeiten = [{id: 1, name: "Text-Eingabe"},{id: 2, name: "RadioButton"},{id: 3, name: "Checkbox"}, {id: 4, name: "Text u. Checkbox"}];
//this.antwortMoeglichkeiten = [{id: 1, name: "Text-Eingabe"},{id: 2, name: "RadioButton"},{id: 3, name: "Checkbox"}, {id: 4, name: "Dropdown"}, {id: 4, name: "Datum"}, {id: 4, name: "Datei-Upload"}];

this.antwortMoeglichkeiten = [{key: "textInput", name: "Text-Eingabe"},{key: "radioButton", name: "Radio-Button"},{key: "checkBox", name: "Checkbox"}, {key: "dropDown", name: "DropDown-Menü"}, {key: "datumEingabe", name: "Datum-Eingabe"}, {key: "datenInput", name: "Daten-Input"}, {key: "multiTextInput", name: "Multi-Text-Eingabe"}];



//this.formularTypMoeglichkeiten = ["Veranstaltungsanmeldung", "Gewerbeanmeldung"];

this.formularTypMoeglichkeiten = ["Sondernutzungserlaubnis", "Gewerbeanmeldung"];
 

this.antOpAnzahl = 1;
this.catOpAnzahl = 1;

this.chosenFormType = "";




this.chosenFormTypeCat = "Alle Fragen";
this.chosenCategoryCat = "keine Kategorie";



let chbsp: Choices = {id: 0, choice: "", nextQuestionId: null};
this.choiceArray.push(chbsp);

let catbsp: QuestionCategory = {id: 0, category: "", processNumber: 0};
this.categoryArray.push(catbsp);
console.log(this.categoryArray);

this.question = {id: 2, question: "", questionType: this.questionType, mandatory: false, lookbackId: 0, hint: "", formType: "Gewerbean u. umeldung", questionCategory: this.qcArray};

this.dataOne = this.question;


this.getAllStarts();


console.log("Changes worked so far so good");
this.api
.getQuestion(this.url3)
.subscribe(
  dataDisplay => {
    console.log(dataDisplay);
    this.dataDisplay = dataDisplay;
    this.data = dataDisplay;

    this.dataSetCat = new Set<String>();
    this.dataSetCat.add("keine Kategorie");
    for(let u1 = 0; u1 < dataDisplay.length; u1++){
      for(let u2 = 0; u2 < dataDisplay[u1].questionCategories.length; u2++){
        this.dataSetCat.add(dataDisplay[u1].questionCategories[u2].category);
    }
  }
    console.log(this.dataSetCat);

    this.dataSet =  new Set<String>();
    this.dataSet.add("Alle Fragen");
    for(let u = 0; u < dataDisplay.length; u++){
      this.dataSet.add(dataDisplay[u].formType);

      this.showOnHover.push(false);

      this.hashIdQuestion.push( {key: dataDisplay[u].id, value: dataDisplay[u].question} );
      
    }
    console.log(this.dataSet);
    console.log(this.hashIdQuestion);
  },
  err => {
    console.log(err);
  }
);



}



allFilled(): boolean{

  if(this.question.questionType.type == ""){
    return true;
  }

  if(this.question.questionType.type != "" && this.question.formType != "" && this.question.question != "" && this.categoryArrayOp1 != ""){
    if(this.newCatOn && this.categoryArrayOp2 == ""){
      return true;
    }
    return false
  }

return true;
}





// wird ausgeführt wenn ein Antwort-Typ ausgewählt wird
  toggleEdit(){

    if(this.question.questionType.type == "radioButton"){this.radioOn = true;}else{this.radioOn = false;}
    if(this.question.questionType.type == "checkBox"){this.CheckOn = true;}else{this.CheckOn = false;}
    if(this.question.questionType.type == "textInput"){this.TextOn = true;}else{this.TextOn = false;}
    if(this.question.questionType.type == "dropDown"){this.dropdownOn = true;}else{this.dropdownOn = false;}
    if(this.question.questionType.type == "datumEingabe"){this.datumOn = true;}else{this.datumOn = false;}
    if(this.question.questionType.type == "datenInput"){this.dateiUploadOn = true;}else{this.dateiUploadOn = false;}
    if(this.question.questionType.type == "multiTextInput"){this.multiTextOn = true;}else{this.multiTextOn = false;}
    //this.isEdit = !this.isEdit;
  }


  changeMandatory = (evt) => {    
    this.question.mandatory = evt.target.checked;
    console.log(this.question.mandatory);
  }



// Für den Filter (Filtern nach Formular-Art und dann nach deren Kategorie)
changeCatOn(): void{


  //console.log(this.cats);
  //console.log(this.ftypes);

    this.catOn = true;
    this.dataSetCat =  new Set<String>();
    this.dataSetCat.add("keine Kategorie");
    for(let t = 0; t < this.data.length; t++){
     
      if(this.chosenFormTypeCat == this.data[t].formType){
        
        for(let g = 0; g < this.data[t].questionCategories.length; g++){

          this.dataSetCat.add(this.data[t].questionCategories[g].category);
        }
      }
    }
  this.chosenCategoryCat = "keine Kategorie";
  this.getAllQuestionsOfFormTypeWithinCategory();


  


  }


// Bei Klick auf eine Der Fragen aus dem Fragekatalog werden die Daten der geklickten Frage geladen
  loadQuestion(question: any): void {

  let urlFormId = 'https://meinveranstaltungsformular.herokuapp.com/forms/all';
  console.log("GET'EM ALL");
  this.api.getQuestion(urlFormId).subscribe(forms => {console.log(forms);this.forms = forms;},err => {console.log(err);});





    this.mandatoryOn = question.mandatory;

    this.urlGetbyId = 'https://meinveranstaltungsformular.herokuapp.com/fragen/' + this.question.id; //'http://localhost:8090/fragen/' + this.question.id;  

    this.api.getQuestionbyId(this.urlGetbyId).subscribe(dataOne => {console.log(dataOne); question = dataOne;},err => {console.log(err);});
    //console.log(question);
    this.deleteIdQuestion = question.id;  
    this.deleteOn = true;
    this.editOn = true;
  
    this.question.question = question.question;
    this.question.id = question.id;
    this.question.hint = question.hint;
    this.question.questionType = question.questionType;
    this.question.mandatory = question.mandatory;
   // this.question.start = question.start;
    this.question.lookbackId = question.lookbackId;
    this.question.questionCategory = question.questionCategories;
    this.question.formType = question.formType;
    
    this.toggleEdit();
    //console.log(question.questionCategories);
    this.categoryArray = question.questionCategories;
    this.choiceArray = question.questionType.choices;
    //console.log(this.choiceArray);console.log(this.categoryArray);
    this.fakeChoiceArray = new Array(this.choiceArray.length);
    this.fakeCategoryArray = new Array(this.categoryArray.length);
    this.antOpAnzahl = this.choiceArray.length
    this.catOpAnzahl = this.categoryArray.length

    //console.log("Typ : " + this.question.questionType.defaultWay);

    this.categoryArrayOp1 = this.categoryArray[0].category;
    this.newCatOn = false;




    this.getAllStarts();
    for(let i = 0; i < this.allStarts.length; i++){
      if(question.id == this.allStarts[i].questionId){
          this.startHintText = this.allStarts[i].startText;
      }
    }



    //console.log("Mandatory: " + question.mandatory);

  }



  handleLogout() {
    this.authenticationService.logout();
    this.isLoggedIn = this.authenticationService.isUserLoggedIn();
    console.log('menu ->' + this.isLoggedIn);
    localStorage.setItem("token", "");
    localStorage.setItem("token2", "");
    this.router.navigate(['/login'])
  }

  directToLogiin(){
    this.router.navigate(['/login'])
  }


/** 
getHom():void{
  this.api
  .getQuestion('http://localhost:8090/hom')
  .subscribe(
    data => {
      console.log(data);
    },
    err => {
      console.log(err);
    }
  );

}

**/




createQuestion(): void{

  this.api
.getQuestion(this.url3)
.subscribe(
  data => {
    console.log(data);
    this.data = data;
    this.dataDisplay = data;

    this.dataSetCat = new Set<String>();
    this.dataSetCat.add("keine Kategorie")
    for(let u1 = 0; u1 < data.length; u1++){
      for(let u2 = 0; u2 < data[u1].questionCategories.length; u2++){
      this.dataSetCat.add(data[u1].questionCategories[u2].category);
    }
  }
    console.log(this.dataSetCat);

    this.showOnHover = [];
    this.dataSet =  new Set<String>();
    this.dataSet.add("Alle Fragen");
    for(let u = 0; u < data.length; u++){
      this.dataSet.add(data[u].formType);
      this.showOnHover.push(false);
    }
/** 
    for(let u = 0; u < this.ftypes.length; u++){

      this.dataSet.add(this.ftypes[u].formname);
     // this.showOnHover.push(false);
    }**/
    console.log(this.dataSet);

  },
  err => {
    console.log(err);
  }
);


if(!this.check){
  if(this.data.length > 0){  
    this.currentId = this.data[this.data.length -1].id + 1;
    this.question.id = this.currentId;
  }else{
    this.question.id = 1;
  }
 
}//

let zt: number = 0;

  if(this.data.length > 0){  
    zt = this.data[this.data.length -1].id + 1;
  }else{
    zt = 1;
  }
 
  if(this.newCatOn){
      this.categoryArray[0].category = this.categoryArrayOp2;
    }else{
      this.categoryArray[0].category = this.categoryArrayOp1;
  }


  //let zt: number = this.data[this.data.length - 1].questionType.id + 1;

  let questionZw: QuestionType = {id: zt, type: this.question.questionType.type, defaultWay: 0, useDefault: false, choices: this.choiceArray}; 


  this.question.questionType = questionZw;

  let categoryZw: QuestionCategory[] = this.categoryArray;
  this.question.questionCategory = this.categoryArray; 
  
  this.dataSet.add(this.question.formType);
  this.showOnHover.push(false);

  for(let u1 = 0; u1 < this.question.questionCategory.length; u1++){
    
    this.dataSetCat.add(this.question.questionCategory[u1].category);
  
}
  

// Für die Post-Methode werden einige Attr. der Question nicht gebraucht, und daher werden hier neue Objekte nur mit den relevanten Attr. erstellt
  // Die Objekte von den "GET"-Methoden werden gekürtzt (Id's werden gelöscht) für die Post/Put-methoden
  let dataShortChoices: ChoicesShort[] = [];
    for(let r = 0; r < this.question.questionType.choices.length; r++){
      dataShortChoices.push({choice: this.question.questionType.choices[r].choice} );//,nextQuestionId: this.question.questionType.choices[r].nextQuestionId});
    }
      
    let dataShortQuestionType: QuestionTypeShort;
    dataShortQuestionType = {type: this.question.questionType.type, choices: dataShortChoices}; //,nextQuestionId: this.question.questionType.nextQuestionId};






 
/** 
    function QeustionV(class_t, type_t)
    {
        this.category = class_t;
        this.processNumber = type_t;
    }

    let dataShortCategory: QuestionCategoryShort[] = [];
    let tmpn = new Array();

    for(let r = 0; r <this.question.questionCategory.length; r++){
      tmpn[r] = new QeustionV(this.question.questionCategory[r].category,this.question.questionCategory[r].processNumber);
      
      //{"category": this.question.questionCategory[r].category, "processNumber": this.question.questionCategory[r].processNumber};
    }
    var objectJSON = JSON.stringify(tmpn);
    console.log(objectJSON);


**/













    let dataShortCategory: QuestionCategoryShort[] = [];
    
    for(let r = 0; r <this.question.questionCategory.length; r++){
      //dataShortCategory.push({category: this.question.questionCategory[r].category, processNumber: this.question.questionCategory[r].processNumber});
      dataShortCategory.push({"category": this.question.questionCategory[r].category, "processNumber": this.question.questionCategory[r].processNumber});

    console.log("Kat: " + this.question.questionCategory[r].category);
    }
    var catshortjson = JSON.stringify(dataShortCategory);






    let dataShort: QuestionShort;
    //let va = {"question":this.question.question,"mandatory":this.question.mandatory,"start":"false", lookbackId: this.question.lookbackId, questionType: dataShortQuestionType, hint: this.question.hint, formType: this.question.formType, questionCategories: dataShortCategory}
    dataShort = {question: this.question.question, mandatory: this.question.mandatory, lookbackId: this.question.lookbackId, questionType: dataShortQuestionType, hint: this.question.hint, formType: this.question.formType, questionCategories: dataShortCategory };
   
   /** 
    let dataShort2 : QuestionShort;
    dataShort2 = {
      "question": this.question.question,
      "mandatory": this.question.mandatory,
      "start": true,
      "lookbackId": this.question.lookbackId,
      "questionType": {
          "type": "Normal",
          "choices": [
              {
                  "choice": "Neugründung"
              },
              {
                  "choice": "Standortänderung"
              }
          ]
      },
      "hint": "selbsterklärend",
      "formType": "gewerbeaneldug",
      "questionCategories": [          // tmpn
          {	
              "category": "Allgemein",
              "processNumber": 1
          }
      ]
      
  }
    
   

    //var b = JSON.stringify(dataShort);
    console.log("B: " + dataShort2);
**/
   console.log("Changes wurden gespeichert");
    this.api.addQuestion(dataShort, this.urlAdd).subscribe(data => {console.log(data); this.data = data; this.dataDisplay = data;}, err => {console.log(err);});

  //}
 

  
 setTimeout(window.location.reload.bind(window.location), 1250);
 //location.reload();

}





getAllQuestion(): void {
  //console.log("Changes wurden gespeichert!!!!!!!!!!!!!!!!");
  this.api.getQuestion(this.url3).subscribe(data => {console.log(data);this.data = data; this.dataDisplay = data; 
    

    this.dataSetCat = new Set<String>();
    this.dataSetCat.add("keine Kategorie")
        for(let u1 = 0; u1 < data.length; u1++){
          for(let u2 = 0; u2 < data[u1].questionCategories.length; u2++){
            this.dataSetCat.add(data[u1].questionCategories[u2].category);
          }
        }
    this.showOnHover = [];
    this.dataSet =  new Set<String>();
    this.dataSet.add("Alle Fragen");
    for(let u = 0; u < data.length; u++){
        this.dataSet.add(data[u].formType);
        this.showOnHover.push(false);
      }
      console.log(this.dataSet);

      },err => {console.log(err);});


      this.getAllStarts();
  
  
}

getQuestionByIdForFrontend(id: number): string{

  for(let z = 0; z < this.hashIdQuestion.length; z++){

    if(id == this.hashIdQuestion[z].key){
      return this.hashIdQuestion[z].value;
    }

  }
  return "N.A."

}



getQuestionById(): void {
  
  let zw: boolean = false;
  for(let i = 0; i < this.data.length; i++){
      
     if(this.urlById == this.data[i].id){
        zw = true;  
     }
  }

  if(zw){
    this.urlGetbyId = 'https://meinveranstaltungsformular.herokuapp.com/fragen/' + this.urlById;

    this.api.getQuestionbyId(this.urlGetbyId).subscribe(dataOne => {console.log(dataOne);this.dataOne = dataOne;},err => {console.log(err);});
  
    this.byIdOn = true;
  }
}



getFormType(): void{

  let zw: boolean = false;

  let urlFormId = 'https://meinveranstaltungsformular.herokuapp.com/forms/all';
  
  this.api.getAllForms(urlFormId).subscribe(forms => {this.ftypes = forms;},err => {console.log(err);});

  let rightformId:number;
  for(let t = 0; t < this.forms.length; t++){
      if( this.chosenFormType == this.ftypes[t].formname){
        rightformId = this.ftypes[t].id;
        zw = true;
      }
  }
/** 
  for(let i = 0; i < this.data.length; i++) {
      
     if(this.chosenFormType == this.data[i].formType){
        zw = true;  
     }
  }
**/
  if(zw){

    this.formType = this.chosenFormType;

    this.urlFormType = 'https://meinveranstaltungsformular.herokuapp.com/type/' + rightformId; //this.formType;

    this.api.getFormType(this.urlFormType).subscribe(data4 => {console.log(data4);this.data4 = data4;this.dataDisplay = data4;},err => {console.log(err);});
    
  }

}



getCategory(): void{

  let urlFormId = 'https://meinveranstaltungsformular.herokuapp.com/category/all';
  
  
  this.api.getAllForms(urlFormId).subscribe(cats => {this.cats = cats;},err => {console.log(err);});

  let rightCatId:number;
  for(let t = 0; t < this.cats.length; t++){
      if( this.chosenCategoryCat == this.cats[t].category){
        rightCatId = this.cats[t].id;
       
      }
  }



    this.categoryCat = this.chosenCategoryCat; 
    //console.log(this.chosenCategoryCat);
    this.urlCategory = 'https://meinveranstaltungsformular.herokuapp.com/category/' + rightCatId;

    this.api.getFormType(this.urlCategory).subscribe(data4 => {console.log(data4);this.data4 = data4;this.dataDisplay = data4;},err => {console.log(err);});
    
  }



getAllQuestionsOfFormTypeWithinCategory(): void {

//console.log(this.cats);
//console.log(this.ftypes);





  if(this.chosenFormTypeCat == "Alle Fragen"){
    if(this.chosenCategoryCat != "keine Kategorie"){
      
        this.getCategory();

      }else{

      	this.getAllQuestion();
      
    }

  }else{
    if(this.chosenCategoryCat == "keine Kategorie"){

      //let urlFormId = 'https://meinveranstaltungsformular.herokuapp.com/forms/all';
      //this.api.getAllForms(urlFormId).subscribe(forms => {this.ftypes = forms;},err => {console.log(err);});
      let rightformId:number;
      for(let t = 0; t < this.forms.length; t++){
          if( this.chosenFormTypeCat == this.ftypes[t].formname){
            rightformId = this.ftypes[t].id;
           
          }
      }
  
      this.formType = this.chosenFormTypeCat;
      this.urlFormType = 'https://meinveranstaltungsformular.herokuapp.com/type/' + rightformId; //this.formType;
  
      this.api.getFormType(this.urlFormType).subscribe(data4 => {console.log(data4);this.data4 = data4;this.dataDisplay = data4;},err => {console.log(err);});
      
    }else{


      //let urlFormId = 'https://meinveranstaltungsformular.herokuapp.com/forms/all';
      //this.api.getAllForms(urlFormId).subscribe(forms => {this.ftypes = forms;},err => {console.log(err);});
      let rightformId:number;
      for(let t = 0; t < this.forms.length; t++){
          if( this.chosenFormTypeCat == this.ftypes[t].formname){
            rightformId = this.ftypes[t].id;
           
          }
      }
 
      //let urlFormId2 = 'https://meinveranstaltungsformular.herokuapp.com/category/all';
      //this.api.getAllForms(urlFormId2).subscribe(cats => {this.cats = cats;},err => {console.log(err);});
      let rightCatId:number;
      for(let t = 0; t < this.cats.length; t++){
        console.log("Moin!!!!!");
        console.log(this.chosenCategoryCat + " || " + this.cats[t].category);
          if( this.chosenCategoryCat == this.cats[t].category){
            rightCatId = this.cats[t].id;
          
          }
      }
  


      this.formTypeCat = this.chosenFormTypeCat; 
      this.categoryCat = this.chosenCategoryCat; 
      this.urlFormTypeCategory = 'https://meinveranstaltungsformular.herokuapp.com/type/' + rightformId + '/category/' + rightCatId; //+ this.formTypeCat + '/category/' + this.categoryCat;

      this.api.getAllQuestionsOfFormTypeWithinCategory(this.urlFormTypeCategory).subscribe(data4 => {console.log(data4);this.data4 = data4;this.dataDisplay = data4;},err => {console.log(err);});
    }
  }

}













getAllStarts(): void{

  let findStart = 'https://meinveranstaltungsformular.herokuapp.com/findAllStarts';
  this.api.getStarting(findStart).subscribe(starts => {this.allStarts = starts;},err => {console.log(err);});

}



startStatus(question: any): boolean{

    for(let i = 0; i < this.allStarts.length; i++){
      if(question.id == this.allStarts[i].questionId){
        return true;
      }


    }

return false;


}




















//AddNextQuestionId
editQuestionNextQuestionId(): void{
    console.log(this.choiceArray)
    console.log(this.hashIdQuestion);
  let questionZw: QuestionType = {id: this.question.questionType.id, type: this.question.questionType.type, defaultWay: this.question.questionType.defaultWay, useDefault: false, choices: this.choiceArray}; //, question: this.question 
  

  this.question.questionType = questionZw;
  
  let categoryZw: QuestionCategory[] = this.categoryArray;
  this.question.questionCategory = this.categoryArray;//categoryZw;

  this.editId = this.question.id;
  this.urlEditNext = 'https://meinveranstaltungsformular.herokuapp.com/frage/' + this.editId + '/edit';
  //this.urlEditNext = 'http://localhost:8090/frage/' + this.editId + '/edit';



// Die Objekte von den "GET"-Methoden werden gekürtzt (Id's werden gelöscht) für die Post/Put-methoden
    let dataShortChoices: ChoicesShortNext[] = [];
    for(let r = 0; r < this.question.questionType.choices.length; r++){
      dataShortChoices.push({choice: this.question.questionType.choices[r].choice, nextQuestionId: this.question.questionType.choices[r].nextQuestionId} );//,nextQuestionId: this.question.questionType.choices[r].nextQuestionId});
    }
      
    let dataShortQuestionType: QuestionTypeShortNext;
    dataShortQuestionType = {type: this.question.questionType.type, defaultWay: this.question.questionType.defaultWay, choices: dataShortChoices}; //,nextQuestionId: this.question.questionType.nextQuestionId};

    let dataShortCategory: QuestionCategoryShortNext[] = [];
    for(let r = 0; r < this.question.questionCategory.length; r++){
      dataShortCategory.push({category: this.question.questionCategory[r].category, processNumber: this.question.questionCategory[r].processNumber});
    }

    let dataShort: QuestionShortNext;
    dataShort = {question: this.question.question, mandatory: this.question.mandatory, questionType: dataShortQuestionType, hint: this.question.hint, formType: this.question.formType, questionCategories: dataShortCategory };
 
    this.api.editQuestionNext(this.urlEditNext, dataShort, this.editId).subscribe(data => {console.log(data);this.data = data;this.dataDisplay = data;
      
      this.dataSetCat = new Set<String>();
      this.dataSetCat.add("keine Kategorie")
      for(let u1 = 0; u1 < data.length; u1++){
        for(let u2 = 0; u2 < data[u1].questionCategories.length; u2++){
          this.dataSetCat.add(data[u1].questionCategories[u2].category);
        }
      }
          this.dataSet =  new Set<String>();
          this.dataSet.add("Alle Fragen");
          for(let u = 0; u < data.length; u++){
            this.dataSet.add(data[u].formType);
          }
          console.log(this.dataSet);

    },err => {console.log(err);});
  
  this.editOn = false;
  this.deleteOn = false;

  setTimeout(window.location.reload.bind(window.location), 1250);
 // location.reload();
  
}


resetQuestion(): void{

  this.addNewForm = "";

  this.antOpAnzahl = 1;
  this.fakeChoiceArray = new Array(this.antOpAnzahl); 

  this.choiceArray = new Array<Choices>(); 
  let chbsp: Choices = {id: 0, choice: "", nextQuestionId: null};
  this.choiceArray.push(chbsp);

  this.catOpAnzahl = 1;
  this.fakeCategoryArray = new Array(this.catOpAnzahl);
  this.categoryArray = new Array<QuestionCategory>();
  let catbsp: QuestionCategory = {id: 0, category: "", processNumber: 0};
  this.categoryArray.push(catbsp);



  this.choices = {id: 0, choice: "", nextQuestionId: null};
  this.chArray = [this.choices];
  this.questionType = {id: 0, type: "", defaultWay: 0, useDefault: false, choices: this.chArray };
  this.questionCategory = {id: 0, category: "", processNumber: 1}; 
  this.qcArray = [this.questionCategory];


  this.question = {id: 2, question: "", questionType: this.questionType, mandatory: true, lookbackId: 0, hint: "", formType: "", questionCategory: this.qcArray};
  this.toggleEdit();
}



//Put-Methode ohne NextQUestionId
editQuestion(): void{
    
  let questionZw: QuestionType = {id: this.question.questionType.id, type: this.question.questionType.type, defaultWay: this.question.questionType.defaultWay, useDefault: this.question.questionType.useDefault, choices: this.choiceArray}; //, question: this.question 

  
  this.question.questionType = questionZw;
  
  let categoryZw: QuestionCategory[] = this.categoryArray;
  this.question.questionCategory = this.categoryArray;//categoryZw;

  this.editId = this.question.id;

  this.urlEdit = 'https://meinveranstaltungsformular.herokuapp.com/frage/' + this.editId + '/edit';
  //this.urlEdit = 'http://localhost:8090/frage/' + this.editId + '/edit';
  

// Die Objekte von den "GET"-Methoden werden gekürtzt (Id's werden gelöscht) für die Post/Put-methoden
    let dataShortChoices: ChoicesShort[] = [];
    for(let r = 0; r < this.question.questionType.choices.length; r++){
      dataShortChoices.push({choice: this.question.questionType.choices[r].choice} );//,nextQuestionId: this.question.questionType.choices[r].nextQuestionId});
    }
      
    let dataShortQuestionType: QuestionTypeShort;
    dataShortQuestionType = {type: this.question.questionType.type, choices: dataShortChoices}; //,nextQuestionId: this.question.questionType.nextQuestionId};

    let dataShortCategory: QuestionCategoryShort[] = [];
    for(let r = 0; r < this.question.questionCategory.length; r++){
      dataShortCategory.push({category: this.question.questionCategory[r].category, processNumber: this.question.questionCategory[r].processNumber});
    }

    let dataShort: QuestionShortPut;

    dataShort = {question: this.question.question, mandatory: this.question.mandatory, lookbackId: this.question.lookbackId, questionType: dataShortQuestionType, hint: this.question.hint, formType: this.question.formType, questionCategories: dataShortCategory };

  this.api.editQuestion(this.urlEdit, dataShort, this.editId).subscribe(data => {console.log(data);this.data = data;this.dataDisplay = data;
    
    this.dataSetCat = new Set<String>();
    this.dataSetCat.add("keine Kategorie")
    for(let u1 = 0; u1 < data.length; u1++){
      for(let u2 = 0; u2 < data[u1].questionCategories.length; u2++){
      this.dataSetCat.add(data[u1].questionCategories[u2].category);
    }
  }
        this.dataSet =  new Set<String>();
        this.dataSet.add("Alle Fragen");
        for(let u = 0; u < data.length; u++){
          this.dataSet.add(data[u].formType);
        }
        //console.log("Set :" + this.dataSet);

  },err => {console.log(err);});

  this.editOn = false;
  this.deleteOn = false;





  setTimeout(window.location.reload.bind(window.location), 200);
  //location.reload();
  
}

toggleCat(){
  if(this.categoryArrayOp1 == "NEUE Kategorie"){
    this.newCatOn = true;
  }
  else{
    this.newCatOn = false;
  }
  console.log(this.dataSetCat);
}



addForm(){

  if(this.addNewForm != "" && this.addNewForm != null){
    let urlStarting = 'https://meinveranstaltungsformular.herokuapp.com/forms/add';
    //console.log(this.kpform);
    this.api.addForm(this.addNewForm, urlStarting).subscribe(startRes => {console.log(startRes);},err => {console.log(err);});

    setTimeout(window.location.reload.bind(window.location), 1250);
  }
}



setStart(){
/** 
  let urlFormId = 'https://meinveranstaltungsformular.herokuapp.com/forms/all';
  console.log("GETEM ALL");
  
  //this.api.getAllForms(urlFormId).subscribe(forms => {console.log(forms);this.kpform = forms;},err => {console.log(err);});
  this.api.getQuestion(urlFormId).subscribe(forms => {console.log(forms);this.kpform = forms;},err => {console.log(err);});
**/
//console.log(this.forms);

  let rightformId:number;
  for(let t = 0; t < this.forms.length; t++){
    console.log("LIST:" + this.forms[t].formname);
    console.log("Searched: " + this.question.formType);
      if( this.question.formType == this.forms[t].formname){
        rightformId = this.forms[t].id;
      }
  }

  // rightformId undefined; !!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  let startingID:StartingId = {formId: rightformId, questionCategoryId: this.question.questionCategory[0].id};

  let starting:Starting = {stardingId: startingID, formId: rightformId, questionCategoryId: this.question.questionCategory[0].id, questionId: this.question.id, startText: this.startHintText};

  let urlStarting = 'https://meinveranstaltungsformular.herokuapp.com/form/' + rightformId + '/category/' + this.question.questionCategory[0].id + '/setstart';
  //console.log(this.kpform);
  this.api.addStarting(starting, urlStarting).subscribe(startRes => {console.log(startRes);},err => {console.log(err);});
 // console.log(this.kpform);
/** 
  
  for(let c of this.dataDisplay){
    if(c.start){
      this.loadQuestion(c);
      this.question.start = false;
      this.editQuestion();
    }
  }
  this.loadQuestion(question);
  this.question.start = true;
  this.editQuestion();
**/
  setTimeout(window.location.reload.bind(window.location), 1250);
}

//___________________________________________________________________________________________________________________
  

  open(content) { 
    
    this.categoryArrayOp1 = this.categoryArray[0].category
    this.newCatOn = false;
    let dataSetCatZw = new Set();
    dataSetCatZw.add("NEUE Kategorie")
  
    for(let item of this.dataSetCat.values()){
          dataSetCatZw.add(item);
      }
    this.dataSetCat = dataSetCatZw;


    this.modalService.open(content, {backdrop:'static', windowClass : "my-modal-for-editNext"}).result.then((result) => {  // { size: 'lg', backdrop: 'static' }    { windowClass : "my-modal-for-editNext"}   {ariaLabelledBy: 'modal-basic-title'}
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

 
  openStart(content) { 
    
    this.modalService.open(content, { size: 'lg', backdrop: 'static' }).result.then((result) => {  // {backdrop:'static', windowClass : "my-modal-for-editNext"} { size: 'lg', backdrop: 'static' }    { windowClass : "my-modal-for-editNext"}   {ariaLabelledBy: 'modal-basic-title'}
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  openAddFormular(content) { 
    
    this.modalService.open(content, {backdrop:'static', windowClass : "my-modal-for-addForm"}).result.then((result) => {  // {backdrop:'static', windowClass : "my-modal-for-editNext"} { size: 'lg', backdrop: 'static' }    { windowClass : "my-modal-for-editNext"}   {ariaLabelledBy: 'modal-basic-title'}
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }




  open2(content) { 

   
     this.formularTypMoeglichkeiten = [];
     for(let u = 0; u < this.ftypes.length; u++){
 
       this.dataSet.add(this.ftypes[u].formname);
       this.formularTypMoeglichkeiten[u] = this.ftypes[u].formname;
     }

    this.categoryArrayOp1 = this.categoryArray[0].category
    this.newCatOn = false;
    
    let dataSetCatZw = new Set();
    dataSetCatZw.add("NEUE Kategorie")
    

      for(let item of this.dataSetCat.values()){
          dataSetCatZw.add(item);
      }
    this.dataSetCat = dataSetCatZw;

 console.log(this.dataSetCat);



    this.modalService.open(content, {backdrop:'static', windowClass : "my-modal-for-edit"}).result.then((result) => {  // { size: 'lg', backdrop: 'static' }    { windowClass : "my-modal-for-editNext"}   {ariaLabelledBy: 'modal-basic-title'}
      this.closeResult = `Closed with: ${result}`;
      console.log("Changes wurden gespeichert");
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log("Changes wurden gespeichert");
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }


 
deleteQuestion(id: number): void{

console.log("DIe Id lautet: " + id);

  if(id == -1){
this.deleteIdQuestion = this.question.id;
  }else{
    this.deleteIdQuestion = id;
  }


this.urlDelete = 'https://meinveranstaltungsformular.herokuapp.com/frage/' + this.deleteIdQuestion + '/delete';

this.api.deleteQuestion(this.urlDelete, this.deleteIdQuestion).subscribe(data => {console.log(data);this.data = data; this.dataDisplay = data;

  this.dataSetCat = new Set<String>();
  this.dataSetCat.add("keine Kategorie")

  for(let u1 = 0; u1 < data.length; u1++){
    for(let u2 = 0; u2 < data[u1].questionCategories.length; u2++){
    this.dataSetCat.add(data[u1].questionCategories[u2].category);
  }
}
        this.showOnHover = [];
        this.dataSet =  new Set<String>();
        this.dataSet.add("Alle Fragen");

        for(let u = 0; u < data.length; u++){
          this.dataSet.add(data[u].formType);
          this.showOnHover.push(false);
        }
        console.log(this.dataSet);

},err => {console.log(err);});

this.deleteIdQuestion = -1;
this.deleteOn = false;
this.editOn = false;

setTimeout(window.location.reload.bind(window.location), 1000);

//location.reload();

}



addInput(){

    let ch: Choices = {id: 0, choice: "", nextQuestionId: null};

    this.antOpAnzahl += 1;
   // this.fakeArray = new Array(this.antOpAnzahl); 
    this.fakeChoiceArray = new Array(this.antOpAnzahl);

    // ch.questionType = this.qtArray;

    if(this.choiceArray.length > 0){
      ch.id = this.choiceArray[this.choiceArray.length - 1].id + 1;
    }else{
      ch.id = 0;
      //this.choiceArray[this.choiceArray.length - 1].id = 0;
    }
      
    this.choiceArray.push(ch);
    console.log(this.choiceArray);
  }


// Methoden zur Anpassung der Choice- und Kategorie-Arrays 
deleteInput(){

    if(this.antOpAnzahl > 0){
      this.antOpAnzahl -= 1;
      this.fakeChoiceArray = new Array(this.antOpAnzahl); 
      this.choiceArray.pop();
  }
}


addInputCat(){

    let cat: QuestionCategory = {id: 0, category: "", processNumber: 0};
    this.catOpAnzahl += 1;
    this.fakeCategoryArray = new Array(this.catOpAnzahl);
    //cat.category = this.qtArray;

    if(this.categoryArray.length > 0){
      
      cat.id = this.categoryArray[this.categoryArray.length - 1].id + 1;
    }else{
      cat.id = 0;
 
    }
      
    this.categoryArray.push(cat);
    console.log(this.categoryArray);
    console.log(this.fakeCategoryArray.length);
  }


  deleteInputCat(){

    if(this.catOpAnzahl > 0){
      this.catOpAnzahl -= 1;
      this.fakeCategoryArray = new Array(this.catOpAnzahl); 
      this.categoryArray.pop();
    }
  }

}





//______________________________________________________________________________________________________________________________
//--------------------------------------------------------------------------------------------------------------------------------


interface HashQuestion{

  key:number,
  value:string

}


interface QuestionType{

  id:number,
  type:string,
  defaultWay:number,
  useDefault: boolean,
  choices:Array<Choices>

}

interface QuestionCategory{

  id:number,
  category:string,
  processNumber:number

}


interface Choices{

  id:number,
  choice:string,
  nextQuestionId:number,
  //questionType:Array<QuestionType>

}


interface Question{

  id:number,
  question:string,
  questionType:QuestionType,
  mandatory: boolean,
  //start: boolean,
  lookbackId: number,
  hint:string,
  formType:string,
  questionCategory:Array<QuestionCategory>

}


//--------------------------------------------------------------------------------------------------------------------------


interface QuestionTypeShort{

  type:string,
  choices:Array<ChoicesShort>
  
  }
  
  
interface QuestionCategoryShort{
  

  category:string,
  processNumber:number
  
  }
  
  
interface ChoicesShort{
  
  choice:string,
  
  }
  
// For Post-Request (createQuestion)  
/**interface QuestionShort{
  
  question:string,
  mandatory: boolean,
  start: boolean,
  lookbackId: number,
  questionType:QuestionTypeShort,
  hint:string,
  formType:string,
  questionCategories:Array<QuestionCategoryShort>,
  
  } */
interface QuestionShort{
  
  question:string,
  mandatory: boolean,
  //start: boolean,
  lookbackId: number,
  questionType:QuestionTypeShort,
  hint:string,
  formType:string,
  questionCategories:Array<QuestionCategoryShort>,
  
  }

// For Put-Request (editQuestion)
  interface QuestionShortPut{
  
    question:string,
    mandatory: boolean,
    //start: boolean,
    lookbackId: number,
    questionType:QuestionTypeShort,
    hint:string,
    formType:string,
    questionCategories:Array<QuestionCategoryShort>,
    
    }



//-------------------------------------------------------------------------------------------------------------------------------
// Only for Inserting NextQuestionId

interface QuestionTypeShortNext{

  type:string,
  defaultWay:number,
  choices:Array<ChoicesShortNext>
  
}
  
  
interface QuestionCategoryShortNext{
  
  category:string,
  processNumber:number
  
}
  
  
interface ChoicesShortNext{

  choice:string,
  nextQuestionId:number
  
}
  
  
interface QuestionShortNext{
  
  question:string,
  mandatory:boolean,
  questionType:QuestionTypeShortNext,
  hint:string,
  formType:string,
  questionCategories:Array<QuestionCategoryShortNext>,
  
}
  //---------------------------------------------------------------------------------------------------------------------------



  
  interface StartingId{

    formId:number,
    questionCategoryId:number

  }


  interface Starting{

    stardingId:StartingId,
    formId:number,
    questionCategoryId:number,
    questionId:number,
    startText:string

  }



  interface Kategorien{
   
    key:string,
    name:string
  
  }


interface Kategorien2{
   
  id:number,
  name:string

}

interface Kategorien3{
   
  id:number,
  formname:string

}


interface Kategorien4{
   
  id:number,
  category:string

}


