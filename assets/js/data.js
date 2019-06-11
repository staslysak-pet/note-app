// PACK ALL DATA TO MONGO DATABASE
function packData(note){

    const type = note.getAttribute('data-type');
    const header= note.querySelector('.header').innerText;
    const OBJ = {
        type,
        header
    }
    const rExp  = /<br\s*[\/]?>/gi;
    const rExp2 = /&nbsp;/gi;

    if(type === 'note'){
        const noteTextData = note.querySelector('.noteText').innerHTML;
        const text = noteTextData.replace(rExp, '\n').replace(rExp2, '');

        return {
            ...OBJ,
            noteText: text
        };
    }
    if(type === 'list'){
        const lists = note.querySelectorAll('.textEl');

        const unchecked = [];
        const checked = [];

        for(let i = 0;i < lists.length - 1; i++){

            if(lists[i].previousSibling.getAttribute('aria-checked') === 'true'){
                checked.push(lists[i].innerText);
            }else{
                unchecked.push(lists[i].innerText);
            }

        }

        return {
            ...OBJ,
            list: {
                unchecked,
                checked
            }
        };
    }
}

// GET ID
const getNoteId = (note) => note.getAttribute('data-id')

const API ={
    POST: async (dataEl) => {
        try{
            const data = await packData(dataEl);
            const fetchObj = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(data)
            }

            await fetch('/', fetchObj)
                .then(() => window.location.href = '/')
                .catch(err => console.log(err))
        }catch(err){
            console.log(err)
        }
    },
    PUT: async (dataEl) => {
        try{
            const data = await packData(dataEl);
            const id = await getNoteId(dataEl);
            const fetchObj = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "PUT",
                body: JSON.stringify(data)
            }

            await fetch(`/${id}`, fetchObj)
                .then(() => window.location.href = '/')
                .catch(err => console.log(err))
        }catch(err){
            console.log(err)
        }
    },
    DELETE: async (dataEl) => {
        try{
            const id = await getNoteId(dataEl);

            await fetch(`/${id}`, { method: "DELETE" })
                .then(() => window.location.href = '/')
                .catch(err => console.log(err))
        }catch(err){
            console.log(err)
        }
    }
}