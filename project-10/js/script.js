const canvas = document.getElementById("canvas");
const fileInput = document.getElementById("inputFile");
const brightnessBtn=document.getElementById("brightness");
const contrastBtn=document.getElementById("contrast");
const saturationBtn=document.getElementById("saturation");
const blurBtn=document.getElementById("blur");
const grayScaleBtn=document.getElementById("grayScale");
const sepiaBtn=document.getElementById("sepia");
const resetBtn=document.getElementById("reset");
const downloadBtn=document.getElementById("downloadBtn");

const ctx=canvas.getContext("2d")
let image=new Image();
let isSepia=false;
const activeBtnColor="#4896fcff";
const btnColor="#ffdab3"

fileInput.addEventListener("change",(e) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload=()=>{
        image.src=reader.result;
    }
    reader.readAsDataURL(file)
})
image.onload=()=>{
  canvas.height=image.height;
  canvas.width=image.width;
  ctx.drawImage(image,0,0,canvas.width,canvas.height)
}

const applyFilter=()=>{
  const brightness = brightnessBtn.value;
  const contrast = contrastBtn.value;
  const saturation = saturationBtn.value;
  const blur = blurBtn.value;
  const grayScale = grayScaleBtn.checked ? 100 : 0;
  const sepia = isSepia ? 100 : 0;
  ctx.filter=`brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) grayscale(${grayScale}%) sepia(${sepia}%)`;
  ctx.drawImage(image,0,0,canvas.width,canvas.height)
  if(saturation ==0){
    grayScaleBtn.style.backgroundColor=activeBtnColor
   }else{
    grayScaleBtn.style.backgroundColor=btnColor
   }
}

function grayScale(){
  saturationBtn.value=0;
  applyFilter();
}

function handleSepiaFilter(){
  isSepia=!isSepia;
  applyFilter();
  if(isSepia){
     sepiaBtn.style.backgroundColor=activeBtnColor
   }
   else{
     sepiaBtn.style.backgroundColor=btnColor
   }
}

function handleReset(){
  brightnessBtn.value=100;
  contrastBtn.value=100;
  saturationBtn.value=100;
  blurBtn.value=0;
  if(isSepia){
    handleSepiaFilter()
  }
  applyFilter();
}

brightnessBtn.addEventListener("input",applyFilter);
contrastBtn.addEventListener("input",applyFilter);
saturationBtn.addEventListener("input",applyFilter);
blurBtn.addEventListener("input",applyFilter);
grayScaleBtn.addEventListener("click",grayScale);
sepiaBtn.addEventListener("click",handleSepiaFilter);
resetBtn.addEventListener("click",handleReset);

downloadBtn.addEventListener("click",()=>{
  const link=document.createElement("a");
  link.download="edited-image.png";
  link.href=canvas.toDataURL();
  link.click();
});