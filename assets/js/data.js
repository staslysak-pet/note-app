// PACK ALL DATA TO MONGO DATABASE
function packData(note){
    
    const type = note.getAttribute('data-type');
    const rExp  = /<br\s*[\/]?>/gi;
    const rExp2 = /&nbsp;/gi;

    if(type === 'note'){
        const headerData   = note.querySelector('.header').innerText;
        const noteTextData = note.querySelector('.noteText').innerHTML;
        const text = noteTextData.replace(rExp, '\n').replace(rExp2, '');

        return {
            type: type,
            header: headerData,
            noteText: text
        };
    }
    if(type === 'list'){
        const headerData = note.querySelector('.header').innerText;
        const lists      = note.querySelectorAll('.textEl:not([aria-label="newTodo"])');

        const normalArr  = [];
        const checkedArr = [];

        for(let i = 0;i < lists.length; i++){

            let text = lists[i].innerText;

            if(lists[i].previousElementSibling.getAttribute('aria-checked') === 'true'){
                checkedArr.push(text);
            }else{
                normalArr.push(text);
            }
        }

        return {
            type: type,
            header: headerData,
            list: {
                normal: normalArr,
                checked: checkedArr
            }
        };
    }
}

// GET ID
function getNoteId(note){
    return note.getAttribute('data-id');
}


// PUT REQUEST
async function putData(dataEl){
    try{    
        const noteData  = await packData(dataEl);
        const id        = await getNoteId(dataEl);
        const fetchObj  = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "PUT",
            body: JSON.stringify(noteData)
        }

        await fetch(`/${id}`, fetchObj)
            .then(() => window.location.href = '/')
            .catch(err => console.log(err))
    }catch(err){
        console.log(err)
    }
}

// DELETE REQUEST
async function deleteData(dataEl){
    try{
        const id = await getNoteId(dataEl);

        await fetch(`/${id}`, {method: "DELETE"})
            .then(() => window.location.href = '/')
            .catch(err => console.log(err))
    }catch(err){
        console.log(err)
    }    
}

// POST REQUEST
async function postData(dataEl){
    try{
        const noteData = await packData(dataEl);
        const fetchObj = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(noteData)
        }
        console.log(noteData);

        await fetch('/', fetchObj)
            .then(() => window.location.href = '/')
            .catch(err => console.log(err))
    }catch(err){
        console.log(err)
    }
}