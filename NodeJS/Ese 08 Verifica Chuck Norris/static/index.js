let lstCategories;
let mainWrapper;

window.onload = async function () {
  
    let categories = await inviaRichiesta("GET", "/api/categories")
    if(categories)
        console.log(categories)
   

};

