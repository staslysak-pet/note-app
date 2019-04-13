const creater        = document.getElementById('creater'),
      createNote     = document.querySelector('.createNote'),
      createList     = document.querySelector('.createList'),
      createHeader   = document.querySelector('.createHeader'),
      controls       = document.getElementById('controls'),
      createListCont = document.getElementById('list'),
      noNote         = document.querySelector('.no-note');



// GLOBAL FUNCTIONS
let headerKeyHandler = event => {
    if(event.keyCode === 13)
        event.preventDefault()
}

function noteTextSpaceHandle(e){
    if (e.keyCode === 13) {
        e.preventDefault();
        
            
          let selection = window.getSelection(),
          range = selection.getRangeAt(0),
          br = document.createElement('br');
        
          let bnode = document.createTextNode('\u00A0');
          range.insertNode(br);
          range.setStartAfter(br);
          range.setEndAfter(br);
          range.collapse(false);
          e.target.appendChild(bnode);

          selection.removeAllRanges();
          selection.addRange(range);

        // document.execCommand('insertHTML', false, '<br><br>');
        // return false;
    }
}

let createListEl = document.querySelectorAll('[aria-label="newTodo"]');
for(let createList of createListEl){
    createList.addEventListener('keydown', addListEl, false)
}
// note functionnality
let notes = document.querySelectorAll('.note');
for(let note of notes){
    note.addEventListener('click', noteFunctional, false)
}
creater.addEventListener('click', noteFunctional, false);



// CREATE NOTES FUNCTIONS

// remove all lists from creater
function removeAllLists(){
    const createrListCont = creater.querySelector('.listCont'),
          allLists = createrListCont.querySelectorAll('.listEl:not([role="createListEl"])');

    allLists.forEach(el => createrListCont.removeChild(el))
}
// reset creater
function resetCreater(){
    createNote.innerHTML   = '';
    createNote.setAttribute('style', 'font-size: 16px');
    createHeader.innerHTML = '';

    let obj = {
        trueH: ['#list', '.createHeader', '#controls'], 
        falseH: ['.createList', '.createNote']
    }

    setHidden(creater, obj)
}

// set hidden attribute for 'CREATER' elements
function setHidden(note, hiddenObj){
    if(hiddenObj.trueH)
        hiddenObj.trueH.map(child => note.querySelector(child).hidden = true)
    else
        return
        
    if(hiddenObj.falseH)
        hiddenObj.falseH.map(child => note.querySelector(child).hidden = false)
    else
        return
}




function noteFunctional(e){

    let standartCreaterReset = ['.createHeader', '#controls'];

    let t  = e.target;
    let cl = t.classList;
    let p  = t.parentNode;

    if(noNote){ noNote.hidden = true }
    
    switch(true){
        case cl.contains('createNote'):
            t.setAttribute('style', 'font-size: 14px')
            t.onkeydown = noteTextSpaceHandle;
            creater.dataset.type = 'note'

            let noteObj = {
                trueH: ['.createList'], 
                falseH: standartCreaterReset
            }

            setHidden(creater, noteObj)
            break;

        case cl.contains('createList'):
            creater.dataset.type = 'list'

            let listObj = {
                trueH: ['.createNote', '.createList'], 
                falseH: ['#list'].concat(standartCreaterReset)
            }
            
            setHidden(creater, listObj)
            break;
            
        case cl.contains('header'):
            t.onkeydown = headerKeyHandler;
            break;

        case cl.contains('noteText'):
            t.onkeydown = noteTextSpaceHandle;
            break;

        case cl.contains('checkEl'):
            checkListChange(t);
            break;

        case cl.contains('delEl'):
            p.parentNode.removeChild(p);
            break;

        case cl.contains('edit'):
            putData(this)
            break;

        case cl.contains('add'):
            postData(creater)
            resetCreater()
            removeAllLists()
            break;

        case cl.contains('cancel'):
            resetCreater()
            removeAllLists()
            if(noNote) noNote.hidden = false;  
            break;

        case cl.contains('delete'):
            deleteData(this)
            break;
    }

}




// CHECKLIST FUNCTOIN
function checkListChange(t){
    if(t.hasAttribute('aria-checked')){
        let isCheked = (t.getAttribute('aria-checked')  == 'false') ? true : false;
        t.setAttribute('aria-checked', `${isCheked}`)
    }
}


// ADD LIST ELEMENT FUNCTION
function addListEl(e){

    if(!e.ctrlKey && !e.metaKey && !e.altKey && e.keyCode !== 13){

        this.parentNode.removeAttribute('role');
        this.previousSibling.removeAttribute('aria-label');
        this.previousSibling.setAttribute('aria-checked', false);
        this.removeAttribute('placeholder');
        this.setAttribute('aria-label', 'listText');
        this.removeEventListener("keydown", addListEl);
    
        let listEl  = document.createElement('div');
        let checkEl = document.createElement('div');
        let textEl  = document.createElement('div');
        let delEl   = document.createElement('div');

        listEl.classList.add('listEl');
        listEl.setAttribute('role', 'createListEl');
        checkEl.classList.add('checkEl');
        checkEl.setAttribute('aria-label', 'addTodo');
        textEl.classList.add('textEl');
        textEl.setAttribute('contenteditable', 'true');
        textEl.setAttribute('placeholder', 'New TODO');
        textEl.setAttribute('role', 'textbox');
        textEl.setAttribute('aria-label', 'newTodo');
        delEl.classList.add('delEl');

        textEl.addEventListener("keydown", addListEl, false);
        
        listEl.appendChild(checkEl);
        listEl.appendChild(textEl);
        listEl.appendChild(delEl);
        this.parentNode.parentNode.appendChild(listEl);
    }
    else{
        e.preventDefault();
    }
}