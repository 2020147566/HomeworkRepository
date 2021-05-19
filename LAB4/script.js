var items;

fetch('product.json').then(function(response) {
  if(response.ok) {
    response.json().then(function(json) {
      items = json;
      initialize();
    });
  } else {
    console.log('Network request for product.json failed with response ' + response.status + ': ' + response.statusText);
  }
});

function initialize() {
  var category = document.querySelector('#category');
  var searchTerm = document.querySelector('#searchTerm');
  var searchBtn = document.querySelector('button');
  var main = document.querySelector('main');

  var lastCategory = category.value;
  var lastSearch = '';

  var categoryGroup;
  var finalGroup;

  finalGroup = items;
  updateDisplay();

  categoryGroup = [];
  finalGroup = [];

  searchBtn.onclick = selectCategory;

  function selectCategory(e) {
    e.preventDefault();

    categoryGroup = [];
    finalGroup = [];

    if(category.value === lastCategory && searchTerm.value.trim() === lastSearch) {
      return;
    } else {
      lastCategory = category.value;
      lastSearch = searchTerm.value.trim();
      if(category.value === '전체') {
        categoryGroup = items;
        selectitems();
      } else {
        var lowerCaseType = category.value.toLowerCase();
        for(var i = 0; i < items.length ; i++) {
          if(items[i].type === lowerCaseType) {
            categoryGroup.push(items[i]);
          }
        }

        selectitems();
      }
    }
  }

  function selectitems() {
    if(searchTerm.value.trim() === '') {
      finalGroup = categoryGroup;
      updateDisplay();
    } else {
      var lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
      for(var i = 0; i < categoryGroup.length ; i++) {
        if(categoryGroup[i].name.indexOf(lowerCaseSearchTerm) !== -1) {
          finalGroup.push(categoryGroup[i]);
        }
      }

      updateDisplay();
    }

  }

  function updateDisplay() {
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }

    if(finalGroup.length === 0) {
      var para = document.createElement('p');
      para.textContent = 'No results to display!';
      main.appendChild(para);
    } else {
      for(var i = 0; i < finalGroup.length; i++) {
        fetchBlob(finalGroup[i]);
      }
    }
  }

  function fetchBlob(product) {
    var url = 'images/' + product.image;
    fetch(url).then(function(response) {
      if(response.ok) {
        response.blob().then(function(blob) {
          var objectURL = URL.createObjectURL(blob);
          showProduct(objectURL, product);
        });
      } else {
        console.log('Network request for "' + product.name + '" image failed with response ' + response.status + ': ' + response.statusText);
      }
    });
  }

  function showProduct(objectURL, product) {
    var section = document.createElement('section');
    var para = document.createElement('p1');
    var image = document.createElement('img');

    section.setAttribute('class', product.type);

    para.textContent = '여기 클릭'


    image.src = objectURL;
    image.alt = product.name;

    main.appendChild(section);
    para.addEventListener('click', function(){
      let show = document.createElement('h2');
      let show2 = document.createElement('p');
      show.textContent = product.name;
      show2.textContent = product.price + '원';
      section.appendChild(show);
      section.appendChild(show2);
    })
    section.appendChild(para);
    section.appendChild(image);
  }
}

