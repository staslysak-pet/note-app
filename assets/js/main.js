const creater        = document.getElementById('creater'),
      createNote     = document.querySelector('.createNote'),
      createList     = document.querySelector('.createList'),
      createHeader   = document.querySelector('.createHeader'),
      controls       = document.getElementById('controls'),
      noNote         = document.querySelector('.no-note');

// -------------------------------------------------------- NOTES LISTENERS
let notes = document.querySelectorAll('.note');
for(let note of notes){
    note.addEventListener('click', noteFunc, false);
    note.addEventListener('focusin', contenteditableFunc, false);
}
// creater.addEventListener('click', noteFunc, false);

function contenteditableFunc(e) {

    let t  = e.target;
    let cl = t.classList;

    switch(true){
        case cl.contains('noteText'):
            t.addEventListener('keydown', newLineHandler);
            break;

        case cl.contains('header'):
            t.addEventListener('keydown', newLineFreeze);
            break;

        case cl.contains('textEl'):
            if(t.getAttribute('aria-label') === 'listText'){
                t.addEventListener('keydown', newLineFreeze);
            }else{
                t.addEventListener('keydown', addListEl);
            }
            break;

        default:
            return;
    }
}


function noteFunc(e){

    const standartCreaterReset = ['.createHeader', '#controls'];

    let t  = e.target;
    let cl = t.classList;
    let p  = t.parentNode;

    switch(true){
        case cl.contains('createNote'):
            creater.setAttribute('data-type', 'note')

            setHidden(creater, {
                t: ['.createList'],
                f: standartCreaterReset
            });
            break;

        case cl.contains('createList'):
            creater.setAttribute('data-type', 'list')

            setHidden(creater, {
                t: ['.createNote', '.createList'],
                f: [...standartCreaterReset, '.listCont']
            });
            break;


        case cl.contains('checkEl'):
            checkListChange(t);
            break;

        case cl.contains('delEl'):
            p.remove();
            break;

        case cl.contains('edit'):
            API.PUT(this);
            break;

        case cl.contains('add'):
            API.POST(creater);
            resetCreater();
            break;

        case cl.contains('cancel'):
            resetCreater();
            break;

        case cl.contains('delete'):
            API.DELETE(this);
            break;

        default:
            return;
    }
}
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// -------------------------------------------------------- CONTENTEDITABLE FUNCTIONS
function newLineFreeze(evt){
    if(evt.keyCode === 13){ evt.preventDefault() }
}

function newLineHandler(e){

    if(!e.target.lastChild || e.target.lastChild.nodeName.toLowerCase() != 'br'){
       e.target.appendChild(document.createElement('br'));
    }

    if (e.keyCode === 13) {
       e.preventDefault();
       const sel = window.getSelection();
       const range = sel.getRangeAt(0);
       const br = document.createElement('br');

       range.deleteContents();
       range.insertNode(br);
       range.setStartAfter(br);
       range.setEndAfter(br);
       range.collapse(false);

       sel.removeAllRanges();
       sel.addRange(range);
       return false;
   }
}
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// // -------------------------------------------------------- LIST FUNCTIONS
function checkListChange(t){
    if(t.hasAttribute('aria-checked')){
        const isCheked = (t.getAttribute('aria-checked')  === 'false') ? true : false;
        t.setAttribute('aria-checked', `${isCheked}`)
    }
}

function addListEl(e){
    if(!e.ctrlKey && !e.metaKey && !e.altKey && e.keyCode !== 13 && e.keyCode !== 9){

        const { parentNode } = e.target;
        const clone = parentNode.cloneNode(true)

        const textEl = clone.querySelector('.textEl');
        textEl.addEventListener('keydown', addListEl, false);

        this.previousSibling.setAttribute('aria-checked', false);
        this.removeAttribute('placeholder');
        this.setAttribute('aria-label', 'listText');

        this.removeEventListener('keydown', addListEl);
        this.addEventListener('keydown', newLineFreeze)

        this.parentNode.parentNode.appendChild(clone);
    }
    else{
        e.preventDefault();
    }
}
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// -------------------------------------------------------- CREATER FUNCTIONS
function removeAllLists(){
    const listCont = creater.querySelector('.listCont');
    if(listCont){
        const l = listCont.children.length;
        const sel = '.listEl:not(:last-child)';

        if(l > 1){
            const lists = listCont.querySelectorAll(sel);
            lists.forEach(list => list.remove());
        }
    }
}

function resetCreater(){
    removeAllLists();

    creater.removeAttribute('data-type');

    emptyHTML(createHeader, createNote);

    setHidden(creater, {
        t: ['.listCont', '.createHeader', '#controls'],
        f: ['.createList', '.createNote']
    });
}
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// -------------------------------------------------------- OTHER FUNCTIONS
function emptyHTML(...elems){
    elems.forEach(el => el.innerHTML = '')
}

function setHidden(parent, obj){
    if(obj.t) obj.t.forEach(el => parent.querySelector(el).hidden = true)
    if(obj.f) obj.f.forEach(el => parent.querySelector(el).hidden = false)
}