let myTable=document.getElementById('dataTable')
myTable.addEventListener('click',async (e)=>{
    let target=e.target
    let id=target.dataset.id
    if(target.classList.contains('delete')){
        fetch(`http://localhost:8000/blog/delete/${id}`,{
            method: 'POST',
        })
        target.parentElement.remove()
    }
})