
const productAPI = 'https://fakestoreapi.com/products';

const productList = async () => {
    const response = await fetch(productAPI);
    return response.json();
}
let products = [];

(async function init(){
    try{
        products = await productList();
        const list = document.getElementById("productList");
        const cards = products.map(prod =>
            `<div class="col-md-4">
                <div class="card" style="width: 18rem;">
                    <img src="${prod.image}" class="card-img-top" alt="..." width="200" height="150">
                    <div class="card-body">
                        <h5 class="card-title">${prod.title}</h5>
                        <p class="card-text">Price : $ ${prod.price}</p>
                        <button class="btn btn-primary" onclick="showDetails(${prod.id})">More Details</button>
                    </div>
                </div>
            </div>`
        ).join("");
        list.innerHTML = cards;

        const modal = new bootstrap.Modal(document.getElementById("productModal"));
        window.showDetails=function(productId){
            const productDetails = products.find(product => product.id === productId);
            console.log(productDetails);
            if(!productDetails) return;
            const modalTitle = document.getElementById("modalTitle");
            modalTitle.innerText = productDetails.title;
            const modalDesc = document.getElementById("modalDesc");
            modalDesc.innerText = productDetails.description;
            const modalPrice = document.getElementById("modalPrice");
            modalPrice.innerText = "$" + productDetails.price;
            const img=document.getElementById("modalImg");
            img.src=productDetails.image;
            img.alt=productDetails.title;
            modal.show();
        }
        let cartCount = 0;
        const cartBadge = document.getElementById("cartCount");
        function updateCart(){
            cartBadge.innerText = cartCount;
        }
        const addToCart = document.getElementById("modalAdd");
        addToCart.onclick = () => {
            cartCount++;
            updateCart()
            modal.hide();
        }

    } catch(err) {
        console.log("error", err);
    }
})()