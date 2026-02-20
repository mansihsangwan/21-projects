let draggedItem = null;

function itemDraggable(item){
    item.addEventListener('dragstart',()=>{
       draggedItem=item;
       item.classList.add('dragging')
    })
    item.addEventListener('dragend',()=>{
        draggedItem=null;
       item.classList.remove('dragging')
    })

    const deleteButton=item.querySelector(".delete-btn");
    if(deleteButton){
        deleteButton.addEventListener("click",(e)=>{
            e.stopPropagation();
            item.remove()
        })
    }
}

document.querySelectorAll(".items").forEach(item => {
    item.addEventListener("dragover", (e)=>{
        e.preventDefault();
        const afterElement=getDragAfterElement(item,e.clientY)
        if(!draggedItem) return ;
        if(afterElement==null){
             item.appendChild(draggedItem)
        }
        else{
            item.insertBefore(draggedItem,afterElement)
        }
    })
})

function getDragAfterElement(container,y){
   const items=[...container.querySelectorAll('.item:not(.dragging)')]
   return items.reduce((closest,child)=>{
     const box=child.getBoundingClientRect();
     const offset=y-(box.top+box.height/2);
     if(offset<0 && offset >closest.offset){
          return {offset:offset,element:child}
     }
     else{
        return closest;
     }
   },{offset:Number.NEGATIVE_INFINITY}).element;
}

document.querySelectorAll('.column').forEach(col=>{
    const taskInput=col.querySelector('.add-bar input');
    const addbutton=col.querySelector('.add-bar button');
    const itemsWrap=col.querySelector('.items');
    function addTask(){
        const taskName=(taskInput.value || '').trim();
        if(!taskName) return;
        const item = document.createElement("div");
        item.className = "item";
        item.draggable = true;
        item.textContent = taskName;
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.title = "Delete";
        deleteButton.textContent='x';
        item.appendChild(deleteButton)
        itemsWrap.appendChild(item)
        itemDraggable(item)
        taskInput.value=''
    }
    addbutton.addEventListener("click",addTask);
    taskInput.addEventListener('keydown',(e)=>{
        if(e.key==='Enter') addTask()
    })
});

document.querySelectorAll('.item').forEach(itemDraggable);