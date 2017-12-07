
var searchText = document.getElementById('searchText');
var btnSearch = document.getElementById('btnSearch');
var resultsDiv = document.getElementById('resultsDiv');
var buttonsDiv = document.getElementById('buttonsDiv');
var pToken = '';
var q = '';

function getData (method, url, query) {
  pToken = '';
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    url += '&q=' + query;
    xhr.open(method, url);
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.send();
  });
}

function search(q) {
  resultsDiv.innerHTML = '';
  buttonsDiv.innerHTML = '';
  getData('GET', 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&type=video&key=AIzaSyDl178Db-Bg1CJPPToZEwK_vGI622FhDzE'+ pToken, q).then(function(response){
    var data = JSON.parse(response);
    data.items.forEach(function(item) {
      var videoId = item.id.videoId;
      var title = item.snippet.title;
      var thumbnailUrl = item.snippet.thumbnails.default.url;
      var description = item.snippet.description;
      var itemDiv = ` <div class='resultDiv'>
                        <img src=${thumbnailUrl}>
                        <h3>${title}</h3>
                        <p>${description}</p>
                      </div>
                    `;
      resultsDiv.innerHTML += itemDiv;
    });
    var nextPage = data.nextPageToken;
    var prevPage = data.prevPageToken;
    console.log(nextPage, prevPage);
    if (prevPage) {
      var prevBtn = document.createElement('button');
      prevBtn.textContent = 'Previous';
      prevBtn.id = 'btnPrev';
      prevBtn.addEventListener('click', function(){
        pToken = '&pageToken=' + prevPage;
        search();
      });
      buttonsDiv.appendChild(nextBtn);
    }
    if (nextPage) {
      var nextBtn = document.createElement('button');
      console.log(nextBtn);
      nextBtn.textContent = 'Next';
      nextBtn.id = 'btnNext';
      nextBtn.addEventListener('click', function(){
        pToken = '&pageToken=' + nextPage;
        search();
      });
      buttonsDiv.appendChild(nextBtn);
    }

  }).catch(function(error) {
    console.log(error);
  });
}

btnSearch.addEventListener('click', function() {
  q = searchText.value;
  search(q);
});
