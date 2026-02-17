const colorPicker = document.getElementById("color");
const brushSizePicker = document.getElementById("BrushSize");
const penButton = document.getElementById("pen");
const eraserButton = document.getElementById("eraser");
const squareButton = document.getElementById("square");
const cleanButton = document.getElementById("clean");
const downloadButton = document.getElementById("download");
const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");
canvas.height = 600;
canvas.width = 1530;

// state variables
let isDrawing = false;
let currentTool = "square";
let isDrawingSquare = false;

ctx.strokeStyle = colorPicker.value;
ctx.lineWidth = brushSizePicker.value;
ctx.lineCap = "round";

function startDrwaing(event){
    if(isDrawingSquare){
        startX = event.offsetX;
        startY = event.offsetY;
        return;
    }
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
}

function stopDrwaing(event){
    if(isDrawingSquare) {
        let endX = event.offsetX;
        let endY = event.offsetY;
        let width = endX - startX;
        let height = endY - startY;
        ctx.strokeStyle = colorPicker.value;
        ctx.lineWidth = brushSizePicker.value;
        ctx.strokeRect(startX, startY, width, height);
        ctx.stroke();
        return;
    }
    isDrawing = false;
};

function draw(event) {
    if (!isDrawing) return;
    ctx.strokeStyle = currentTool === "eraser" ? "#ffffff" : colorPicker.value;
    ctx.lineWidth = brushSizePicker.value;
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
}

colorPicker.addEventListener("change", (event) => {
    ctx.strokeStyle = event.target.value;
});
brushSizePicker.addEventListener("change", (event) => {
    ctx.lineWidth = event.target.value;
});
penButton.addEventListener("click", () => {
    currentTool = "pen";
    isDrawingSquare = false;
    penButton.classList.add("active");
    eraserButton.classList.remove("active");
    squareButton.classList.remove("active");
});
eraserButton.addEventListener("click", () => {
    currentTool = "eraser";
    isDrawingSquare = false;
    eraserButton.classList.add("active");
    penButton.classList.remove("active");
    squareButton.classList.remove("active");
});

squareButton.addEventListener("click", () => {
    currentTool = "square";
    isDrawingSquare = true;
    squareButton.classList.add("active");
    penButton.classList.remove("active");
    eraserButton.classList.remove("active");
});

cleanButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

downloadButton.addEventListener("click", () => {
    let canvasUrl = canvas.toDataURL("image/png");
    let link = document.createElement("a");
    link.href = canvasUrl;
    link.download = "drawing.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

canvas.addEventListener("mousedown", startDrwaing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrwaing);